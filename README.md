# Sistema Financeiro

Aplicação web de controle financeiro pessoal, com interface **dark**, responsiva e pensada para celular, iPad e computador.

## Objetivos

- Centralizar receitas, despesas, transferências, cartões, contas e investimentos.
- Controlar faturas, compras parceladas e compromissos futuros.
- Acompanhar orçamento, metas, patrimônio e evolução financeira.
- Preservar a consistência dos registros e evitar dupla contagem.
- Manter a infraestrutura no custo zero sempre que os limites dos planos gratuitos permitirem.

## Arquitetura inicial

- **Frontend:** React + TypeScript + Tailwind CSS, como PWA.
- **Backend:** Google Apps Script.
- **Persistência inicial:** Google Sheets.
- **Versionamento:** GitHub.

A comunicação entre o frontend hospedado e o Apps Script será validada antes da escolha definitiva do mecanismo de autenticação e transporte. Não utilizar `mode: "no-cors"` como solução de API, pois isso impede a leitura normal da resposta pelo navegador.

## Documentação

- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/DATA_MODEL.md)
- [Regras financeiras](docs/FINANCIAL_RULES.md)
- [Roadmap](docs/ROADMAP.md)
- [Configuração do backend](apps-script/README.md)
- [Configuração do frontend](frontend/README.md)

## Situação

Fase 0 — arquitetura e especificação. Nenhuma planilha, credencial ou serviço externo foi criado ou conectado ainda.

## Princípios do projeto

1. Valores monetários armazenados como inteiros em centavos.
2. Identificadores UUID, sem depender da posição das linhas.
3. Datas e competência financeira armazenadas de forma explícita.
4. Operações financeiras auditáveis e idempotentes quando aplicável.
5. Dados privados nunca devem ser incluídos no repositório.
6. Backup exportável e restauração validada antes de sobrescrever dados.
7. Nenhuma integração paga será adotada sem aprovação explícita.
