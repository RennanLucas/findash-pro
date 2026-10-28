export const formatBRL = (value) => {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  const isNegative = value < 0;
  const absVal = Math.abs(value);
  const formatted = absVal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return isNegative ? `-${formatted}` : formatted;
};

export const formatPercent = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '0,0%';
  return `${(value).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
};

export const formatDateBR = (dateStr) => {
  if (!dateStr) return '';
  // dateStr can be YYYY-MM-DD or ISO
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const getMonthName = (monthKey) => {
  // monthKey: "2026-07"
  const [year, month] = monthKey.split('-');
  const months = {
    '01': 'Janeiro',
    '02': 'Fevereiro',
    '03': 'Março',
    '04': 'Abril',
    '05': 'Maio',
    '06': 'Junho',
    '07': 'Julho',
    '08': 'Agosto',
    '09': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro'
  };
  return `${months[month] || month}/${year}`;
};

export const calculateMetrics = (transactions) => {
  let totalReceitas = 0;
  let totalCustos = 0;
  let totalDespesas = 0;
  let countVendas = 0;
  let countMovimentacoes = transactions.length;

  transactions.forEach((tx) => {
    const val = Number(tx.amount) || 0;
    const cost = Number(tx.cost) || 0;

    if (tx.type === 'Receita') {
      totalReceitas += val;
      totalCustos += cost;
      countVendas += 1;
    } else {
      totalDespesas += val;
    }
  });

  const lucroBruto = totalReceitas - totalCustos;
  const lucroLiquido = lucroBruto - totalDespesas;
  const saldoAcumulado = totalReceitas - totalDespesas;
  
  const margemBruta = totalReceitas > 0 ? (lucroBruto / totalReceitas) * 100 : 0;
  const margemLiquida = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0;
  const ticketMedio = countVendas > 0 ? totalReceitas / countVendas : 0;
  const lucroMedioPorVenda = countVendas > 0 ? lucroBruto / countVendas : 0;

  return {
    totalReceitas,
    totalCustos,
    totalDespesas,
    lucroBruto,
    lucroLiquido,
    saldoAcumulado,
    countVendas,
    countMovimentacoes,
    margemBruta,
    margemLiquida,
    ticketMedio,
    lucroMedioPorVenda
  };
};

export const exportToCSV = (transactions, filename = "findash_export.csv") => {
  const headers = ["ID", "Data", "Tipo", "Categoria", "Descrição", "Pagamento", "Valor (R$)", "Custo (R$)", "Lucro (R$)", "Observações"];
  const rows = transactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.type}"`,
    `"${t.category}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.paymentMethod || ''}"`,
    t.amount.toFixed(2).replace('.', ','),
    (t.cost || 0).toFixed(2).replace('.', ','),
    (t.profit || 0).toFixed(2).replace('.', ','),
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
