/** Cadastro inicial de contas e cartões. Acesso deve permanecer restrito ao proprietário. */
function createFinanceAccount(input) {
  return financeWithLock_(function() {
    input = input || {};
    const name = String(input.nome || "").trim();
    const allowedTypes = ["corrente", "poupanca", "dinheiro", "carteira_digital", "investimento", "outra"];
    const type = String(input.tipo || "corrente");
    if (!name) throw new Error("Informe o nome da conta.");
    if (allowedTypes.indexOf(type) === -1) throw new Error("Tipo de conta inválido.");
    const now = financeNow_();
    const record = {
      id: financeUuid_(), usuario_id: getFinanceOwnerId_(), nome: name,
      instituicao: String(input.instituicao || "").trim(), tipo: type, moeda: "BRL",
      saldo_inicial_centavos: financeAssertMoney_(input.saldo_inicial_centavos || 0, "Saldo inicial", true),
      data_saldo_inicial: String(input.data_saldo_inicial || now.slice(0, 10)),
      incluida_no_saldo: input.incluida_no_saldo === false ? false : true,
      ativa: true, criado_em: now, atualizado_em: now
    };
    financeAppend_("Contas", record);
    financeAudit_("Contas", record.id, "CRIAR", "Conta cadastrada: " + name);
    return record;
  });
}

function createFinanceCard(input) {
  return financeWithLock_(function() {
    input = input || {};
    const name = String(input.nome || "").trim();
    if (!name) throw new Error("Informe o nome do cartão.");
    const closeDay = financeAssertDay_(input.dia_fechamento, "Dia de fechamento");
    const dueDay = financeAssertDay_(input.dia_vencimento, "Dia de vencimento");
    if (input.conta_pagamento_id && !financeFindById_("Contas", input.conta_pagamento_id)) {
      throw new Error("A conta de pagamento informada não existe.");
    }
    const now = financeNow_();
    const record = {
      id: financeUuid_(), usuario_id: getFinanceOwnerId_(), nome: name,
      bandeira: String(input.bandeira || ""), ultimos_quatro: String(input.ultimos_quatro || "").replace(/\D/g, "").slice(-4),
      conta_pagamento_id: String(input.conta_pagamento_id || ""),
      dia_fechamento: closeDay, dia_vencimento: dueDay,
      limite_centavos: input.limite_centavos === undefined || input.limite_centavos === "" ? "" : financeAssertMoney_(input.limite_centavos, "Limite", true),
      ativo: true, criado_em: now, atualizado_em: now
    };
    financeAppend_("Cartoes", record);
    financeAudit_("Cartoes", record.id, "CRIAR", "Cartão cadastrado: " + name);
    return record;
  });
}

/** Retorna os cartões ativos sem expor dados sensíveis além dos quatro últimos dígitos. */
function listFinanceCards() {
  return financeReadAll_("Cartoes").filter(function(card) {
    return card.ativo === true || String(card.ativo) === "TRUE";
  });
}

function listFinanceAccounts() {
  return financeReadAll_("Contas").filter(function(account) {
    return account.ativa === true || String(account.ativa) === "TRUE";
  });
}
