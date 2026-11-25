# Modelo de dados — Google Sheets

## Convenções

- Todas as tabelas têm `id` UUID como chave primária, exceto tabelas de configuração singleton.
- Campos de relacionamento armazenam UUIDs, nunca número da linha.
- Datas de evento: ISO 8601 (`YYYY-MM-DD`) ou timestamp ISO com fuso quando houver horário.
- Competências: `YYYY-MM`.
- Valores monetários: inteiros em centavos (ex.: R$ 25,50 = `2550`).
- Taxas percentuais: decimal documentado; não misturar percentual e fração.
- Campos de status usam enumerações documentadas.
- Registros financeiros não devem ser apagados fisicamente em operações comuns; usar status de cancelamento/estorno e trilha de auditoria.

## Tabelas

### Configuracoes

`chave`, `valor`, `atualizado_em`.

Preferências como moeda, fuso horário, início do mês orçamentário e versão do esquema. Não armazenar segredos aqui.

### Usuarios

`id`, `nome`, `email_normalizado`, `status`, `criado_em`, `atualizado_em`.

A primeira implantação será individual. O campo de proprietário e a estrutura de IDs permitem evolução futura, mas não significam que autenticação multiusuário esteja implementada.

### Contas

`id`, `usuario_id`, `nome`, `instituicao`, `tipo`, `moeda`, `saldo_inicial_centavos`, `data_saldo_inicial`, `incluida_no_saldo`, `ativa`, `criado_em`, `atualizado_em`.

Tipos iniciais: corrente, poupança, dinheiro, carteira digital, investimento e outra.

### Cartoes

`id`, `usuario_id`, `nome`, `bandeira`, `ultimos_quatro`, `conta_pagamento_id`, `dia_fechamento`, `dia_vencimento`, `limite_centavos`, `ativo`, `criado_em`, `atualizado_em`.

Não armazenar número completo, CVV, senha ou credenciais do cartão.

### Categorias

`id`, `usuario_id`, `nome`, `natureza`, `categoria_pai_id`, `cor`, `icone`, `ativa`.

Natureza: receita, despesa ou ambas. Permite subcategorias.

### Transacoes

`id`, `usuario_id`, `tipo`, `descricao`, `valor_centavos`, `data_competencia`, `data_movimento`, `categoria_id`, `conta_id`, `cartao_id`, `fatura_id`, `parcelamento_id`, `parcela_numero`, `status`, `observacoes`, `origem`, `idempotency_key`, `criado_em`, `atualizado_em`, `cancelado_em`.

Tipos: receita, despesa, transferencia_saida, transferencia_entrada, aporte, resgate, rendimento, ajuste e pagamento_fatura. Transferências e pagamento de fatura têm vínculo com a operação correspondente para não duplicar receitas/despesas.

### Transferencias

`id`, `usuario_id`, `conta_origem_id`, `conta_destino_id`, `valor_centavos`, `data_movimento`, `transacao_saida_id`, `transacao_entrada_id`, `status`, `criado_em`.

### Parcelamentos

`id`, `usuario_id`, `descricao`, `valor_total_centavos`, `quantidade_parcelas`, `valor_parcela_centavos`, `data_primeira_parcela`, `cartao_id`, `categoria_id`, `status`, `criado_em`.

### Faturas

`id`, `usuario_id`, `cartao_id`, `competencia`, `data_fechamento`, `data_vencimento`, `total_centavos`, `total_pago_centavos`, `status`, `paga_em`, `criado_em`, `atualizado_em`.

Status: aberta, fechada, parcialmente_paga, paga ou cancelada. O total deve ser reconciliável com as parcelas/lançamentos vinculados.

### Orcamentos

`id`, `usuario_id`, `categoria_id`, `competencia`, `limite_centavos`, `alerta_percentual`, `criado_em`, `atualizado_em`.

### Investimentos

`id`, `usuario_id`, `instituicao`, `nome_ativo`, `classe`, `ticker`, `quantidade`, `preco_medio_centavos`, `moeda`, `ativo`, `criado_em`, `atualizado_em`.

### Movimentos_Investimentos

`id`, `usuario_id`, `investimento_id`, `tipo`, `data_movimento`, `valor_centavos`, `quantidade`, `observacoes`, `transacao_id`, `criado_em`.

Tipos: aporte, compra, venda, resgate, dividendo, juros, taxa e ajuste.

### Patrimonio

`id`, `usuario_id`, `nome`, `tipo`, `natureza`, `valor_atual_centavos`, `data_referencia`, `instituicao`, `observacoes`, `ativo`, `criado_em`, `atualizado_em`.

Natureza: ativo ou passivo. Dívidas de cartão não podem ser somadas novamente se já estiverem representadas no passivo calculado das faturas.

### Metas

`id`, `usuario_id`, `nome`, `descricao`, `valor_objetivo_centavos`, `valor_atual_centavos`, `data_alvo`, `conta_reserva_id`, `status`, `criado_em`, `atualizado_em`.

### Historico_Saldos

`id`, `usuario_id`, `entidade_tipo`, `entidade_id`, `data_referencia`, `saldo_centavos`, `origem_calculo`, `criado_em`.

### Auditoria

`id`, `usuario_id`, `entidade`, `entidade_id`, `acao`, `data_evento`, `resumo`, `correlation_id`.

Não registrar segredos nem conteúdo financeiro sensível desnecessário.

## Índices lógicos

Sheets não possui índices SQL. Para reduzir leituras, o backend deverá carregar intervalos em lote e filtrar em memória, mantendo mapas por UUID durante cada execução. Evitar leitura célula a célula.

## Ordem de criação

1. Configuracoes
2. Usuarios
3. Contas
4. Cartoes
5. Categorias
6. Transacoes
7. Transferencias
8. Parcelamentos
9. Faturas
10. Orcamentos
11. Investimentos
12. Movimentos_Investimentos
13. Patrimonio
14. Metas
15. Historico_Saldos
16. Auditoria
