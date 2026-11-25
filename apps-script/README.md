# Backend — Google Apps Script

Primeira base do backend do Sistema Financeiro, compatível com o runtime V8 do Apps Script.

## Arquivos implementados

- `Schema.gs`: definição das 16 tabelas e inicialização idempotente das abas/cabeçalhos.
- `Storage.gs`: leitura em lote, inserção, UUIDs, validação monetária, auditoria e locks.
- `AccountsCards.gs`: cadastro e listagem inicial de contas e cartões.
- `Invoices.gs`: cálculo do ciclo de fatura, criação da fatura e divisão exata de parcelas.
- `Tests.gs`: testes manuais das regras puras de competência e parcelamento.
- `appsscript.json`: runtime V8 e fuso inicial America/Bahia.

## Configuração

1. Crie uma planilha Google privada para desenvolvimento.
2. Crie um projeto Apps Script (script.google.com) e adicione os arquivos desta pasta, mantendo os nomes.
3. No projeto Apps Script, abra **Configurações do projeto → Propriedades do script**.
4. Crie a propriedade `FINANCE_SPREADSHEET_ID` com o ID da planilha (o trecho entre `/d/` e `/edit` na URL). Não coloque esse ID no GitHub.
5. Salve e execute `setupFinanceDatabase` no editor. Revise as permissões solicitadas e autorize somente se reconhecer o projeto e a planilha.
6. Execute `runFinanceRuleTests`; o retorno esperado é `ok: true` e cinco testes aprovados.
7. Depois da inicialização, cadastre as contas e os cartões pelo backend. Os cartões iniciais previstos são Nubank (fechamento 27, vencimento 4) e Inter (fechamento 5, vencimento 12); a conta de pagamento pode ser vinculada quando a conta correspondente estiver cadastrada.

## Funções disponíveis nesta etapa

- `setupFinanceDatabase()`: cria as 16 abas sem apagar dados existentes e completa cabeçalhos ausentes.
- `createFinanceAccount(input)`: cadastra conta com saldo inicial em centavos.
- `createFinanceCard(input)`: cadastra cartão; não aceita número completo nem CVV.
- `listFinanceAccounts()` e `listFinanceCards()`: listam registros ativos.
- `calculateFinanceInvoiceCycle(data, fechamento, vencimento)`: calcula fechamento, vencimento e competência.
- `getOrCreateFinanceInvoice(cartaoId, dataCompra)`: encontra ou cria a fatura do ciclo.
- `splitFinanceInstallments(totalCentavos, quantidade)`: divide parcelas sem perder centavos.

## Convenções e limites importantes

- Valores monetários são inteiros em centavos.
- O corte padrão considera que compra no próprio dia do fechamento vai para o ciclo seguinte. Essa regra deve ser confirmada com o emissor e poderá ser configurada por cartão.
- A competência da fatura nesta implementação corresponde ao mês do vencimento.
- Os locks reduzem colisões de escrita, mas Google Sheets não oferece transações relacionais. Operações com múltiplas abas ainda precisarão de estratégia de reconciliação.
- A função de cadastro é uma camada interna de aplicação, não uma API pública autenticada. **Não implante como Web App aberto.**
- Ainda não existe autenticação de usuário final, endpoint HTTP, lançamento de transações, pagamento de faturas ou integração bancária.
- Não há planilha conectada nem implantação realizada por este repositório. O proprietário deve configurar a planilha privada e autorizar o Apps Script.

## Segurança

Nunca commite IDs de planilha, tokens, senhas ou dados financeiros reais. Mantenha a planilha privada. A camada HTTP só será implementada depois de uma prova de conceito de autenticação, CORS e redirecionamento que não exponha dados.
