const L=1.0,mu=0.01,Nx=800;
const sT=document.getElementById('tension'),sA=document.getElementById('amplitud'),sN=document.getElementById('modo');
const tVal=document.getElementById('tensionVal'),aVal=document.getElementById('amplitudVal'),nVal=document.getElementById('modoVal');
const muVal=document.getElementById('muVal'),LVal=document.getElementById('LVal'),lamVal=document.getElementById('lambdaVal'),vVal=document.getElementById('vVal'),fVal=document.getElementById('fVal');
const canvas=document.getElementById('waveCanvas'),ctx=canvas.getContext('2d');let playing=true,t=0,dt=1/240;
const waveSpeed=(T,mu)=>Math.sqrt(T/mu),wavelength=(L,n)=>2*L/n,freq=(T,mu,L,n)=>n*waveSpeed(T,mu)/(2*L);
function xToPx(x){return x/L*canvas.width}function yToPx(y,Amax){const m=canvas.height/2,s=(.9*canvas.height/2)/Amax;return m-y*s}
function drawNodes(n){ctx.fillStyle='#93c5fd';for(let k=0;k<=n;k++){const x=k*L/n,px=xToPx(x);ctx.beginPath();ctx.arc(px,canvas.height/2,4,0,2*Math.PI);ctx.fill()}}
function render(){const T=+sT.value,A=+sA.value,n=+sN.value;const v=waveSpeed(T,mu),lam=wavelength(L,n),f=freq(T,mu,L,n);
tVal.textContent=T.toFixed(1);aVal.textContent=A.toFixed(3);nVal.textContent=n.toString();muVal.textContent=mu.toFixed(4);LVal.textContent=L.toFixed(2);lamVal.textContent=lam.toFixed(3);vVal.textContent=v.toFixed(3);fVal.textContent=f.toFixed(3);
ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#0e1729';ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.strokeStyle='#223';ctx.beginPath();ctx.moveTo(0,canvas.height/2);ctx.lineTo(canvas.width,canvas.height/2);ctx.stroke();
ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=Nx;i++){const x=i/Nx*L,y=A*Math.sin(n*Math.PI*x/L)*Math.cos(2*Math.PI*f*t),px=xToPx(x),py=yToPx(y,.05);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}ctx.stroke();drawNodes(n)}
function loop(){if(playing)t+=dt;render();requestAnimationFrame(loop)}[sT,sA,sN].forEach(el=>el.addEventListener('input',()=>{}));document.getElementById('btnPlay').addEventListener('click',()=>playing=!playing);
const modal=document.getElementById('modal'),closeModal=document.getElementById('closeModal');
document.getElementById('btnStudy').addEventListener('click',()=>{const n=+sN.value;document.getElementById('nEval').textContent=`n=${n}`;const T_levels=[10,50,100,200,400],v_levels=T_levels.map(T=>waveSpeed(T,mu)),f_levels=v_levels.map(v=>n*v/(2*L));
const tbody=document.querySelector('#resultTable tbody');tbody.innerHTML='';T_levels.forEach((T,i)=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${T.toFixed(1)}</td><td>${v_levels[i].toFixed(3)}</td><td>${f_levels[i].toFixed(3)}</td>`;tbody.appendChild(tr)});
const commonOptions={responsive:true,maintainAspectRatio:false,layout:{padding:{left:10,right:10}},plugins:{legend:{display:true,position:'top',labels:{color:'#e5e9f0',font:{size:10},boxWidth:15,padding:8}},tooltip:{intersect:false,mode:'index'}},scales:{x:{ticks:{color:'#e5e9f0'},title:{display:true,text:'Tensión T [N]',color:'#e5e9f0'}},y:{ticks:{color:'#e5e9f0'}}}};
const ctxV=document.getElementById('chartV').getContext('2d');const ctxF=document.getElementById('chartF').getContext('2d');
if(window._chartV)window._chartV.destroy();if(window._chartF)window._chartF.destroy();
window._chartV=new Chart(ctxV,{type:'line',data:{labels:T_levels,datasets:[{label:'v [m/s]',data:v_levels,borderColor:'#3b82f6',backgroundColor:'#3b82f6',tension:.3,pointRadius:3,pointHoverRadius:5}]},options:{...commonOptions,scales:{...commonOptions.scales,y:{...commonOptions.scales.y,title:{display:true,text:'Velocidad de onda v [m/s]',color:'#e5e9f0'}}}}});
window._chartF=new Chart(ctxF,{type:'line',data:{labels:T_levels,datasets:[{label:'fₙ [Hz]',data:f_levels,borderColor:'#22d3ee',backgroundColor:'#22d3ee',tension:.3,pointRadius:3,pointHoverRadius:5}]},options:{...commonOptions,scales:{...commonOptions.scales,y:{...commonOptions.scales.y,title:{display:true,text:'Frecuencia natural fₙ [Hz]',color:'#e5e9f0'}}}}});
modal.classList.remove('hidden')});closeModal.addEventListener('click',()=>modal.classList.add('hidden'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
loop();render();
