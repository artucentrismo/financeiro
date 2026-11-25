/**
 * Motor de competência de cartão.
 * Convenção inicial: compra no dia do fechamento pertence ao próximo ciclo.
 * A competência da fatura é o mês do vencimento.
 */
function financeDateParts_(isoDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDate || ""));
  if (!match) throw new Error("Data inválida. Use YYYY-MM-DD.");
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error("Data inexistente.");
  }
  return { year: year, month: month, day: day };
}

function financeMonthDate_(year, month, day) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  const actualDay = Math.min(day, lastDay);
  const date = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), actualDay));
  return date.toISOString().slice(0, 10);
}

function financeAddMonths_(year, month, amount) {
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

function calculateFinanceInvoiceCycle(purchaseDate, closingDay, dueDay) {
  const parts = financeDateParts_(purchaseDate);
  const close = financeAssertDay_(closingDay, "Dia de fechamento");
  const due = financeAssertDay_(dueDay, "Dia de vencimento");
  const closingMonth = financeAddMonths_(parts.year, parts.month, parts.day >= close ? 1 : 0);
  const dueMonth = financeAddMonths_(closingMonth.year, closingMonth.month, 1);
  const closingDate = financeMonthDate_(closingMonth.year, closingMonth.month, close);
  const dueDate = financeMonthDate_(dueMonth.year, dueMonth.month, due);
  return {
    data_fechamento: closingDate,
    data_vencimento: dueDate,
    competencia: dueDate.slice(0, 7)
  };
}

/** Calcula e/ou cria a fatura correspondente à compra. */
function getOrCreateFinanceInvoice(cardId, purchaseDate) {
  return financeWithLock_(function() {
    const card = financeFindById_("Cartoes", cardId);
    if (!card || !(card.ativo === true || String(card.ativo) === "TRUE")) throw new Error("Cartão não encontrado ou inativo.");
    const cycle = calculateFinanceInvoiceCycle(purchaseDate, card.dia_fechamento, card.dia_vencimento);
    const invoices = financeReadAll_("Faturas");
    const existing = invoices.filter(function(invoice) {
      return String(invoice.cartao_id) === String(cardId) &&
        String(invoice.competencia) === cycle.competencia &&
        String(invoice.status) !== "cancelada";
    })[0];
    if (existing) return existing;
    const now = financeNow_();
    const record = {
      id: financeUuid_(), usuario_id: getFinanceOwnerId_(), cartao_id: cardId,
      competencia: cycle.competencia, data_fechamento: cycle.data_fechamento,
      data_vencimento: cycle.data_vencimento, total_centavos: 0,
      total_pago_centavos: 0, status: "aberta", paga_em: "",
      criado_em: now, atualizado_em: now
    };
    financeAppend_("Faturas", record);
    financeAudit_("Faturas", record.id, "CRIAR", "Fatura criada para " + cycle.competencia);
    return record;
  });
}

/** Divide total em parcelas exatas, distribuindo os centavos excedentes nas primeiras. */
function splitFinanceInstallments(totalCents, count) {
  const total = financeAssertMoney_(totalCents, "Valor total", false);
  const quantity = Number(count);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 120) throw new Error("Quantidade de parcelas deve estar entre 1 e 120.");
  const base = Math.floor(total / quantity);
  const remainder = total % quantity;
  return Array.from({ length: quantity }, function(_, index) {
    return base + (index < remainder ? 1 : 0);
  });
}
