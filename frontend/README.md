# Frontend — PWA

Esta pasta receberá a aplicação React.

## Stack prevista

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide
- PWA / Web App Manifest

## Diretrizes de interface

- Tema dark como padrão.
- Layout mobile-first, com navegação adequada a celular e iPad.
- Componentes acessíveis, foco visível e contraste suficiente.
- Valores em BRL e datas no padrão brasileiro.
- Formulários com validação e mensagens claras.
- Dashboard com saldo disponível, receitas, despesas, faturas e alertas.
- Não mostrar dados fictícios como se fossem dados reais.
- Estados de carregamento, vazio, erro e ausência de conexão.

## Segurança no cliente

Não incluir credenciais financeiras ou segredos em variáveis públicas do build. O cliente não é autoridade para cálculo de saldo, fatura ou permissão. Toda operação deve ser validada no backend.

## Desenvolvimento

Os comandos e dependências serão definidos quando o scaffold executável for criado. A integração com o backend depende da decisão técnica documentada em [Arquitetura](../docs/ARCHITECTURE.md).
