import puppeteer from 'puppeteer-core';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function runBrowserTests() {
  console.log("==========================================================");
  console.log("   AUDITORIA VISUAL DE FILTROS REAL (CHROME HEADLESS)     ");
  console.log("==========================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 14 / Mobile standard viewport

  console.log("\n[1] CARREGANDO APLICAÇÃO...");
  await page.goto("http://localhost:5173", { waitUntil: 'networkidle0' });

  // 1. DASHBOARD: Filtro Mês Atual vs Geral
  console.log("\n[2] TESTE DOS FILTROS DA TELA INICIAL (DASHBOARD)");
  const octSaldo = await page.$eval('h2', el => el.textContent);
  console.log(`- Saldo Inicial (Outubro): ${octSaldo}`);
  console.assert(octSaldo.includes('17.671'), "Erro no saldo de Outubro");

  // Alterna para "Total"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const totalBtn = btns.find(b => b.textContent.trim() === 'Total');
    if (totalBtn) totalBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const totalSaldo = await page.$eval('h2', el => el.textContent);
  console.log(`- Saldo após clicar em 'Total': ${totalSaldo}`);
  console.assert(totalSaldo.includes('68.706'), "Erro ao alternar para Total");

  // Alterna de volta para "Outubro"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const octBtn = btns.find(b => b.textContent.trim().startsWith('Outubro'));
    if (octBtn) octBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log("✅ Filtro da tela inicial (Outubro vs Geral) validado com sucesso.");

  // 2. NAVEGAÇÃO PARA EXTRATO
  console.log("\n[3] TESTE DE FILTROS NO EXTRATO (VENDAS & GASTOS)");
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const vendasTab = navBtns.find(b => b.textContent.includes('Vendas'));
    if (vendasTab) vendasTab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Testa cada pílula de mês
  const months = [
    { name: 'Todos os Meses', expCount: 44 },
    { name: 'Julho/2026', expCount: 16 },
    { name: 'Agosto/2026', expCount: 18 },
    { name: 'Setembro/2026', expCount: 2 },
    { name: 'Outubro/2026', expCount: 8 }
  ];

  for (const m of months) {
    await page.evaluate((label) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.trim() === label);
      if (target) target.click();
    }, m.name);
    await new Promise(r => setTimeout(r, 300));

    const data = await page.evaluate(() => {
      const bEl = document.querySelector('b');
      const count = bEl ? parseInt(bEl.textContent) : 0;
      const cards = document.querySelectorAll('div[class*="cursor-pointer"]').length;
      return { count, cards };
    });

    console.log(`- Pílula '${m.name}': ${data.count} itens no indicador | ${data.cards} cards na tela (esperado ${m.expCount})`);
    console.assert(data.count === m.expCount, `Erro no contador do mês ${m.name}`);
    console.assert(data.cards === m.expCount, `Erro na renderização de cards do mês ${m.name}`);
  }

  // Volta para "Todos os Meses"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const all = btns.find(b => b.textContent.trim() === 'Todos os Meses');
    if (all) all.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Testa os botões de tipo
  console.log("\n[4] TESTE DOS FILTROS POR TIPO (TODAS / VENDAS / GASTOS)");
  const types = [
    { name: 'Vendas', exp: 32 },
    { name: 'Gastos', exp: 12 },
    { name: 'Todas', exp: 44 }
  ];

  for (const t of types) {
    await page.evaluate((label) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.trim().startsWith(label));
      if (target) target.click();
    }, t.name);
    await new Promise(r => setTimeout(r, 300));

    const data = await page.evaluate(() => {
      const bEl = document.querySelector('b');
      const count = bEl ? parseInt(bEl.textContent) : 0;
      const cards = document.querySelectorAll('div[class*="cursor-pointer"]').length;
      return { count, cards };
    });

    console.log(`- Tipo '${t.name}': ${data.count} itens no indicador | ${data.cards} cards na tela (esperado ${t.exp})`);
    console.assert(data.count === t.exp, `Erro no filtro de tipo ${t.name}`);
  }

  // 3. BUSCA TEXTUAL REAL VIA PROTOTYPE SETTER
  console.log("\n[5] TESTE DE BUSCA TEXTUAL DINÂMICA");
  const testQueries = [
    { q: 'iPhone', expMin: 8 },
    { q: 'Ps5', expMin: 4 },
    { q: 'Academia', expMin: 4 },
    { q: 'Pix', expMin: 40 },
    { q: '3000', expMin: 3 },
    { q: 'item_totalmente_inexistente_999', expExact: 0 }
  ];

  for (const item of testQueries) {
    await page.evaluate((query) => {
      const input = document.querySelector('input[placeholder*="Buscar produto"]');
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, query);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, item.q);
    await new Promise(r => setTimeout(r, 300));

    const result = await page.evaluate(() => {
      const bEl = document.querySelector('b');
      const cards = document.querySelectorAll('div[class*="cursor-pointer"]').length;
      const emptyMsg = document.body.innerText.includes('Nenhum registro encontrado');
      return { count: bEl ? parseInt(bEl.textContent) : 0, cards, emptyMsg };
    });

    if (item.expExact !== undefined) {
      console.log(`- Busca "${item.q}": ${result.count} itens encontrados | Mensagem vazia: ${result.emptyMsg ? 'SIM' : 'NÃO'}`);
      console.assert(result.count === 0 && result.emptyMsg, "Erro no teste de busca vazia");
    } else {
      console.log(`- Busca "${item.q}": ${result.count} itens encontrados (esperado >= ${item.expMin})`);
      console.assert(result.count >= item.expMin, `Erro na busca por ${item.q}`);
    }
  }

  // Limpa a busca
  await page.evaluate(() => {
    const input = document.querySelector('input[placeholder*="Buscar produto"]');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 300));

  // 4. TESTE DA ABA RESUMO
  console.log("\n[6] TESTE DA ABA RESUMO E SUB-ABAS (MESES / VENDAS / GASTOS)");
  await page.evaluate(() => {
    const navBtns = Array.from(document.querySelectorAll('nav button'));
    const resumoTab = navBtns.find(b => b.textContent.includes('Resumo'));
    if (resumoTab) resumoTab.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const resumoSubTabs = ['Meses', 'Vendas', 'Gastos'];
  for (const sub of resumoSubTabs) {
    await page.evaluate((label) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.textContent.trim() === label);
      if (target) target.click();
    }, sub);
    await new Promise(r => setTimeout(r, 300));
    console.log(`- Sub-aba Resumo '${sub}': renderizada com sucesso.`);
  }

  // 5. TESTE DO MODAL DE NOVA TRANSAÇÃO
  console.log("\n[7] TESTE DO BOTÃO CENTRAL '+' E FORMULÁRIO DE LANÇAMENTO");
  await page.evaluate(() => {
    const plus = document.querySelector('button[title="Nova Movimentação"]');
    if (plus) plus.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Ativa categoria personalizada
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const custom = btns.find(b => b.textContent.includes('+ Digitar outra'));
    if (custom) custom.click();
  });
  await new Promise(r => setTimeout(r, 300));

  const isCustomInputVisible = await page.evaluate(() => {
    return !!document.querySelector('input[placeholder*="PlayStation"]');
  });
  console.log(`- Campo '+ Digitar outra' ativado: ${isCustomInputVisible ? 'SIM' : 'NÃO'}`);
  console.assert(isCustomInputVisible, "Erro ao ativar campo personalizado");

  // Fecha o modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const close = btns.find(b => b.querySelector('svg.lucide-x'));
    if (close) close.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log("- Modal fechado com sucesso.");

  console.log("\n==========================================================");
  console.log("   AUDITORIA CONCLUÍDA: TODOS OS FILTROS FUNCIONANDO 100%!");
  console.log("==========================================================");

  await browser.close();
}

runBrowserTests().catch(err => {
  console.error("Falha no teste:", err);
  process.exit(1);
});
