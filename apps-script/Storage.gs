/** Helpers de persistência em lote. Todas as chaves de relacionamento são UUIDs. */
function financeNow_() {
  return new Date().toISOString();
}

function financeUuid_() {
  return Utilities.getUuid();
}

function getFinanceSheet_(tableName) {
  if (!FINANCE_TABLES[tableName]) throw new Error("Tabela não permitida: " + tableName);
  const sheet = getFinanceSpreadsheet_().getSheetByName(tableName);
  if (!sheet) throw new Error("Banco não inicializado. Execute setupFinanceDatabase.");
  return sheet;
}

function getFinanceHeaders_(sheet) {
  const count = sheet.getLastColumn();
  if (!count) throw new Error("Cabeçalho ausente na aba " + sheet.getName());
  return sheet.getRange(1, 1, 1, count).getValues()[0].map(String);
}

function financeAppend_(tableName, record) {
  const sheet = getFinanceSheet_(tableName);
  const headers = getFinanceHeaders_(sheet);
  const row = headers.map(function(header) {
    return record[header] === undefined || record[header] === null ? "" : record[header];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
  return record;
}

function financeReadAll_(tableName) {
  const sheet = getFinanceSheet_(tableName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const headers = getFinanceHeaders_(sheet);
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map(function(row) {
    const item = {};
    headers.forEach(function(header, index) { item[header] = row[index]; });
    return item;
  });
}

function financeFindById_(tableName, id) {
  if (!id) return null;
  const records = financeReadAll_(tableName);
  for (let i = 0; i < records.length; i++) {
    if (String(records[i].id) === String(id)) return records[i];
  }
  return null;
}

function financeAudit_(entity, entityId, action, summary, correlationId) {
  financeAppend_("Auditoria", {
    id: financeUuid_(),
    usuario_id: getFinanceOwnerId_(),
    entidade: entity,
    entidade_id: entityId || "",
    acao: action,
    data_evento: financeNow_(),
    resumo: String(summary || "").slice(0, 300),
    correlation_id: correlationId || ""
  });
}

function financeWithLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function financeAssertMoney_(value, fieldName, allowZero) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || (allowZero ? number < 0 : number <= 0)) {
    throw new Error(fieldName + " deve ser um valor inteiro em centavos " + (allowZero ? "não negativo." : "maior que zero."));
  }
  return number;
}

function financeAssertDay_(value, fieldName) {
  const day = Number(value);
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new Error(fieldName + " deve estar entre 1 e 31.");
  return day;
}
