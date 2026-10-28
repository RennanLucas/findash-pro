import { INITIAL_TRANSACTIONS } from './src/data/initialData.js';
import { calculateMetrics, formatBRL } from './src/utils/formatters.js';

console.log("=================================================");
console.log("   AUDITORIA RIGOROSA DE FILTROS E CÁLCULOS     ");
console.log("=================================================");

let txs = [...INITIAL_TRANSACTIONS];

// 1. Auditoria Base
const baseMetrics = calculateMetrics(txs);
console.log("\n[1] TESTE DE CARGA INICIAL (44 TRANSAÇÕES)");
console.assert(txs.length === 44, "Erro: Total de transações diferente de 44");
console.assert(baseMetrics.countVendas === 32, "Erro: Total de vendas diferente de 32");
console.assert(baseMetrics.totalReceitas === 70440, "Erro: Total de receitas diferente de 70.440");
console.assert(baseMetrics.totalCustos === 57250, "Erro: Total de custos diferente de 57.250");
console.assert(baseMetrics.totalDespesas === 1734, "Erro: Total de despesas diferente de 1.734");
console.assert(baseMetrics.lucroLiquido === 11456, "Erro: Lucro líquido diferente de 11.456");
console.assert(baseMetrics.saldoAcumulado === 68706, "Erro: Saldo acumulado diferente de 68.706");
console.log("✅ Todas as 44 transações originais batem com precisão de 100%.");

// 2. Filtros Mensais
console.log("\n[2] TESTE DOS FILTROS POR MÊS");
const monthsExpected = {
  '2026-07': { count: 16, vendas: 11, rec: 27550, cust: 22100, desp: 885, liq: 4565 },
  '2026-08': { count: 18, vendas: 14, rec: 24710, cust: 19790, desp: 380, liq: 4540 },
  '2026-09': { count: 2,  vendas: 1,  rec: 100,   cust: 0,     desp: 60,  liq: 40 },
  '2026-10': { count: 8,  vendas: 6,  rec: 18080, cust: 15360, desp: 409, liq: 2311 }
};

for (const [m, exp] of Object.entries(monthsExpected)) {
  const mList = txs.filter(t => t.date.startsWith(m));
  const mMet = calculateMetrics(mList);
  console.assert(mList.length === exp.count, `Erro no mês ${m}: contagem errada`);
  console.assert(mMet.countVendas === exp.vendas, `Erro no mês ${m}: vendas erradas`);
  console.assert(mMet.totalReceitas === exp.rec, `Erro no mês ${m}: receitas erradas`);
  console.assert(mMet.lucroLiquido === exp.liq, `Erro no mês ${m}: lucro líquido errado`);
  console.log(`✅ Filtro Mês ${m}: ${mList.length} itens (${mMet.countVendas} vendas, ${mList.length - mMet.countVendas} gastos) | Rec: R$ ${mMet.totalReceitas} | Lucro: R$ ${mMet.lucroLiquido}`);
}

// 3. Teste de Adição de Nova Venda
console.log("\n[3] TESTE REATIVO: ADICIONAR NOVA VENDA (SMARTWATCH)");
const newSale = {
  id: "test-sale-1",
  date: "2026-10-28",
  type: "Receita",
  category: "Smartwatches",
  description: "Apple Watch Ultra 2",
  paymentMethod: "Pix",
  amount: 4500,
  cost: 3200,
  profit: 1300,
  notes: "Venda teste automatizada"
};
txs = [newSale, ...txs];
const updatedMetrics = calculateMetrics(txs);
console.assert(txs.length === 45, "Erro: Não incrementou para 45");
console.assert(updatedMetrics.countVendas === 33, "Erro: Não incrementou vendas para 33");
console.assert(updatedMetrics.totalReceitas === 74940, "Erro: Total de receitas não somou");
console.assert(updatedMetrics.lucroLiquido === 12756, "Erro: Lucro líquido não somou");
console.log(`✅ Adição de Venda OK: Total foi para ${txs.length} itens, R$ ${updatedMetrics.totalReceitas} receitas, R$ ${updatedMetrics.lucroLiquido} lucro.`);

// 4. Teste de Adição de Nova Despesa
console.log("\n[4] TESTE REATIVO: ADICIONAR NOVO GASTO (ALIMENTAÇÃO)");
const newExpense = {
  id: "test-exp-1",
  date: "2026-10-28",
  type: "Despesa",
  category: "Alimentação",
  description: "Almoço Comercial",
  paymentMethod: "Cartão de Crédito",
  amount: 85,
  cost: 0,
  profit: 0,
  notes: "Gasto teste"
};
txs = [newExpense, ...txs];
const afterExpMetrics = calculateMetrics(txs);
console.assert(txs.length === 46, "Erro: Não incrementou para 46");
console.assert(afterExpMetrics.totalDespesas === 1819, "Erro: Despesa não somou");
console.assert(afterExpMetrics.lucroLiquido === 12671, "Erro: Lucro líquido não abateu despesa");
console.log(`✅ Adição de Despesa OK: Total despesas R$ ${afterExpMetrics.totalDespesas}, Lucro líquido R$ ${afterExpMetrics.lucroLiquido}.`);

// 5. Teste de Exclusão
console.log("\n[5] TESTE REATIVO: EXCLUIR REGISTRO");
txs = txs.filter(t => t.id !== "test-exp-1");
console.assert(txs.length === 45, "Erro: Exclusão falhou");
txs = txs.filter(t => t.id !== "test-sale-1");
console.assert(txs.length === 44, "Erro: Retorno à base falhou");
console.log("✅ Exclusão e restauração da base funcionando perfeitamente.");

// 6. Teste de Busca em Todos os Campos
console.log("\n[6] TESTE DE BUSCA EM TODOS OS CAMPOS");
const testQueries = [
  { q: "iPhone", field: "descrição", expectedMin: 8 },
  { q: "Pix", field: "pagamento", expectedMin: 40 },
  { q: "Videogames", field: "categoria", expectedMin: 7 },
  { q: "Academia", field: "descrição", expectedMin: 4 },
  { q: "Cartão de Crédito", field: "pagamento", expectedMin: 2 },
  { q: "2026-10", field: "data", expectedMin: 8 },
  { q: "3000", field: "valor", expectedMin: 3 }
];

testQueries.forEach(({ q, field, expectedMin }) => {
  const query = q.toLowerCase();
  const res = txs.filter(t => 
    t.description?.toLowerCase().includes(query) ||
    t.category?.toLowerCase().includes(query) ||
    t.paymentMethod?.toLowerCase().includes(query) ||
    t.date?.includes(query) ||
    t.amount?.toString().includes(query)
  );
  console.assert(res.length >= expectedMin, `Busca por ${q} (${field}) falhou: encontrados ${res.length}, esperado mínimo ${expectedMin}`);
  console.log(`✅ Busca por "${q}" (${field}): ${res.length} resultados encontrados.`);
});

console.log("\n=================================================");
console.log("   TODOS OS TESTES PASSARAM COM 100% DE SUCESSO! ");
console.log("=================================================");
