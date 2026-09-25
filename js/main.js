const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

// Sticky header + scroll progress
const header=$('#header'), progress=$('#pageProgress');
window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>8);
  const doc=document.documentElement, max=doc.scrollHeight-doc.clientHeight;
  progress.style.width=`${max?window.scrollY/max*100:0}%`;
},{passive:true});

// Mobile navigation — compact right-side drawer with outside-tap close
const nav=$('#nav'), navToggle=$('#navToggle');
let mobileNavBackdrop=document.querySelector('.mobile-nav-backdrop');
if(!mobileNavBackdrop){
  mobileNavBackdrop=document.createElement('div');
  mobileNavBackdrop.className='mobile-nav-backdrop';
  mobileNavBackdrop.setAttribute('aria-hidden','true');
  document.body.appendChild(mobileNavBackdrop);
}
const closeMobileNav=()=>{
  nav?.classList.remove('open');
  navToggle?.classList.remove('menu-open');
  navToggle?.setAttribute('aria-expanded','false');
  mobileNavBackdrop?.classList.remove('open');
  document.documentElement.classList.remove('mobile-nav-lock');
  document.body.classList.remove('mobile-nav-lock');
};
const openMobileNav=()=>{
  // Keep the mobile header controls above the outside-click layer.
  header?.classList.remove('nav-scroll-hidden');
  nav?.classList.add('open');
  navToggle?.classList.add('menu-open');
  navToggle?.setAttribute('aria-expanded','true');
  mobileNavBackdrop?.classList.add('open');
  document.documentElement.classList.add('mobile-nav-lock');
  document.body.classList.add('mobile-nav-lock');
};
navToggle?.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
  nav?.classList.contains('open') ? closeMobileNav() : openMobileNav();
});
mobileNavBackdrop?.addEventListener('click',(e)=>{
  if(e.target===mobileNavBackdrop) closeMobileNav();
});

// Any tap/click outside the mobile drawer closes it. The drawer itself stays
// interactive so every menu link, Media arrow and submenu item remains clickable.
document.addEventListener('click',(e)=>{
  if(!nav?.classList.contains('open')) return;
  if(e.target.closest('#nav') || e.target.closest('#navToggle')) return;
  closeMobileNav();
});
// Keep menu links fully interactive. Do not close the drawer before the link
// receives its normal click/navigation event.
nav?.addEventListener('click',e=>{
  e.stopPropagation();
  const link=e.target.closest('a');
  if(link && nav.contains(link)){
    // Let the browser follow the link normally, but close the drawer immediately
    // so same-page links such as Location / Our Network never leave the menu open.
    closeMobileNav();
  }
});
window.addEventListener('resize',()=>{
  if(window.innerWidth>760) closeMobileNav();
},{passive:true});

// Navbar dropdowns — text links navigate; only the arrow toggles the menu.
$$('.nav-dropdown').forEach(drop=>{
 const arrow=drop.querySelector('.nav-arrow');
 arrow?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
   const open=drop.classList.toggle('open');
   arrow.setAttribute('aria-expanded',open?'true':'false');
   $$('.nav-dropdown').forEach(other=>{if(other!==drop){other.classList.remove('open');other.querySelector('.nav-arrow')?.setAttribute('aria-expanded','false')}});
 });
});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown')) $$('.nav-dropdown.open').forEach(d=>{d.classList.remove('open');d.querySelector('.nav-arrow')?.setAttribute('aria-expanded','false')})});
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
 ['Make a Strong Impression in the Real World.','Outdoor advertising gives brands a physical presence in the places people see every day. Through our network of hoardings, unipoles and gantries, Krishna Outdoor helps brands create high-impact visibility across Ahmedabad, Gujarat and other key markets.'],
 ['Visibility That Moves with Your Audience.','Transit advertising takes a brand into everyday movement. From Ahmedabad city buses and bus shelters to Surat EV buses, Mumbai local trains, BEST buses and TMT buses, Krishna Outdoor helps brands create repeated visibility across urban routes and commuter environments.'],
 ['Put Your Message in a Medium People Trust.','Newspaper advertising remains an important communication platform for brands looking for market reach, credibility and strong regional communication. Krishna Outdoor’s wider advertising expertise includes print capabilities strengthened by the legacy and experience of Rakesh Advertising. Through experienced media planning and INS agency capabilities, we help brands explore relevant newspaper opportunities based on market, readership, campaign objective and budget.'],
 ['Sound. Sight. Storytelling.','Electronic media gives brands the opportunity to communicate through powerful combinations of audio, visual storytelling and audience reach. Radio can help brands connect through sound, frequency and local relevance. Television remains a powerful medium for building awareness through sight, sound and storytelling. OTT advertising can help brands reach audiences through digital entertainment environments and complement wider campaigns.'],
 ['Keep the Conversation Going.','Today’s audience moves between the physical and digital worlds throughout the day. Our digital and social media services help brands support wider campaign objectives through relevant online communication, targeted promotion and audience engagement. We help brands strengthen their online presence and support campaign objectives through relevant digital communication and performance-focused activity.'],
 ['Build a Brand People Recognise.','Advertising can create attention, but a clear and consistent brand identity helps turn attention into recognition. Our branding solutions help businesses shape the way they communicate through clear identity, campaign communication, creative direction and marketing support.']
];
let serviceIndex=0;
const serviceTitle=$('#serviceTitle'),serviceText=$('#serviceText'),serviceCount=$('#serviceCount'),serviceMeter=$('#serviceMeter'),orbitServiceNo=$('#orbitServiceNo');
function setService(i){if(!serviceTitle) return;serviceIndex=(i+services.length)%services.length;const [title,text]=services[serviceIndex];serviceTitle.textContent=title;serviceText.innerHTML=text;serviceCount.textContent=`${String(serviceIndex+1).padStart(2,'0')} / 06`;serviceMeter.style.width=`${(serviceIndex+1)/6*100}%`;if(orbitServiceNo) orbitServiceNo.textContent=`${String(serviceIndex+1).padStart(2,'0')} / 06`;$$('.orbit-card').forEach((c,n)=>c.classList.toggle('active',n===serviceIndex))}
$$('.orbit-card').forEach((card,i)=>card.addEventListener('click',()=>setService(i)));
$('#serviceNext')?.addEventListener('click',()=>setService(serviceIndex+1));
if(serviceTitle){ setInterval(()=>setService(serviceIndex+1),5000); }


// Continuous planet-style orbit for the 360° Advertising Solutions cards.
// One geometry for desktop + mobile: six perfectly circular cards, equally spaced
// on the same circular path. Mobile only scales the complete composition.
const orbitRingEl=document.querySelector('.solutions-360 .orbit-ring');
const orbitCards=[...document.querySelectorAll('.solutions-360 .orbit-card')];
let orbitAngle=0, orbitFrame;
function animateServiceOrbit(){
  if(!orbitRingEl || !orbitCards.length) return;
  const w=orbitRingEl.clientWidth;
  const h=orbitRingEl.clientHeight;
  const mobile=window.innerWidth<=760;

  // Keep every card completely inside the outer ring while preserving a true circle.
  const cardSize = mobile
    ? Math.min(58, Math.max(48, w * 0.19))
    : Math.min(105, Math.max(88, w * 0.17));
  const safe = mobile ? 7 : 10;
  const radius = Math.max(1, Math.min(w,h)/2 - cardSize/2 - safe);
  const cx=w/2, cy=h/2;
  const step=(Math.PI*2)/orbitCards.length;

  orbitCards.forEach((card,i)=>{
    // Start at the same orientation as the desktop/reference composition.
    const a=orbitAngle + i*step - Math.PI/3;
    const x=cx + Math.cos(a)*radius;
    const y=cy + Math.sin(a)*radius;
    const active=card.classList.contains('active');
    const scale=active ? 1.08 : 1;

    card.style.width=`${cardSize}px`;
    card.style.height=`${cardSize}px`;
    card.style.left='0px';
    card.style.top='0px';
    card.style.right='auto';
    card.style.bottom='auto';
    card.style.margin='0';
    card.style.borderRadius='50%';
    card.style.setProperty('--orbit-transform',`translate3d(${x-cardSize/2}px,${y-cardSize/2}px,0) scale(${scale})`);
    card.style.zIndex=active ? 50 : 30;
  });

  // Slightly faster than desktop, while remaining smooth and continuous.
  orbitAngle += 0.0045; // Smooth continuous orbit speed across desktop and mobile
  orbitFrame=requestAnimationFrame(animateServiceOrbit);
}
if(orbitRingEl && orbitCards.length){
  orbitFrame=requestAnimationFrame(animateServiceOrbit);
  window.addEventListener('resize',()=>{ cancelAnimationFrame(orbitFrame); orbitFrame=requestAnimationFrame(animateServiceOrbit); });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden){ cancelAnimationFrame(orbitFrame); } else { orbitFrame=requestAnimationFrame(animateServiceOrbit); } });
}

// Hero stats strip: duplicate the six cards once for a seamless automatic loop.
const heroStatsTrack = document.querySelector('.stats-strip-track');
if (heroStatsTrack && !heroStatsTrack.dataset.autoLoopReady) {
  heroStatsTrack.dataset.autoLoopReady = 'true';
  [...heroStatsTrack.children].forEach((el) => {
    const clone = el.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    heroStatsTrack.appendChild(clone);
  });
}

// Hero stats: desktop remains static. Mobile/tablet gets a very slow auto-slide
// with mouse-hover pause and touch/mouse drag support. The duplicated track makes
// the loop seamless without changing the original design.
if (heroStatsTrack && !heroStatsTrack.dataset.mobileMotionReady) {
  heroStatsTrack.dataset.mobileMotionReady = 'true';
  const strip = heroStatsTrack.closest('.stats-strip');
  const mq = window.matchMedia('(max-width: 900px)');
  let x = 0, raf = 0, last = 0, paused = false, dragging = false;
  let startPointer = 0, startX = 0;
  const speed = 10; // px/sec — intentionally slow
  const loopWidth = () => heroStatsTrack.scrollWidth / 2;
  const apply = () => { heroStatsTrack.style.transform = `translate3d(${x}px,0,0)`; };
  const normalize = () => {
    const w = loopWidth();
    if (w > 0) {
      while (x <= -w) x += w;
      while (x > 0) x -= w;
    }
  };
  const tick = (t) => {
    if (!last) last = t;
    const dt = Math.min(50, t-last);
    last = t;
    if (mq.matches && !paused && !dragging) {
      x -= speed * dt / 1000;
      normalize();
      apply();
    }
    raf = requestAnimationFrame(tick);
  };
  const start = (e) => {
    if (!mq.matches) return;
    dragging = true;
    paused = true;
    startPointer = e.clientX;
    startX = x;
    strip?.classList.add('is-dragging');
    heroStatsTrack.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!dragging || !mq.matches) return;
    x = startX + (e.clientX - startPointer);
    normalize();
    apply();
    if (Math.abs(e.clientX-startPointer) > 2) e.preventDefault();
  };
  const end = () => {
    if (!dragging) return;
    dragging = false;
    paused = false;
    strip?.classList.remove('is-dragging');
  };
  // Cursor enters the stats strip -> pause. Leaving -> resume.
  strip?.addEventListener('mouseenter',()=>{ if(mq.matches) paused=true; });
  strip?.addEventListener('mouseleave',()=>{ if(mq.matches && !dragging) paused=false; });
  strip?.addEventListener('pointerdown',start);
  strip?.addEventListener('pointermove',move,{passive:false});
  strip?.addEventListener('pointerup',end);
  strip?.addEventListener('pointercancel',end);
  strip?.addEventListener('lostpointercapture',end);
  mq.addEventListener?.('change',()=>{ x=0; apply(); });
  apply();
  raf = requestAnimationFrame(tick);
}

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
 ['client-airtel-logo','png'],['client-apple-logo','png'],['client-audi-logo','png'],['client-giva-logo','png'],['client-gshock-logo','png'],['client-gulab-oil-logo','png'],['client-havells-logo','png'],['client-hyundai-logo','png'],['client-jio-hotstar-logo','jpg'],['client-kitkat-logo','png'],['client-loreal-logo','png'],['client-mercedes-logo','png'],['client-porsche-logo','png'],['client-prime-logo','png'],['client-spotify-logo','webp'],['client-times-fashion-week-logo','png'],['client-tresemme-logo','png'],['client-vadilal-logo','png'],['client-zoho-logo','png']
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
 ooh:{title:'Outdoor Media', kicker:'OOH MEDIA', image:'assets/images/media/home-360-outdoor-hoarding-night-02.webp', color:'#ff2832'},
 transit:{title:'Transit Media', kicker:'TRANSIT MEDIA', image:'assets/images/home/home-360-bus-hd.webp', color:'#53bffb'},
 print:{title:'Print Media', kicker:'PRINT & ELECTRONIC MEDIA', image:'assets/images/print/newspaper.png', color:'#a78bfa'}
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
let panelIndex=0; const panelNames=['ooh','transit','print']; let panelTimer;
function restartPanelTimer(){clearInterval(panelTimer);panelTimer=setInterval(()=>{panelIndex=(panelIndex+1)%panelNames.length;setPanel(panelNames[panelIndex])},3500)}
setPanel('ooh'); restartPanelTimer();

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

// Chatbot — compact WhatsApp-style conversational interactions
const chatbot=$('#chatbot'),chatPanel=$('#chatPanel'),chatClose=$('#chatClose'),chatMessages=$('#chatMessages'),chatComposer=$('#chatComposer'),chatInput=$('#chatInput');
if(chatbot && chatPanel){
 const pad=n=>String(n).padStart(2,'0');
 const timeNow=()=>{const d=new Date();let h=d.getHours(),m=d.getMinutes();const ap=h>=12?'PM':'AM';h=h%12||12;return `${h}:${pad(m)} ${ap}`};
 let chatStartedAt=null;
 const scrollBottom=()=>{if(chatMessages) chatMessages.scrollTop=chatMessages.scrollHeight};
 const stamp=(label='')=>{const el=document.createElement('div');el.className='msg-time';el.textContent=label||timeNow();return el};
 const avatar=()=>`<span class="msg-avatar"><span class="mini-bot"><i></i><i></i><b></b></span></span>`;
 const addMessage=(text,who='bot',withTime=true)=>{
   if(!chatMessages) return;
   const row=document.createElement('div'); row.className=`msg-row ${who}`;
   if(who==='bot') row.innerHTML=`${avatar()}<div class="msg-stack"><div class="msg-bubble">${text}</div></div>`;
   else row.innerHTML=`<div class="msg-stack"><div class="msg-bubble">${text}</div></div>`;
   chatMessages.appendChild(row);
   if(withTime){const t=stamp(timeNow());t.classList.add(who==='bot'?'bot-time':'user-time');row.querySelector('.msg-stack')?.appendChild(t)}
   scrollBottom(); return row;
 };
 const showTyping=()=>{
   const row=document.createElement('div');row.className='msg-row bot typing-row';
   row.innerHTML=`${avatar()}<div class="msg-stack"><div class="msg-bubble typing-bubble"><span class="typing-label">Typing</span><span class="typing-dots"><i></i><i></i><i></i></span></div><div class="msg-time bot-time">${timeNow()}</div></div>`;
   chatMessages?.appendChild(row);scrollBottom();return row;
 };
 const pageName=(document.title||'').toLowerCase();
 const getReply=(input)=>{
   const q=input.toLowerCase().replace(/[^a-z0-9@.+#& -]/g,' ').replace(/\s+/g,' ').trim();
   const page=document.title.toLowerCase();
   const has=(...terms)=>terms.some(t=>q.includes(t));
   if(has('hi','hello','hey','hii','namaste','good morning','good afternoon','good evening')) return 'Hello! I’m Krishna AI. I have access to the information across this website. Ask me about Home, About, Media Solutions, OOH Media, Transit Media, Digital Media, Location, Our Network, Our Work, Careers or Enquire Now.';
   if(has('name','who are you','your name')) return 'I’m Krishna AI, the virtual assistant for Krishna Outdoor. I can guide you through every section and page of this website.';
   if(has('home','homepage')) return 'The Home page covers Krishna Outdoor’s outdoor advertising story, Our Solutions, Our Work, network highlights, clients and the latest enquiry path.';
   if(has('about','company','history','legacy','years','experience')) return 'The About page explains Krishna Outdoor’s advertising journey, leadership, 43+ years of experience, stronger foundation and wider media legacy.';
   if(has('service','services','media solution','media solutions')) return 'Media Solutions includes OOH Media, Transit Media and Digital Media. The broader solutions also cover print & electronic media, branding and digital marketing.';
   if(has('ooh','hoarding','hoardings','billboard','billboards','outdoor')) return 'OOH Media covers outdoor formats such as hoardings and billboards. Ask me about OOH formats, locations, campaigns or the OOH Media page.';
   if(has('transit','bus','train','railway','metro','shelter')) return 'Transit Media covers buses, bus shelters, trains and railway environments. I can guide you to the Transit Media page and its available formats.';
   if(has('digital','dooh','screen','digital billboard')) return 'Digital Media and DOOH cover dynamic digital billboard and screen-led advertising. Ask about formats, campaigns or the Digital Media page.';
   if(has('print','newspaper','press','radio','electronic media')) return 'Print & Electronic Media can include newspaper, press and radio formats as part of an integrated media approach.';
   if(has('location','where','city','ahmedabad','mumbai','thane','rajasthan','address','market')) return 'The Location / Our Network pages cover Krishna Outdoor’s market presence and media opportunities. Ask me about Ahmedabad, Mumbai, Thane, Rajasthan or another market.';
   if(has('network','presence','sites','cities')) return 'Our Network page explains Krishna Outdoor’s media presence, market coverage, hoardings, buses, shelters and train opportunities across key markets.';
   if(has('project','projects','work','campaign','portfolio','case study')) return 'Our Work shows campaign examples and project work. Ask about a campaign, format or the Our Work page and I’ll guide you.';
   if(has('career','careers','job','jobs','join','opening')) return 'The Careers page is available from the website navigation. Ask me about careers or openings and I’ll point you to that section.';
   if(has('contact','phone','call','email','mail','enquire','enquiry','quote','quotation')) return 'Use Enquire Now to send your requirement. The Contact / Enquire page and footer also provide the available contact options.';
   if(has('price','pricing','cost','rate','budget','quotation')) return 'Pricing depends on media format, market, location, duration and campaign size. Tell me the format, city and duration and I can explain what information is needed for an enquiry.';
   if(has('logo','brand','client','clients')) return 'The website includes Krishna Outdoor brand information and an Our Esteemed Clients section. Ask about clients, branding or the relevant page.';
   if(has('thank','thanks','okay','ok','great')) return 'You’re welcome! Ask me anything about the Krishna Outdoor website or its media solutions.';
   if(page.includes('transit')) return 'You’re on the Transit Media page. I can answer questions about buses, trains, shelters, formats and campaign planning.';
   if(page.includes('digital')) return 'You’re on the Digital Media page. I can answer questions about DOOH, digital billboards, screens and campaign planning.';
   if(page.includes('ooh')) return 'You’re on the OOH Media page. I can answer questions about hoardings, billboards, locations and outdoor formats.';
   if(page.includes('about')) return 'You’re on the About page. Ask me about Krishna Outdoor’s journey, experience, leadership or media legacy.';
   if(page.includes('project') || page.includes('work')) return 'You’re on the Our Work page. Ask me about campaigns, projects, media formats or the work showcased here.';
   if(page.includes('network') || page.includes('location')) return 'You’re on the Location / Our Network section. Ask me about market presence, cities, sites or media opportunities.';
   if(page.includes('career')) return 'You’re on the Careers page. Ask me about career information or the available openings section.';
   if(page.includes('contact') || page.includes('enquir')) return 'You’re on the Enquire page. Ask me about submitting a requirement, contact details or the enquiry process.';
   return 'I can help with the full Krishna Outdoor website. Ask me about Home, About, Media Solutions, OOH Media, Transit Media, Digital Media, Print & Electronic Media, Location, Our Network, Our Work, Careers, Clients or Enquire Now.';
 };
 const reply=(input)=>{const typing=showTyping();setTimeout(()=>{typing.remove();addMessage(getReply(input),'bot',true)},850)};
 const closeChat=()=>{chatPanel.classList.remove('open');chatPanel.setAttribute('aria-hidden','true')};
 const openChat=()=>{const wasOpen=chatPanel.classList.contains('open');chatPanel.classList.toggle('open');chatPanel.setAttribute('aria-hidden',wasOpen?'true':'false');if(!wasOpen){if(!chatStartedAt){chatStartedAt=timeNow();if(chatMessages){const day=document.createElement('div');day.className='chat-day';day.textContent=`Today • ${chatStartedAt}`;chatMessages.prepend(day)}}setTimeout(()=>chatInput?.focus(),220)}scrollBottom()};
 chatbot.addEventListener('click',openChat);
 chatClose?.addEventListener('click',e=>{e.stopPropagation();closeChat()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape') closeChat()});
 document.addEventListener('click',e=>{if(chatPanel.classList.contains('open')&&!e.target.closest('#chatPanel')&&!e.target.closest('#chatbot')) closeChat()});
 $$('[data-chat]').forEach(b=>b.addEventListener('click',()=>{const value=b.textContent.replace('↗','').trim();addMessage(value,'user');reply(value)}));
 chatComposer?.addEventListener('submit',e=>{e.preventDefault();const value=chatInput?.value.trim();if(!value)return;addMessage(value,'user');chatInput.value='';reply(value)});
 if(chatMessages && !chatMessages.querySelector('.chat-day')){const day=document.createElement('div');day.className='chat-day';day.textContent=`Today • ${timeNow()}`;chatMessages.prepend(day);$$('.msg-row.bot',chatMessages).forEach(row=>{if(!row.querySelector('.msg-avatar')) row.insertAdjacentHTML('afterbegin',avatar());let stack=row.querySelector('.msg-stack');if(!stack){const bubble=row.querySelector('.msg-bubble');stack=document.createElement('div');stack.className='msg-stack';if(bubble){bubble.parentNode.removeChild(bubble);stack.appendChild(bubble)}row.appendChild(stack)}if(!stack.querySelector('.msg-time')){const t=stamp(timeNow());t.classList.add('bot-time');stack.appendChild(t)}})}
}

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


// Media Solutions — subtle 3D pointer motion for premium cards.
(()=>{
 const els=[...document.querySelectorAll('.media-page .media-card,.media-page .electronic-cards article,.media-page .digital-floating span,.media-page .branding-items span')];
 els.forEach(el=>{
   el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-5px)`});
   el.addEventListener('pointerleave',()=>{el.style.transform=''});
 });
 const hero=document.querySelector('.media-hero');
 hero?.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;hero.style.setProperty('--mx',`${x*10}px`);hero.style.setProperty('--my',`${y*6}px`)});
})();


/* Careers + Enquiry page interactions */
(function(){
  const items=document.querySelectorAll('.kr-reveal');
  if(items.length){
    const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});
    items.forEach(el=>io.observe(el));
  }
  ['careerPhone','enquiryPhone'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',()=>{el.value=el.value.replace(/\\D/g,'').slice(0,10)})}});
  const forms=[['careerForm','careerStatus','Application ready — your resume link or attachment can now be included. Our team will review your application.'],['enquiryForm','enquiryStatus','Thanks — your enquiry is ready. Our team will get back to you shortly.']];
  forms.forEach(([fid,sid,msg])=>{const f=document.getElementById(fid),status=document.getElementById(sid);if(f){f.addEventListener('submit',e=>{e.preventDefault(); if(!f.checkValidity()){f.reportValidity();return;} status.textContent=msg;status.style.color='#ef2027'; f.reset();})}});
})();

// Hero video visibility + sound control.
// Only the desktop/mobile video matching the viewport is allowed to play.
// When the hero leaves the viewport it pauses and mutes. Audio is unlocked on the
// user's first real interaction, which avoids browser autoplay-with-sound blocking.
(function(){
  const desktop=document.querySelector('.hero-media-desktop');
  const mobile=document.querySelector('.hero-media-mobile');
  if(!desktop && !mobile) return;

  const videos=[desktop,mobile].filter(Boolean);
  const hero=document.querySelector('.hero');
  const mq=window.matchMedia('(max-width:760px)');
  let heroVisible=false;
  // Try sound-on autoplay first; browsers that block it will fall back to muted playback.
  // The first user gesture then unlocks sound for subsequent plays.
  let audioUnlocked=true;

  const activeVideo=()=>mq.matches?mobile:desktop;

  const stopVideo=(video,reset=false)=>{
    if(!video) return;
    video.pause();
    video.muted=true;
    if(reset){
      try{ video.currentTime=0; }catch{}
    }
  };

  const playVisibleVideo=()=>{
    videos.forEach(video=>{
      if(video!==activeVideo()) stopVideo(video,true);
    });
    const active=activeVideo();
    if(!active || !heroVisible) return;
    active.muted=!audioUnlocked;
    active.play().catch(()=>{
      // Browsers may block unmuted autoplay. Keep the visible video moving silently
      // until a user gesture unlocks audio.
      active.muted=true;
      active.play().catch(()=>{});
    });
  };

  const unlockAudio=()=>{
    audioUnlocked=true;
    playVisibleVideo();
  };

  ['pointerdown','touchstart','keydown'].forEach(type=>{
    window.addEventListener(type,unlockAudio,{passive:true,once:false});
  });

  if(hero){
    const observer=new IntersectionObserver(entries=>{
      const entry=entries[0];
      heroVisible=entry.isIntersecting && entry.intersectionRatio>=0.35;
      if(heroVisible){
        playVisibleVideo();
      }else{
        videos.forEach(video=>stopVideo(video,false));
      }
    },{threshold:[0,0.35,0.6,1]});
    observer.observe(hero);
  }

  const handleViewportChange=()=>{
    videos.forEach(video=>stopVideo(video,true));
    playVisibleVideo();
  };
  mq.addEventListener?.('change',handleViewportChange);
  mq.addListener?.(handleViewportChange);
  window.addEventListener('resize',handleViewportChange,{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      videos.forEach(video=>stopVideo(video,false));
    }else{
      playVisibleVideo();
    }
  });

  // Ensure the correct source is initially silent/paused until visibility is known.
  videos.forEach(video=>stopVideo(video,true));
})();


/* Navbar scroll behavior: hide while scrolling down, reveal while scrolling up. */
(function(){
  const header=document.getElementById('header');
  if(!header) return;
  let lastY=window.scrollY||0;
  let ticking=false;
  const update=()=>{
    const y=window.scrollY||window.pageYOffset||0;
    const nav=document.getElementById('nav');
    const menuOpen=nav && (nav.classList.contains('open') || nav.classList.contains('active'));
    if(y<=12 || y<lastY || menuOpen){
      header.classList.remove('nav-scroll-hidden');
    }else if(y>lastY+2){
      header.classList.add('nav-scroll-hidden');
    }
    lastY=y;
    ticking=false;
  };
  window.addEventListener('scroll',()=>{
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking=true;
    }
  },{passive:true});
})();
