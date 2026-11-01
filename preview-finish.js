/* Preview repair: responsive cover hints, explicit motion, and safe gallery controls. */
(() => {
  'use strict';
  function boot() {
    if(window.__previewFinish)return;
    window.__previewFinish=true;
    const root=document.documentElement;
    if(typeof window.theme==='function')window.theme(true);else root.dataset.theme='dark';
    root.classList.remove('preview-boot');
    const S=window.SITE, $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
    if(!S||!$('#project-grid')||!$('#project-dialog'))return;
    const media=matchMedia('(prefers-reduced-motion: reduce)'), active=new Set();
    const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
    function move(n,distance=16,delay=0,duration=500){
      if(!n||media.matches||typeof n.animate!=='function')return;
      const a=n.animate([{opacity:0,transform:`translateY(${distance}px)`},{opacity:1,transform:'translateY(0)'}],{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
      active.add(a);a.onfinish=()=>{active.delete(a);a.cancel();};a.oncancel=()=>active.delete(a);
    }
    function preference(){root.dataset.previewMotion=media.matches?'off':'on';if(media.matches)active.forEach(a=>a.cancel());}
    preference();media.addEventListener('change',preference);
    $$('.hero h1>span').forEach((n,i)=>move(n,26,i*90,650));
    $$('.hero>div>.label,.hero-copy,.hero>div>.actions,.hero>div>.location,.hero figure').forEach((n,i)=>move(n,14,80+i*45,550));
    const seen=new WeakSet(),delays=new WeakMap();let observer=null;
    if('IntersectionObserver' in window)observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){move(e.target,14,delays.get(e.target)||0,480);e.target.classList.add('preview-in');observer.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -16px 0px'});
    function reveal(nodes){nodes.forEach((n,i)=>{if(seen.has(n))return;seen.add(n);n.classList.add('preview-reveal');delays.set(n,Math.min(i%4*40,120));if(observer)observer.observe(n);});}
    function covers(){
      $$('#project-grid .project').forEach(card=>{
        const p=S.projects.find(item=>item.title===$('h3',card)?.textContent);
        if(!p?.images?.[0]||$('.preview-cover',card))return;
        const image=$('img',card),open=$('.btn',card);if(!image||!open)return;
        image.loading='lazy';image.decoding='async';image.fetchPriority='low';image.width=800;image.height=500;
        image.src=p.images[0];image.alt=p.title+' — original project cover';
        const button=make('button','preview-cover');button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label','Open '+p.title+' photographs and details');
        image.replaceWith(button);button.append(image);
        const count=p.galleryImages?.length;button.append(make('span','preview-cover-note',count?`Original cover · ${count} gallery photos`:'Coursework cover'));
        button.addEventListener('click',()=>open.click());
      });
      reveal($$('#project-grid .project'));
    }
    covers();new MutationObserver(covers).observe($('#project-grid'),{childList:true});
    reveal($$('.section-head,#experience-list details,.training,.about,.contact-grid,.credential'));
    const footer=$('.footer p:nth-child(2)');if(footer)footer.textContent='Preview · Responsive media / motion v2';
    const progress=make('div');progress.id='preview-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);let queued=false;
    function paint(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%';queued=false;}
    addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paint);}},{passive:true});addEventListener('resize',paint);paint();
    if('IntersectionObserver' in window){
      const spy=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('#navigation a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-25% 0px -50% 0px'});
      ['experience','projects','about','contact'].forEach(id=>{const n=document.getElementById(id);if(n)spy.observe(n);});
      const value=$$('.credential strong').find(n=>n.textContent.trim()==='900 hours');
      if(value&&!media.matches){const counter=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;counter.unobserve(e.target);const start=performance.now();function tick(now){const t=Math.min((now-start)/800,1);value.textContent=(media.matches?900:Math.round(900*(1-Math.pow(1-t,3))))+' hours';if(t<1&&!media.matches)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),{threshold:.4});counter.observe(value);}
    }
    const path=$('#path');if(path&&!path.checked){path.checked=true;path.dispatchEvent(new Event('change',{bubbles:true}));}
    const modal=$('#project-dialog'),host=$('#modal-body'),zoom=make('dialog','preview-lightbox');zoom.id='preview-lightbox';zoom.setAttribute('aria-labelledby','preview-zoom-title');
    const head=make('div','modal-head'),title=make('h2'),close=make('button','iconbtn','×');title.id='preview-zoom-title';title.textContent='Project photograph';close.type='button';close.setAttribute('aria-label','Close enlarged photograph');head.append(title,close);
    const large=make('img','preview-large-image');large.width=1400;large.height=1000;large.alt='Enlarged project photograph';
    const controls=make('div','gallery-controls'),previous=make('button','btn','← Previous'),next=make('button','btn','Next →');previous.type=next.type='button';controls.append(previous,next);zoom.append(head,large,controls);document.body.append(zoom);
    const currentProject=()=>S.projects.find(p=>p.title===$('#modal-title').textContent);
    const photosFor=p=>p?.galleryImages?.length?p.galleryImages:(p?.images||[]);
    function navigate(step){if(photosFor(currentProject()).length<2)return;const buttons=$$('.gallery-controls button',host),button=buttons[step<0?0:1];if(button&&!button.disabled)button.click();}
    function syncZoom(){const image=$('.gallery-image',host);if(!image)return;large.src=image.src;large.alt=image.alt;title.textContent=image.alt;previous.disabled=next.disabled=photosFor(currentProject()).length<2;}
    previous.addEventListener('click',()=>navigate(-1));next.addEventListener('click',()=>navigate(1));close.addEventListener('click',()=>zoom.close());
    zoom.addEventListener('click',e=>{if(e.target===zoom){const r=zoom.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)zoom.close();}});
    zoom.addEventListener('close',()=>{document.body.classList.toggle('modal-open',modal.open);if(modal.open)$('.preview-zoom',host)?.focus();});modal.addEventListener('close',()=>{if(zoom.open)zoom.close();});
    [modal,zoom].forEach(d=>d.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){e.preventDefault();e.stopPropagation();navigate(e.key==='ArrowLeft'?-1:1);}}));
    const imagesSeen=new WeakSet();
    function gallery(){
      const image=$('.gallery-image',host);if(!image)return;
      if(!imagesSeen.has(image)){
        imagesSeen.add(image);
        function ready(){move(image,4,0,220);const photos=photosFor(currentProject());if(photos.length>1){const i=photos.findIndex(src=>new URL(src,location.href).href===image.src),preload=new Image();preload.src=photos[(Math.max(i,0)+1)%photos.length];}}
        if(image.complete&&image.naturalWidth)ready();else image.addEventListener('load',ready,{once:true});
        let start=null;image.addEventListener('touchstart',e=>{start=e.touches[0].clientX;},{passive:true});image.addEventListener('touchend',e=>{if(start===null)return;const dx=e.changedTouches[0].clientX-start;if(Math.abs(dx)>55)navigate(dx<0?1:-1);start=null;},{passive:true});
      }
      if(!$('.preview-zoom',host)){
        const button=make('button','btn preview-zoom','Enlarge photograph ↗');button.type='button';button.addEventListener('click',()=>{if(!$('.gallery-image',host)?.naturalWidth)return;syncZoom();zoom.showModal();document.body.classList.add('modal-open');close.focus();});
        const anchor=$('.thumbs',host)||$('.gallery-controls',host);if(anchor)anchor.after(button);else host.append(button);
        if(!currentProject()?.galleryImages?.length)host.append(make('p','preview-cover-notice','Illustrative coursework cover — not a photograph of a completed installation.'));
      }
      if(zoom.open)syncZoom();
    }
    new MutationObserver(gallery).observe(host,{childList:true,subtree:true});
  }
  function start(){const sheet=document.querySelector('link[href*="preview-finish.css"]');if(sheet&&!sheet.href.includes('v=responsive-v2')){sheet.addEventListener('load',boot,{once:true});sheet.addEventListener('error',boot,{once:true});sheet.href='./preview-finish.css?v=responsive-v2';setTimeout(boot,1500);}else if(sheet&&!sheet.sheet){sheet.addEventListener('load',boot,{once:true});sheet.addEventListener('error',boot,{once:true});setTimeout(boot,1500);}else boot();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
