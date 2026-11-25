# Arquitetura da aplicação

## Visão geral

```text
[ PWA: React + TypeScript ]
          |
          | HTTPS / sessão autenticada
          v
[ Camada de aplicação e validação ]
          |
          v
[ Google Apps Script ]
          |
          v
[ Google Sheets ]
```

O desenho separa interface, regras de negócio e persistência. A interface não calcula saldos definitivos nem decide a competência de faturas: essas regras pertencem ao backend.

## Componentes

### Frontend

- React + TypeScript.
- Tailwind CSS com tema dark.
- React Router para navegação.
- Recharts para visualizações.
- Lucide para ícones.
- PWA com manifesto, ícones e estratégia de cache somente para recursos estáticos.
- Formatação pt-BR e moeda BRL.

O cache offline não deve armazenar respostas financeiras sensíveis em cache compartilhado. A sincronização offline de lançamentos será uma etapa posterior, com fila local, identificadores idempotentes e resolução de conflitos.

### Backend

Google Apps Script será responsável por:

- Validar payloads e permissões.
- Aplicar regras de negócio.
- Gerar IDs e timestamps.
- Registrar lançamentos e eventos relacionados.
- Calcular faturas, saldos, orçamento e patrimônio.
- Validar importações e backups.
- Registrar erros sem expor dados financeiros em logs.

A camada HTTP será definida após um teste técnico de comunicação entre a origem do frontend e o domínio do Apps Script. Opções a avaliar: interface servida pelo próprio Apps Script com `google.script.run`, ou frontend independente com um fluxo de autenticação e transporte compatível com CORS e redirecionamentos do Apps Script.

### Persistência

Google Sheets será o armazenamento inicial. Cada aba representa uma tabela lógica, com cabeçalho estável e UUID como chave primária.

A aplicação deve usar `LockService` em operações de escrita concorrentes e validar referências antes de persistir dados.

## Segurança e privacidade

- Nunca commitar tokens, senhas, IDs privados de sessão ou chaves.
- Guardar configurações sensíveis em Script Properties quando aplicável.
- Restringir o acesso ao Web App; não publicar uma API financeira aberta.
- Verificar a identidade e autorização no backend, não apenas na interface.
- Evitar registrar descrições, valores e outros dados pessoais em logs.
- Proteger exportações e backups.
- Implementar validação de entrada e limites de tamanho.
- Considerar que Google Sheets não oferece transações relacionais completas; operações que envolvem várias abas precisam de estratégia de consistência, locks e compensação em caso de falha.

## Limites e evolução

Sheets é adequado para a primeira versão individual e volume moderado. Não é um banco relacional nem oferece isolamento transacional completo. Se o volume, concorrência ou necessidade multiusuário crescer, a migração para um banco de dados apropriado deverá ser avaliada. Nenhuma migração será feita sem aprovação.

## Ambientes

- Desenvolvimento: dados fictícios e planilha de teste.
- Produção: planilha privada do proprietário.
- Segredos e IDs reais ficam fora do Git.
