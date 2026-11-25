# Backend — Google Apps Script

Esta pasta conterá o código-fonte do backend.

## Pré-requisitos

- Conta Google do proprietário.
- Planilha privada para desenvolvimento.
- Projeto Apps Script vinculado ou independente.
- Fuso horário do projeto configurado de acordo com a preferência do usuário.

## Configuração prevista

1. Criar uma planilha privada de desenvolvimento.
2. Criar um projeto Apps Script.
3. Configurar o ID da planilha em Script Properties (não no código versionado).
4. Adicionar os arquivos do backend.
5. Executar a função de inicialização para criar abas e cabeçalhos.
6. Autorizar os escopos mínimos necessários.
7. Testar com dados fictícios.
8. Só então avaliar implantação como Web App e política de acesso.

## Segurança

Não publicar o Web App com acesso irrestrito. A implantação deve exigir uma identidade autorizada e o backend deve validar cada operação. Não colocar tokens, IDs privados ou dados reais no Git.

## Integração com o frontend

Antes de adotar uma API independente, será feito um teste de prova de conceito para validar CORS, redirecionamentos, autenticação e leitura da resposta. `no-cors` não é uma solução válida para uma API que precisa retornar JSON legível.

## Estado

Ainda não há planilha nem implantação conectada. Os arquivos de implementação serão adicionados após a validação do fluxo de autenticação e transporte.
