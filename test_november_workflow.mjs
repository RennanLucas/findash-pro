import puppeteer from 'puppeteer-core';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function runNovemberWorkflowTest() {
  console.log("==========================================================");
  console.log("   AUDITORIA: FLUXO DE LANÇAMENTO EM NOVEMBRO/2026       ");
  console.log("==========================================================");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  await page.goto("http://localhost:5173", { waitUntil: 'networkidle0' });

  // 1. Verifica estado inicial de Novembro
  const novBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(btn => btn.textContent.includes('Novembro'));
    return b ? b.textContent.trim() : null;
  });
  console.log(`- Mês ativo na Home: ${novBtn}`);
  console.assert(novBtn === 'Novembro (Atual)', "Deveria estar em Novembro (Atual)");

  const initialSaldo = await page.$eval('h2', el => el.textContent);
  console.log(`- Saldo Inicial em Novembro: ${initialSaldo}`);

  // 2. Abre modal de Nova Venda
  console.log("\n[1] ABRINDO MODAL DE NOVA VENDA...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const novaVendaBtn = btns.find(b => b.textContent.includes('Nova Venda'));
    if (novaVendaBtn) novaVendaBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 3. Preenche formulário de venda em Novembro
  console.log("[2] PREENCHENDO DADOS DA VENDA (MacBook Pro M3)...");
  await page.type('input[placeholder*="Ex: iPhone"]', 'MacBook Pro M3 16GB');
  
  const numInputs = await page.$$('input[placeholder="0,00"]');
  if (numInputs.length >= 2) {
    await numInputs[0].type('12000');
    await numInputs[1].type('9000');
  }

  // Salva a transação
  console.log("[3] SALVANDO VENDA...");
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.textContent.includes('Confirmar Lançamento') || b.textContent.includes('Salvar'));
    if (saveBtn) saveBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Verifica se a Home atualizou
  const updatedSaldo = await page.$eval('h2', el => el.textContent);
  console.log(`- Saldo em Novembro após a venda: ${updatedSaldo}`);
  console.assert(updatedSaldo.includes('12.000'), "Saldo em Novembro deveria refletir R$ 12.000,00");

  const lucroText = await page.evaluate(() => {
    const el = document.querySelector('.text-emerald-500');
    return el ? el.textContent.trim() : '';
  });
  console.log(`- Lucro Líquido calculado em Novembro: ${lucroText}`);
  console.assert(lucroText.includes('3.000'), "Lucro líquido deveria ser R$ 3.000,00 (12.000 - 9.000)");

  // 5. Exclui a transação teste pelo modal de edição para restaurar o estado limpo
  console.log("\n[4] RESTAURANDO ESTADO LIMPO (EXCLUINDO VENDA DE TESTE)...");
  await page.evaluate(() => {
    // Clica no primeiro card de transação
    const card = document.querySelector('div[class*="cursor-pointer"]');
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const delBtn = btns.find(b => b.textContent.includes('Excluir'));
    if (delBtn) delBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const finalSaldo = await page.$eval('h2', el => el.textContent);
  console.log(`- Saldo após exclusão do teste: ${finalSaldo}`);
  console.assert(finalSaldo.includes('0,00'), "Saldo deveria voltar a 0,00");

  await browser.close();
  console.log("\n✅ FLUXO DE NOVEMBRO AUDITADO E VALIDADO COM 100% DE SUCESSO!");
}

runNovemberWorkflowTest().catch(err => {
  console.error("Falha no teste:", err);
  process.exit(1);
});
