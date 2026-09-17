const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

// Sticky header + scroll progress
const header=$('#header'), progress=$('#pageProgress');
window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>8);
  const doc=document.documentElement, max=doc.scrollHeight-doc.clientHeight;
  progress.style.width=`${max?window.scrollY/max*100:0}%`;
},{passive:true});

// Mobile navigation
const nav=$('#nav'), navToggle=$('#navToggle');
navToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',open)});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Scroll reveal
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

// Active nav by section
const sections=['home','about','solutions','network','work','contact'].map(id=>document.getElementById(id)).filter(Boolean);
const activeIo=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.nav>a').forEach(a=>a.classList.remove('active'));const a=$(`.nav>a[href="#${e.target.id}"]`);a?.classList.add('active')}}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>activeIo.observe(s));

// Story modal
const storyModal=$('#storyModal'), storyVideo=$('#storyModal video');
$('#storyOpen').addEventListener('click',()=>{storyModal.classList.add('open');storyModal.setAttribute('aria-hidden','false')});
$('#storyClose').addEventListener('click',()=>{storyModal.classList.remove('open');storyModal.setAttribute('aria-hidden','true');storyVideo.pause()});
storyModal.addEventListener('click',e=>{if(e.target===storyModal){storyModal.classList.remove('open');storyVideo.pause()}});

// 360 orbit services
const services=[
 ['Outdoor Advertising','Hoardings, unipoles, gantries and premium locations engineered for high-impact visibility.'],
 ['Transit Advertising','Buses, shelters, trains and transit networks that take brands where people move.'],
 ['Print Advertising','Newspaper and print campaigns built for reach, clarity and recall.'],
 ['Electronic Media','Radio, television and OTT opportunities for broad, memorable storytelling.'],
 ['Digital & Social','Online campaigns, social media and digital marketing for connected audiences.'],
 ['Branding Solutions','Brand communication, campaign creation and place-based experiences.']
];
let serviceIndex=0;
const serviceTitle=$('#serviceTitle'),serviceText=$('#serviceText'),serviceCount=$('#serviceCount'),serviceMeter=$('#serviceMeter');
function setService(i){serviceIndex=(i+services.length)%services.length;const [title,text]=services[serviceIndex];serviceTitle.textContent=title;serviceText.textContent=text;serviceCount.textContent=`${String(serviceIndex+1).padStart(2,'0')} / 06`;serviceMeter.style.width=`${(serviceIndex+1)/6*100}%`;$$('.orbit-card').forEach((c,n)=>c.classList.toggle('active',n===serviceIndex))}
$$('.orbit-card').forEach((card,i)=>card.addEventListener('click',()=>setService(i)));
$('#serviceNext').addEventListener('click',()=>setService(serviceIndex+1));
setInterval(()=>setService(serviceIndex+1),5000);

// Client 360 carousel (round cards, compact arc, continuously auto-rotating)
const clientLogos=['vadilal','gshock','apple','mercedes','audi','hyundai','loreal','airtel'];
const clientPositions=[
 {x:-320,z:-140,rot:38,scale:.62,op:.4},
 {x:-215,z:-75,rot:29,scale:.76,op:.62},
 {x:-110,z:-22,rot:16,scale:.9,op:.86},
 {x:0,z:45,rot:0,scale:1.15,op:1},
 {x:110,z:-22,rot:-16,scale:.9,op:.86},
 {x:215,z:-75,rot:-29,scale:.76,op:.62},
 {x:320,z:-140,rot:-38,scale:.62,op:.4}
];
const carouselEl=$('#clientCarousel'), clientDotsEl=$('#clientDots');
let clientCenter=3;
function renderCarousel(){
 if(!carouselEl) return;
 carouselEl.innerHTML='';
 const len=clientLogos.length;
 clientLogos.forEach((name,i)=>{
  let offset=i-clientCenter;
  if(offset>len/2) offset-=len;
  if(offset<-len/2) offset+=len;
  if(Math.abs(offset)>3) return;
  const p=clientPositions[offset+3];
  const card=document.createElement('div');
  card.className='client-card3d'+(offset===0?' center':'');
  card.style.transform=`translate(-50%,-50%) translateX(${p.x}px) translateZ(${p.z}px) rotateY(${p.rot}deg) scale(${p.scale})`;
  card.style.opacity=p.op;
  card.style.filter=`brightness(${1-Math.abs(offset)*0.06})`;
  card.style.zIndex=100-Math.abs(offset);
  const img=document.createElement('img'); img.src=`assets/clients/${name}.png`; img.alt=name;
  card.appendChild(img); carouselEl.appendChild(card);
 });
 if(clientDotsEl){
  clientDotsEl.innerHTML='';
  clientLogos.forEach((_,i)=>{const d=document.createElement('span');d.className='dot'+(i===clientCenter?' active':'');clientDotsEl.appendChild(d);});
 }
}
function stepClient(dir){clientCenter=(clientCenter+dir+clientLogos.length)%clientLogos.length; renderCarousel();}
$('#clientPrev')?.addEventListener('click',()=>stepClient(-1));
$('#clientNext')?.addEventListener('click',()=>stepClient(1));
renderCarousel();
let clientAutoTimer=setInterval(()=>stepClient(1),2200);
const clientStageEl=document.querySelector('.client-stage');
clientStageEl?.addEventListener('mouseenter',()=>clearInterval(clientAutoTimer));
clientStageEl?.addEventListener('mouseleave',()=>{clientAutoTimer=setInterval(()=>stepClient(1),2200);});

// Outdoor solutions showcase
const panels={digital:{title:'Digital Billboards'},static:{title:'Static Billboards'},transit:{title:'Transit Media'}};
const showSection=$('.solution-showcase'), showBg=$('#showcaseBg'), showTitle=$('#showcaseTitle');
function setPanel(name){showSection.classList.remove('theme-digital','theme-static','theme-transit');showSection.classList.add('theme-'+name);showTitle.textContent=panels[name].title;$$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.panel===name));$$('.big-word').forEach(w=>w.classList.toggle('active',w.dataset.panelWord===name));}
$$('.tab').forEach(t=>t.addEventListener('click',()=>setPanel(t.dataset.panel)));
let panelIndex=0;const panelNames=['digital','static','transit'];setPanel('digital');setInterval(()=>{panelIndex=(panelIndex+1)%3;setPanel(panelNames[panelIndex])},5200);

// Chatbot
const chatbot=$('#chatbot'),chatPanel=$('#chatPanel'),chatClose=$('#chatClose'),chatReply=$('#chatReply');
chatbot.addEventListener('click',()=>{chatPanel.classList.toggle('open');chatPanel.setAttribute('aria-hidden',chatPanel.classList.contains('open')?'false':'true')});
chatClose.addEventListener('click',()=>{chatPanel.classList.remove('open');chatPanel.setAttribute('aria-hidden','true')});
$$('[data-chat]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.chat;chatReply.innerHTML=m==='media'?'<b>Media solutions:</b> outdoor, transit, print, electronic and digital formats.':m==='campaign'?'<b>Plan a campaign:</b> tell us your city, audience and campaign goal.': '<b>Talk to our team:</b> email info.team@krishnaoutdoor.in or call +91-9920011574.';}));

// Cursor
const cursor=$('#cursor'), ring=$('#cursorRing');
if(window.matchMedia('(pointer:fine)').matches){window.addEventListener('mousemove',e=>{cursor.style.opacity=1;ring.style.opacity=.65;cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;ring.style.left=`${e.clientX}px`;ring.style.top=`${e.clientY}px`});$$('a,button').forEach(el=>el.addEventListener('mouseenter',()=>ring.style.transform='translate(-50%,-50%) scale(1.6)'));$$('a,button').forEach(el=>el.addEventListener('mouseleave',()=>ring.style.transform='translate(-50%,-50%) scale(1)'))}
