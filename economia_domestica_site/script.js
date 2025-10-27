// Script: simulador de orçamento e gráficos simples (sem bibliotecas)
function toBRL(v){
  return 'R$ ' + v.toFixed(2).replace('.',',');
}
function calc(){
  const income = parseFloat(document.getElementById('income').value) || 0;
  const fixed = parseFloat(document.getElementById('fixed').value) || 0;
  const variable = parseFloat(document.getElementById('variable').value) || 0;
  const savings = parseFloat(document.getElementById('savings').value) || 0;

  const totalExpenses = fixed + variable + savings;
  const balance = income - totalExpenses;
  const pctSavings = income > 0 ? (savings / income) * 100 : 0;

  document.getElementById('total-exp').textContent = toBRL(totalExpenses);
  document.getElementById('balance').textContent = toBRL(balance);
  document.getElementById('pct-savings').textContent = pctSavings.toFixed(1) + '%';

  advice(balance, pctSavings);

  drawPieChart({
    fixed: fixed,
    variable: variable,
    savings: savings,
    remainder: Math.max(0, income - (fixed+variable+savings))
  });
}

// Dicas simples conforme resultado
function advice(balance, pctSavings){
  const el = document.getElementById('advice');
  let html = '';
  if(balance < 0){
    html = '<strong>Atenção:</strong> Você está com saldo negativo. Reveja despesas variáveis e objetivo de poupança.';
  } else if(pctSavings < 10){
    html = '<strong>Sugestão:</strong> Aumente a poupança para pelo menos 10% da sua renda.';
  } else {
    html = '<strong>Ótimo:</strong> Você está poupando uma porcentagem saudável da renda.';
  }
  el.innerHTML = html;
}

// Desenha gráfico de pizza em canvas (simples)
function drawPieChart(data){
  const canvas = document.getElementById('pieChart');
  if(!canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  const centerX = w/2, centerY = h/2, radius = Math.min(w,h)/2 - 10;

  const entries = [
    {label:'Despesas fixas', value: data.fixed},
    {label:'Despesas variáveis', value: data.variable},
    {label:'Poupança', value: data.savings},
    {label:'Livre', value: data.remainder}
  ];
  const total = entries.reduce((s,e)=>s+e.value,0) || 1;
  const colors = ['#2b7cff','#06b6d4','#16a34a','#f97316'];

  let start = -Math.PI/2;
  // Draw slices
  entries.forEach((e,i)=>{
    const slice = e.value / total;
    const end = start + slice * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX,centerY,radius,start,end);
    ctx.closePath();
    ctx.fillStyle = colors[i%colors.length];
    ctx.fill();
    start = end;
  });

  // Legend
  const legX = 10, legY = 10;
  ctx.font = '12px sans-serif';
  entries.forEach((e,i)=>{
    ctx.fillStyle = colors[i%colors.length];
    ctx.fillRect(legX, legY + i*18, 12,12);
    ctx.fillStyle = '#000';
    ctx.fillText(e.label + ' - ' + ( (e.value/total*100).toFixed(1) ) + '%', legX+18, legY + i*18 + 10);
  });
}

// Gráfico de barras SVG (dados fictícios por região)
function drawBarChart(){
  const data = [
    {region:'Norte', value: 1200},
    {region:'Nordeste', value: 1300},
    {region:'Centro-Oeste', value: 1100},
    {region:'Sudeste', value: 1700},
    {region:'Sul', value: 1400}
  ];
  const svg = document.getElementById('barChart');
  const w = 600, h = 260, pad = 40;
  const max = Math.max(...data.map(d=>d.value));
  const barW = (w - pad*2) / data.length * 0.7;
  svg.innerHTML = '';
  data.forEach((d,i)=>{
    const x = pad + i * ((w - pad*2) / data.length) + ((w - pad*2) / data.length - barW)/2;
    const barH = (d.value / max) * (h - pad*2);
    const y = h - pad - barH;
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barW);
    rect.setAttribute('height', barH);
    rect.setAttribute('rx', 6);
    rect.setAttribute('ry', 6);
    rect.setAttribute('fill', '#2b7cff');
    svg.appendChild(rect);
    // label
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x', x + barW/2);
    t.setAttribute('y', h - pad + 16);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size','12');
    t.textContent = d.region;
    svg.appendChild(t);
    // value
    const v = document.createElementNS('http://www.w3.org/2000/svg','text');
    v.setAttribute('x', x + barW/2);
    v.setAttribute('y', y - 6);
    v.setAttribute('text-anchor','middle');
    v.setAttribute('font-size','12');
    v.textContent = 'R$ ' + d.value;
    svg.appendChild(v);
  });
}

// Events
document.getElementById('calcBtn').addEventListener('click', calc);
document.getElementById('resetBtn').addEventListener('click', ()=>{
  document.getElementById('income').value = 3000;
  document.getElementById('fixed').value = 1500;
  document.getElementById('variable').value = 700;
  document.getElementById('savings').value = 300;
  calc();
});

// Inicializa gráficos
window.addEventListener('load', ()=>{
  calc();
  drawBarChart();
});
