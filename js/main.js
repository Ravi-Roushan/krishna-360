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

// Active nav is set per page via the .active class already present on the matching link.

// Story modal
const storyModal=$('#storyModal'), storyVideo=$('#storyModal video');
$('#storyOpen')?.addEventListener('click',()=>{storyModal?.classList.add('open');storyModal?.setAttribute('aria-hidden','false')});
$('#storyClose')?.addEventListener('click',()=>{storyModal?.classList.remove('open');storyModal?.setAttribute('aria-hidden','true');storyVideo?.pause()});
storyModal?.addEventListener('click',e=>{if(e.target===storyModal){storyModal.classList.remove('open');storyVideo?.pause()}});

// 360 orbit services
const services=[
 ['Outdoor Advertising That Puts You Everywhere','From hoardings to backlit boards, our outdoor advertising in Ahmedabad and across India puts your brand in front of the right audience, at the right place, every single day.'],
 ['Transit Media Advertising','Reach commuters where they spend their time. With exclusive rights on bus branding, bus shelters, and Western Railway Train , our transit media network keeps your brand moving with your customers — across Ahmedabad, Mumbai, and beyond.'],
 ['Print & Electronic Media','One agency, every channel. We plan and place print and electronic media advertising alongside your outdoor campaign, so your brand story stays consistent across every touchpoint.'],
 ['Print & Electronic Media','One agency, every channel. We plan and place print and electronic media advertising alongside your outdoor campaign, so your brand story stays consistent across every touchpoint.'],
 ['Digital Marketing','Complete the 360° loop. We extend your outdoor presence online with digital and social media marketing that drives measurable engagement and leads.'],
 ['Branding & Creative Production','From concept to installation — our in-house creative and production team designs branding solutions that are built to perform on billboards, buses, and everywhere in between.']
];
let serviceIndex=0;
const serviceTitle=$('#serviceTitle'),serviceText=$('#serviceText'),serviceCount=$('#serviceCount'),serviceMeter=$('#serviceMeter'),orbitServiceNo=$('#orbitServiceNo');
function setService(i){if(!serviceTitle) return;serviceIndex=(i+services.length)%services.length;const [title,text]=services[serviceIndex];serviceTitle.textContent=title;serviceText.innerHTML=text;serviceCount.textContent=`${String(serviceIndex+1).padStart(2,'0')} / 06`;serviceMeter.style.width=`${(serviceIndex+1)/6*100}%`;if(orbitServiceNo) orbitServiceNo.textContent=`${String(serviceIndex+1).padStart(2,'0')} / 06`;$$('.orbit-card').forEach((c,n)=>c.classList.toggle('active',n===serviceIndex))}
$$('.orbit-card').forEach((card,i)=>card.addEventListener('click',()=>setService(i)));
$('#serviceNext')?.addEventListener('click',()=>setService(serviceIndex+1));
if(serviceTitle){ setInterval(()=>setService(serviceIndex+1),5000); }


// Continuous planet-style orbit for the 360° Advertising Solutions cards.
const orbitRingEl=document.querySelector('.solutions-360 .orbit-ring');
const orbitCards=[...document.querySelectorAll('.solutions-360 .orbit-card')];
let orbitAngle=0, orbitFrame;
function animateServiceOrbit(ts){
  if(!orbitRingEl || !orbitCards.length) return;
  const w=orbitRingEl.clientWidth, h=orbitRingEl.clientHeight;
  const rx=Math.max(110,w*.39), ry=Math.max(90,h*.39);
  const cx=w/2, cy=h/2;
  const step=(Math.PI*2)/orbitCards.length;
  orbitCards.forEach((card,i)=>{
    const a=orbitAngle + i*step - Math.PI/2;
    const x=cx + Math.cos(a)*rx;
    const y=cy + Math.sin(a)*ry;
    const depth=(Math.sin(a)+1)/2;
    const scale=.76 + depth*.30;
    const z=Math.round(depth*160);
    card.style.left='0'; card.style.top='0'; card.style.margin='0';
    card.style.transform=`translate3d(${x-52.5}px,${y-52.5}px,${z}px) scale(${scale})`;
    card.style.zIndex=30+Math.round(depth*20);
  });
  orbitAngle += 0.00055 * (ts ? 16.67 : 16.67);
  orbitFrame=requestAnimationFrame(animateServiceOrbit);
}
if(orbitRingEl && orbitCards.length){orbitFrame=requestAnimationFrame(animateServiceOrbit);window.addEventListener('resize',()=>{orbitCards.forEach(c=>{c.style.transform=''});});}

// Bottom media-format rail: smooth continuous six-item marquee.
const slideType = document.querySelector('.solutions-360 .slide-type');
const slideTrack = document.querySelector('.solutions-360 .slide-type-track');
if (slideType && slideTrack && !slideTrack.dataset.loopReady) {
  slideTrack.dataset.loopReady = 'true';
  [...slideTrack.children].forEach(el => {
    const clone = el.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    slideTrack.appendChild(clone);
  });
}

// Client 360 carousel — click, drag and touch swipe
const clientLogos=[
 ['airtel','png'],['apple','png'],['audi','png'],['giva','png'],['gshock','png'],['gulab-oil','png'],['havells','png'],['hyundai','png'],['jio-hotstar','jpg'],['kitkat','png'],['loreal','png'],['mercedes','png'],['porsche','png'],['prime','png'],['spotify','webp'],['times-fashion-week','png'],['tresemme','png'],['vadilal','png'],['zoho','png']
];
const carouselEl=$('#clientCarousel');
let clientCenter=0, clientTimer, clientPointerStart=0, clientPointerLast=0, clientDragging=false, clientDragged=false;
const clientPositions=[
 {x:-390,z:-180,rot:42,scale:.54,op:.38},{x:-275,z:-105,rot:30,scale:.68,op:.55},{x:-145,z:-38,rot:16,scale:.84,op:.78},{x:0,z:55,rot:0,scale:1.08,op:1},{x:145,z:-38,rot:-16,scale:.84,op:.78},{x:275,z:-105,rot:-30,scale:.68,op:.55},{x:390,z:-180,rot:-42,scale:.54,op:.38}
];
function renderCarousel(){
 if(!carouselEl) return;
 carouselEl.classList.remove('is-flipping'); void carouselEl.offsetWidth; carouselEl.classList.add('is-flipping');
 carouselEl.innerHTML=''; const len=clientLogos.length;
 clientLogos.forEach(([name,ext],i)=>{
  let offset=i-clientCenter; if(offset>len/2) offset-=len; if(offset<-len/2) offset+=len; if(Math.abs(offset)>3) return;
  const p=clientPositions[offset+3]; const card=document.createElement('button'); card.type='button'; card.className='client-card3d'+(offset===0?' center':'');
  card.setAttribute('aria-label',name.replaceAll('-',' ')+' client');
  card.addEventListener('click',e=>{ if(clientDragged){e.preventDefault();e.stopPropagation();return;} clientCenter=i; renderCarousel(); restartClientTimer(); });
  card.style.transform=`translate(-50%,-50%) translateX(${p.x}px) translateZ(${p.z}px) rotateY(${p.rot}deg) scale(${p.scale})`; card.style.opacity=p.op; card.style.zIndex=100-Math.abs(offset);
  const img=document.createElement('img'); img.src=`assets/clients/${name}.${ext}`; img.alt=name.replaceAll('-',' '); card.appendChild(img); carouselEl.appendChild(card);
 });
}
function stepClient(dir){clientCenter=(clientCenter+dir+clientLogos.length)%clientLogos.length;renderCarousel();}
function restartClientTimer(){clearInterval(clientTimer);clientTimer=setInterval(()=>stepClient(1),2200);}
renderCarousel(); restartClientTimer();

// Client carousel: click a logo to bring it to the front; drag/swipe to rotate.
const clientStageEl=document.querySelector('.client-stage');
if(clientStageEl){
  let down=false,startX=0,lastX=0,dragMoved=false,suppressClick=false;
  const threshold=38;
  const begin=e=>{
    if(e.pointerType==='mouse' && e.button!==0) return;
    down=true; dragMoved=false; startX=lastX=e.clientX;
    clearInterval(clientTimer);
    clientStageEl.classList.add('is-dragging');
    if(e.pointerId!=null) clientStageEl.setPointerCapture?.(e.pointerId);
  };
  const move=e=>{
    if(!down) return;
    const dx=e.clientX-startX;
    lastX=e.clientX;
    if(Math.abs(dx)>8) dragMoved=true;
    // Lock the carousel to horizontal interaction so touch swipe is reliable.
    if(dragMoved) e.preventDefault();
  };
  const end=e=>{
    if(!down) return;
    const dx=lastX-startX;
    down=false;
    clientStageEl.classList.remove('is-dragging');
    if(Math.abs(dx)>=threshold){
      suppressClick=true;
      stepClient(dx<0?1:-1);
      window.setTimeout(()=>{suppressClick=false;},140);
    }
    restartClientTimer();
    if(e?.pointerId!=null){ try{clientStageEl.releasePointerCapture?.(e.pointerId);}catch(_){} }
  };
  clientStageEl.addEventListener('pointerdown',begin);
  clientStageEl.addEventListener('pointermove',move,{passive:false});
  clientStageEl.addEventListener('pointerup',end);
  clientStageEl.addEventListener('pointercancel',end);
  clientStageEl.addEventListener('dragstart',e=>e.preventDefault());
  clientStageEl.addEventListener('click',e=>{
    if(suppressClick || dragMoved){
      e.preventDefault(); e.stopPropagation();
      dragMoved=false;
    }
  }, true);
}

// Outdoor solutions showcase — image-backed and fully interactive
const panels={
 digital:{title:'Digital Marketing', kicker:'DIGITAL MARKETING', image:'assets/images/work/work-03.png', color:'#ff2832'},
 print:{title:'Print & Electronic Media', kicker:'PRINT & ELECTRONIC MEDIA', image:'assets/images/work/work-04.png', color:'#ffffff'},
 transit:{title:'Transit Media', kicker:'TRANSIT MEDIA', image:'assets/images/train-advertisement.jpg', color:'#53bffb'}
};
const showSection=$('.solution-showcase'), showTitle=$('#showcaseTitle'), showIndex=$('#showcaseIndex'), showImage=$('#showcaseImage'), showVisualKicker=$('#showcaseVisualKicker'), showVisualTitle=$('#showcaseVisualTitle');
function setPanel(name){
 if(!showSection) return;
 showSection.classList.remove('theme-digital','theme-print','theme-transit'); showSection.classList.add('theme-'+name);
 if(showTitle) showTitle.textContent=panels[name].title;
 if(showImage){showImage.classList.remove('is-changing'); requestAnimationFrame(()=>{showImage.src=panels[name].image; showImage.classList.add('is-changing');});}
 if(showVisualKicker) showVisualKicker.textContent=panels[name].kicker;
 if(showVisualTitle){showVisualTitle.textContent=panels[name].title.toUpperCase(); showVisualTitle.style.color=panels[name].color;}
 const names=Object.keys(panels), n=names.indexOf(name)+1;
 if(showIndex) showIndex.textContent=`0${n} — 03`;
 $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.panel===name));
 $$('.showcase-media').forEach(w=>w.classList.toggle('active',w.dataset.panelMedia===name));
}
$$('.tab').forEach(t=>t.addEventListener('click',()=>{setPanel(t.dataset.panel);panelIndex=panelNames.indexOf(t.dataset.panel);restartPanelTimer()}));
let panelIndex=0; const panelNames=['digital','static','transit']; let panelTimer;
function restartPanelTimer(){clearInterval(panelTimer);panelTimer=setInterval(()=>{panelIndex=(panelIndex+1)%panelNames.length;setPanel(panelNames[panelIndex])},3500)}
setPanel('digital'); restartPanelTimer();

// Our Work: top-row video + bottom-row auto-scrolling image rail
const workViewport=$('#workViewport'), workTrack=$('#workTrack'), workPrev=$('#workPrev'), workNext=$('#workNext');
let workAutoTimer, workStep=0;
function sizeWorkCards(){if(!workViewport||!workTrack) return; const cards=$$('.work-card',workTrack); const gap=parseFloat(getComputedStyle(workTrack).gap)||0; const visible=window.innerWidth<=760?1:3; const width=Math.max(220,(workViewport.clientWidth-gap*(visible-1))/visible); cards.forEach(card=>{card.style.flexBasis=`${width}px`;card.style.width=`${width}px`});}
function getWorkStep(){const card=workTrack?.querySelector('.work-card'); if(!card) return 0; const gap=parseFloat(getComputedStyle(workTrack).gap)||0; return card.getBoundingClientRect().width+gap;}
function scrollWork(dir=1){if(!workViewport) return; const step=getWorkStep(); if(!step) return; workStep += dir; const max=workViewport.scrollWidth-workViewport.clientWidth; if(workStep*step>max+4) workStep=0; if(workStep<0) workStep=Math.max(0,Math.ceil(max/step)-1); workViewport.scrollTo({left:Math.min(workStep*step,max),behavior:'smooth'});}
function restartWorkAuto(){clearInterval(workAutoTimer); workAutoTimer=setInterval(()=>scrollWork(1),3200)}
workPrev?.addEventListener('click',()=>{scrollWork(-1);restartWorkAuto()});
workNext?.addEventListener('click',()=>{scrollWork(1);restartWorkAuto()});
workViewport?.addEventListener('mouseenter',()=>clearInterval(workAutoTimer));
workViewport?.addEventListener('mouseleave',restartWorkAuto);
workViewport?.addEventListener('touchstart',()=>clearInterval(workAutoTimer),{passive:true});
workViewport?.addEventListener('touchend',restartWorkAuto,{passive:true});
sizeWorkCards(); window.addEventListener('resize',()=>{sizeWorkCards();workStep=0;workViewport?.scrollTo({left:0,behavior:'auto'})}); restartWorkAuto();

// Chatbot
const chatbot=$('#chatbot'),chatPanel=$('#chatPanel'),chatClose=$('#chatClose'),chatReply=$('#chatReply');
chatbot.addEventListener('click',()=>{chatPanel.classList.toggle('open');chatPanel.setAttribute('aria-hidden',chatPanel.classList.contains('open')?'false':'true')});
chatClose.addEventListener('click',()=>{chatPanel.classList.remove('open');chatPanel.setAttribute('aria-hidden','true')});
$$('[data-chat]').forEach(b=>b.addEventListener('click',()=>{const m=b.dataset.chat;chatReply.innerHTML=m==='media'?'<b>Media solutions:</b> outdoor, transit, print, electronic and digital formats.':m==='campaign'?'<b>Plan a campaign:</b> tell us your city, audience and campaign goal.': '<b>Talk to our team:</b> email info.team@krishnaoutdoor.in or call +91-9920011574.';}));

// Work image lightbox — click any campaign card to view it larger
const workLightbox=$('#workLightbox'), workLightboxImage=$('#workLightboxImage'), workLightboxCaption=$('#workLightboxCaption'), workLightboxClose=$('#workLightboxClose');
$$('.work-card img').forEach(img=>img.addEventListener('click',e=>{
 e.stopPropagation();
 if(!workLightbox) return;
 workLightboxImage.src=img.currentSrc||img.src;
 workLightboxImage.alt=img.alt||'Krishna Outdoor campaign';
 workLightboxCaption.textContent=img.alt||'Krishna Outdoor campaign';
 workLightbox.classList.add('open'); workLightbox.setAttribute('aria-hidden','false');
}));
function closeWorkLightbox(){workLightbox?.classList.remove('open');workLightbox?.setAttribute('aria-hidden','true');if(workLightboxImage) workLightboxImage.src=''}
workLightboxClose?.addEventListener('click',closeWorkLightbox);
workLightbox?.addEventListener('click',e=>{if(e.target===workLightbox) closeWorkLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape') closeWorkLightbox()});

// Cursor
const cursor=$('#cursor'), ring=$('#cursorRing');
if(window.matchMedia('(pointer:fine)').matches){window.addEventListener('mousemove',e=>{cursor.style.opacity=1;ring.style.opacity=.65;cursor.style.left=`${e.clientX}px`;cursor.style.top=`${e.clientY}px`;ring.style.left=`${e.clientX}px`;ring.style.top=`${e.clientY}px`});$$('a,button').forEach(el=>el.addEventListener('mouseenter',()=>ring.style.transform='translate(-50%,-50%) scale(1.6)'));$$('a,button').forEach(el=>el.addEventListener('mouseleave',()=>ring.style.transform='translate(-50%,-50%) scale(1)'))}

