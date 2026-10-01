const lines=["بالليل... في حديقة هادية...","قاعدين إحنا الاتنين...","بنبص في السما سوا...","وعلى النجوم...","وبتكلمك... وبسمعك...","وكل حاجة حواليا بتهدى... غير قلبي وهو بيدق ليكي."];
const $=s=>document.querySelector(s),line=$('#line');
let fast=false;
document.addEventListener('pointerdown',e=>{if(e.target.id!=='start')fast=true});
document.addEventListener('pointerup',()=>fast=false);
const wait=ms=>new Promise(r=>setTimeout(r,fast?ms/5:ms));
async function type(t){
  line.className='';line.textContent='';await wait(300);
  line.classList.add('cur');
  for(let k=1;k<=t.length;k++){line.textContent=t.slice(0,k);const ch=t[k-1];await wait(ch==='…'||ch==='.'?350:ch===' '?65:50)}
}
async function play(){
  for(let i=0;i<lines.length;i++){
    await type(lines[i]);
    await wait(1600);
    line.classList.remove('cur');line.classList.add('out');
    await wait(1000);
  }
  line.textContent='';line.className='';
}
$('#start').onclick=()=>{
  $('#intro').classList.add('gone');
  const a=$('#song');a.volume=0;a.play().catch(()=>{});
  let v=0;const fi=setInterval(()=>{v=Math.min(v+.02,.7);a.volume=v;if(v>=.7)clearInterval(fi)},150);
  setTimeout(play,900);
};
let zoomed=false;
document.addEventListener('click',e=>{
  if(e.target.id==='start'||e.target.id==='mute')return;
  zoomed=!zoomed;
  $('#zoom').classList.toggle('in',zoomed);
  $('#hint').style.opacity=zoomed?0:.4;
});
$('#mute').onclick=e=>{e.stopPropagation();const a=$('#song');a.muted=!a.muted;$('#mute').textContent=a.muted?'🔇':'🔊'};
const cv=$('#c'),x=cv.getContext('2d');let W,H,S=[],sh=null;
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;S=Array.from({length:Math.min(260,W/4)},()=>({x:Math.random()*W,y:Math.random()*H*.75,r:Math.random()*1.5+.3,p:Math.random()*6,s:Math.random()*.02+.006}))}
rs();addEventListener('resize',rs);
(function f(){
  x.clearRect(0,0,W,H);
  const g=x.createRadialGradient(W*.5,H*.1,0,W*.5,H*.1,Math.max(W,H)*.9);
  g.addColorStop(0,'rgba(60,70,120,.25)');g.addColorStop(1,'rgba(10,14,31,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  for(const s of S){s.p+=s.s;x.globalAlpha=.3+.7*Math.abs(Math.sin(s.p));x.fillStyle='#eef1fa';x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}
  if(!sh&&Math.random()<.004)sh={x:Math.random()*W,y:Math.random()*H*.35,l:0};
  if(sh){sh.l+=1;x.globalAlpha=Math.max(1-sh.l/50,0);x.strokeStyle='#ecd9c0';x.lineWidth=1.5;x.beginPath();x.moveTo(sh.x-sh.l*9,sh.y+sh.l*4);x.lineTo(sh.x-sh.l*9-60,sh.y+sh.l*4+27);x.stroke();if(sh.l>50)sh=null}
  x.globalAlpha=1;requestAnimationFrame(f);
})();
