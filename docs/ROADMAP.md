# Roadmap

## Fase 0 — Arquitetura e especificação

- [x] Confirmar escopo completo e tema dark.
- [x] Definir repositório oficial.
- [x] Documentar arquitetura inicial.
- [x] Documentar modelo de dados.
- [x] Documentar invariantes financeiros.
- [ ] Validar estratégia de autenticação e comunicação frontend/Apps Script.
- [ ] Confirmar fuso horário e regras de fechamento no dia exato.

## Fase 1 — Fundação

- [ ] Criar planilha de desenvolvimento.
- [ ] Implementar inicialização idempotente das abas e cabeçalhos.
- [ ] Implementar camada de leitura/escrita em lote.
- [ ] Implementar IDs, validações, locks e auditoria.
- [ ] Criar testes de regras financeiras com dados fictícios.

## Fase 2 — Backend financeiro

- [ ] CRUD de contas, cartões e categorias.
- [ ] Receitas, despesas e transferências.
- [ ] Faturas, fechamento e pagamentos parciais.
- [ ] Parcelamentos e estornos.
- [ ] Saldos e reconciliação.
- [ ] Orçamentos, investimentos, patrimônio e metas.
- [ ] Backup e restauração com validação.

## Fase 3 — Frontend

- [ ] Estrutura React + TypeScript.
- [ ] Design system dark responsivo.
- [ ] Navegação e dashboard.
- [ ] Formulários e listagens.
- [ ] Cartões e faturas.
- [ ] Relatórios, investimentos e patrimônio.
- [ ] Manifesto e instalação PWA.

## Fase 4 — Qualidade e publicação

- [ ] Testes de integração.
- [ ] Testes em celular e iPad.
- [ ] Revisão de segurança e privacidade.
- [ ] Configuração de produção sem segredos no Git.
- [ ] Publicação e documentação de operação.

## Critérios de aceite

- Nenhuma compra ou pagamento contado duas vezes.
- Soma das parcelas igual ao valor original.
- Transferências internas neutras no resultado consolidado.
- Fechamento correto em virada de mês e de ano.
- Saldos reconciliáveis com o histórico.
- Backup restaurável e validado.
- Layout utilizável em telas pequenas e grandes.
