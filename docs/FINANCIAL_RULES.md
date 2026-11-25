# Regras financeiras e invariantes

## Precisão monetária

Armazenar valores em centavos inteiros. Não usar ponto flutuante binário para somas financeiras. A interface converte para BRL apenas na apresentação.

## Tipos de movimentação

- Receita aumenta o resultado do período e o saldo da conta quando liquidada.
- Despesa reduz o resultado do período e o saldo da conta quando liquidada.
- Compra no cartão registra despesa/obrigação e compõe a fatura; não reduz imediatamente o saldo bancário.
- Pagamento de fatura reduz a conta de pagamento e a obrigação do cartão; não cria uma segunda despesa.
- Transferência entre contas próprias não altera receita, despesa ou patrimônio consolidado.
- Aporte transfere dinheiro para investimento; não é despesa de consumo.
- Resgate transfere valor do investimento para conta; não é receita operacional por si só.
- Rendimentos são registrados separadamente.
- Estornos devem referenciar o lançamento original.

## Competência de cartão

O fechamento é uma regra configurável por cartão. O cálculo considera a data local da compra e a regra de corte:

1. Determinar a data de fechamento aplicável ao ciclo.
2. Compra posterior ao fechamento pertence ao próximo ciclo.
3. Compra no próprio dia de fechamento precisa seguir uma convenção explícita por cartão; padrão inicial: compra no dia do fechamento entra no ciclo seguinte, sujeito à confirmação do emissor.
4. Derivar a competência da fatura em formato `YYYY-MM`.
5. Calcular o vencimento do ciclo e ajustar meses com menos dias.
6. Não assumir que fechamento e vencimento são imutáveis: emissores podem alterar datas.

Configuração inicial fornecida:
- Nubank: fechamento dia 27; vencimento dia 4.
- Inter: fechamento dia 5; vencimento dia 12.

Essas datas são parâmetros iniciais editáveis, não integração oficial com os bancos.

## Parcelamentos

- Dividir o valor total em centavos.
- Distribuir diferenças de arredondamento entre parcelas, garantindo que a soma seja exatamente igual ao total.
- Cada parcela possui vencimento/competência própria e referência à fatura.
- Cancelamento ou estorno deve tratar parcelas futuras e parcelas já pagas sem apagar histórico.
- Uma compra parcelada é uma única obrigação de origem com N parcelas; não multiplicar o valor total por N.

## Saldos

Saldo disponível por conta = saldo inicial + entradas liquidadas - saídas liquidadas.

Saldo consolidado exclui transferências internas duplicadas e deve deixar claro se considera ou não limites de crédito.

## Faturas

Total da fatura = soma dos lançamentos/parcelas válidos vinculados ao ciclo, menos créditos e estornos aplicáveis.

Pagamento parcial reduz o saldo em aberto. Uma fatura só é paga quando o total liquidado alcançar o total devido, respeitando ajustes e créditos.

## Orçamento

Gasto da categoria deve considerar despesas de consumo pela competência definida, sem incluir pagamento de fatura, transferências internas ou aportes.

## Patrimônio líquido

Patrimônio líquido = ativos - passivos. Definir uma única fonte para cada obrigação, evitando contar a fatura e a mesma compra novamente.

## Datas e fuso

Usar o fuso horário configurado para o usuário (padrão inicial: America/Bahia ou America/Sao_Paulo, a confirmar). Persistir datas sem conversões implícitas entre UTC e horário local.

## Integridade e idempotência

- Toda escrita crítica usa UUID.
- Requisições com a mesma `idempotency_key` não podem criar duplicatas.
- Escritas em múltiplas abas usam lock e registram operação correlacionada.
- Se uma etapa falhar, executar compensação ou marcar a operação para reconciliação.
- Validar soma das parcelas, referências e limites antes de confirmar a operação.
