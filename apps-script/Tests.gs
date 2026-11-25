/** Testes manuais executáveis pelo editor do Apps Script. Não acessam planilha. */
function runFinanceRuleTests() {
  const results = [];
  function check(name, condition) {
    if (!condition) throw new Error("Falhou: " + name);
    results.push(name);
  }

  const beforeClose = calculateFinanceInvoiceCycle("2026-11-26", 27, 4);
  check("compra antes do fechamento", beforeClose.data_fechamento === "2026-11-27" &&
    beforeClose.data_vencimento === "2026-12-04" && beforeClose.competencia === "2026-12");

  const onClose = calculateFinanceInvoiceCycle("2026-11-27", 27, 4);
  check("compra no fechamento vai ao ciclo seguinte", onClose.data_fechamento === "2026-12-27" &&
    onClose.data_vencimento === "2027-01-04");

  const afterClose = calculateFinanceInvoiceCycle("2026-11-28", 27, 4);
  check("compra após fechamento", afterClose.data_fechamento === "2026-12-27");

  const shortMonth = calculateFinanceInvoiceCycle("2027-01-30", 31, 5);
  check("fechamento em mês curto", shortMonth.data_fechamento === "2027-02-28");

  const installments = splitFinanceInstallments(10000, 3);
  check("parcelas somam exatamente o total", installments.join(",") === "3334,3333,3333" &&
    installments.reduce(function(sum, value) { return sum + value; }, 0) === 10000);

  return { ok: true, passed: results.length, tests: results };
}
