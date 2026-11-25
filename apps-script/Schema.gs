/**
 * Ciclo Financeiro — schema e inicialização do Google Sheets.
 * Configure FINANCE_SPREADSHEET_ID em Script Properties antes de executar.
 */
const FINANCE_TABLES = {
  Configuracoes: ["chave", "valor", "atualizado_em"],
  Usuarios: ["id", "nome", "email_normalizado", "status", "criado_em", "atualizado_em"],
  Contas: ["id", "usuario_id", "nome", "instituicao", "tipo", "moeda", "saldo_inicial_centavos", "data_saldo_inicial", "incluida_no_saldo", "ativa", "criado_em", "atualizado_em"],
  Cartoes: ["id", "usuario_id", "nome", "bandeira", "ultimos_quatro", "conta_pagamento_id", "dia_fechamento", "dia_vencimento", "limite_centavos", "ativo", "criado_em", "atualizado_em"],
  Categorias: ["id", "usuario_id", "nome", "natureza", "categoria_pai_id", "cor", "icone", "ativa"],
  Transacoes: ["id", "usuario_id", "tipo", "descricao", "valor_centavos", "data_competencia", "data_movimento", "categoria_id", "conta_id", "cartao_id", "fatura_id", "parcelamento_id", "parcela_numero", "status", "observacoes", "origem", "idempotency_key", "criado_em", "atualizado_em", "cancelado_em"],
  Transferencias: ["id", "usuario_id", "conta_origem_id", "conta_destino_id", "valor_centavos", "data_movimento", "transacao_saida_id", "transacao_entrada_id", "status", "criado_em"],
  Parcelamentos: ["id", "usuario_id", "descricao", "valor_total_centavos", "quantidade_parcelas", "valor_parcela_centavos", "data_primeira_parcela", "cartao_id", "categoria_id", "status", "criado_em"],
  Faturas: ["id", "usuario_id", "cartao_id", "competencia", "data_fechamento", "data_vencimento", "total_centavos", "total_pago_centavos", "status", "paga_em", "criado_em", "atualizado_em"],
  Orcamentos: ["id", "usuario_id", "categoria_id", "competencia", "limite_centavos", "alerta_percentual", "criado_em", "atualizado_em"],
  Investimentos: ["id", "usuario_id", "instituicao", "nome_ativo", "classe", "ticker", "quantidade", "preco_medio_centavos", "moeda", "ativo", "criado_em", "atualizado_em"],
  Movimentos_Investimentos: ["id", "usuario_id", "investimento_id", "tipo", "data_movimento", "valor_centavos", "quantidade", "observacoes", "transacao_id", "criado_em"],
  Patrimonio: ["id", "usuario_id", "nome", "tipo", "natureza", "valor_atual_centavos", "data_referencia", "instituicao", "observacoes", "ativo", "criado_em", "atualizado_em"],
  Metas: ["id", "usuario_id", "nome", "descricao", "valor_objetivo_centavos", "valor_atual_centavos", "data_alvo", "conta_reserva_id", "status", "criado_em", "atualizado_em"],
  Historico_Saldos: ["id", "usuario_id", "entidade_tipo", "entidade_id", "data_referencia", "saldo_centavos", "origem_calculo", "criado_em"],
  Auditoria: ["id", "usuario_id", "entidade", "entidade_id", "acao", "data_evento", "resumo", "correlation_id"]
};

function getFinanceSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty("FINANCE_SPREADSHEET_ID");
  if (!id) throw new Error("Configure FINANCE_SPREADSHEET_ID nas Script Properties.");
  return SpreadsheetApp.openById(id);
}

/** Cria abas ausentes e completa cabeçalhos sem apagar dados existentes. */
function setupFinanceDatabase() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ss = getFinanceSpreadsheet_();
    const created = [];
    Object.keys(FINANCE_TABLES).forEach(function(name) {
      let sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
        created.push(name);
      }
      const headers = FINANCE_TABLES[name];
      const lastColumn = Math.max(sheet.getLastColumn(), headers.length);
      const existing = sheet.getLastRow() > 0
        ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0]
        : [];
      const hasHeader = existing.some(function(value) { return String(value).trim() !== ""; });
      if (!hasHeader) {
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.setFrozenRows(1);
      } else {
        headers.forEach(function(header) {
          if (existing.indexOf(header) === -1) {
            const nextColumn = sheet.getLastColumn() + 1;
            sheet.getRange(1, nextColumn).setValue(header);
          }
        });
      }
    });
    seedFinanceSettings_(ss);
    return { ok: true, spreadsheetName: ss.getName(), createdSheets: created, tables: Object.keys(FINANCE_TABLES).length };
  } finally {
    lock.releaseLock();
  }
}

function seedFinanceSettings_(ss) {
  const sheet = ss.getSheetByName("Configuracoes");
  const values = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().flat() : [];
  const existing = {};
  values.forEach(function(key) { existing[String(key)] = true; });
  const now = new Date().toISOString();
  const defaults = [
    ["moeda", "BRL"],
    ["fuso_horario", "America/Bahia"],
    ["versao_esquema", "1"]
  ];
  const missing = defaults.filter(function(item) { return !existing[item[0]]; })
    .map(function(item) { return [item[0], item[1], now]; });
  if (missing.length) sheet.getRange(sheet.getLastRow() + 1, 1, missing.length, 3).setValues(missing);
}

/** Gera um identificador estável para a instalação individual inicial. */
function getFinanceOwnerId_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("FINANCE_OWNER_ID");
  if (!id) {
    id = Utilities.getUuid();
    props.setProperty("FINANCE_OWNER_ID", id);
  }
  return id;
}
