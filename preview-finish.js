/* Adapts the main portfolio's cover-first cards and motion to the active preview DOM. */
(() => {
  'use strict';
  function boot() {
    if (window.__previewFinish) return;
    window.__previewFinish = true;
    const root = document.documentElement;
    if (typeof window.theme === 'function') window.theme(true); else root.dataset.theme = 'dark';
    root.classList.remove('preview-boot');
    const S = window.SITE;
    const $ = (s,r=document) => r.querySelector(s);
    const $$ = (s,r=document) => [...r.querySelectorAll(s)];
    if (!S || !$('#project-grid') || !$('#project-dialog')) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const make = (tag,cls,text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
    let revealObserver = null;
    const revealed = new WeakSet();
    if (!reduced && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
        if(e.isIntersecting){e.target.classList.add('preview-in');revealObserver.unobserve(e.target);}
      }), {threshold:.08});
    }
    function reveal(nodes) {
      if(!revealObserver)return;
      nodes.forEach((n,i)=>{if(revealed.has(n))return;revealed.add(n);n.classList.add('preview-reveal');n.style.transitionDelay=`${Math.min(i%6*70,350)}ms`;revealObserver.observe(n);});
    }
    function covers() {
      $$('#project-grid .project').forEach(card => {
        const p=S.projects.find(item=>item.title===$('h3',card)?.textContent);
        if(!p?.images?.[0] || $('.preview-cover',card))return;
        const image=$('img',card), open=$('.btn',card);
        if(!image || !open)return;
        image.src=p.images[0];image.alt=p.title+' — original project cover';
        const button=make('button','preview-cover');button.type='button';
        button.setAttribute('aria-label','Open '+p.title+' photographs and details');
        image.replaceWith(button);button.append(image);
        const count=p.galleryImages?.length;
        button.append(make('span','preview-cover-note',count?`Original cover · ${count} gallery photos`:'Coursework cover'));
        button.addEventListener('click',()=>open.click());
      });
      reveal($$('#project-grid .project'));
    }
    covers();
    new MutationObserver(covers).observe($('#project-grid'),{childList:true});
    reveal($$('.section-head, #experience-list details, .training, .about, .contact-grid, .credential'));
    const footer=$('.footer p:nth-child(2)');if(footer)footer.textContent='Preview · Brown / amber · Original covers & motion';
    const progress=make('div');progress.id='preview-progress';progress.setAttribute('aria-hidden','true');document.body.prepend(progress);
    let queued=false;
    function paintProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%';queued=false;}
    addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(paintProgress);}},{passive:true});
    addEventListener('resize',paintProgress);paintProgress();
    if('IntersectionObserver' in window){
      const spy=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('#navigation a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-25% 0px -50% 0px'});
      ['experience','projects','about','contact'].forEach(id=>{const n=document.getElementById(id);if(n)spy.observe(n);});
    }
    if(!reduced && 'IntersectionObserver' in window){
      const trainingValue=$$('.credential strong').find(n=>n.textContent.trim()==='900 hours');
      if(trainingValue){const counter=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;counter.unobserve(e.target);const start=performance.now();function tick(now){const t=Math.min((now-start)/1100,1);trainingValue.textContent=Math.round(900*(1-Math.pow(1-t,3)))+' hours';if(t<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);}),{threshold:.6});counter.observe(trainingValue);}
    }
    const modal=$('#project-dialog'),host=$('#modal-body');
    const zoom=make('dialog','preview-lightbox');zoom.id='preview-lightbox';zoom.setAttribute('aria-labelledby','preview-zoom-title');
    const head=make('div','modal-head'),title=make('h2'),close=make('button','iconbtn','×');
    title.id='preview-zoom-title';title.textContent='Project photograph';close.type='button';close.setAttribute('aria-label','Close enlarged photograph');head.append(title,close);
    const large=make('img','preview-large-image');large.width=1400;large.height=1000;large.alt='Enlarged project photograph';
    const controls=make('div','gallery-controls'),previous=make('button','btn','← Previous'),next=make('button','btn','Next →');previous.type=next.type='button';controls.append(previous,next);zoom.append(head,large,controls);document.body.append(zoom);
    function navigate(step){const buttons=$$('.gallery-controls button',host);const button=buttons[step<0?0:1];if(button&&!button.disabled)button.click();}
    function syncZoom(){const image=$('.gallery-image',host);if(!image)return;large.src=image.src;large.alt=image.alt;title.textContent=image.alt;const buttons=$$('.gallery-controls button',host);previous.disabled=!buttons[0]||buttons[0].disabled;next.disabled=!buttons[1]||buttons[1].disabled;}
    previous.addEventListener('click',()=>navigate(-1));next.addEventListener('click',()=>navigate(1));close.addEventListener('click',()=>zoom.close());
    zoom.addEventListener('click',e=>{if(e.target===zoom){const r=zoom.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)zoom.close();}});
    zoom.addEventListener('close',()=>{document.body.classList.toggle('modal-open',modal.open);if(modal.open)$('.preview-zoom',host)?.focus();});
    modal.addEventListener('close',()=>{if(zoom.open)zoom.close();});
    [modal,zoom].forEach(dialog=>dialog.addEventListener('keydown',e=>{if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)){e.preventDefault();e.stopPropagation();navigate(e.key==='ArrowLeft'?-1:1);}}));
    const photosSeen=new WeakSet();
    function gallery(){
      const image=$('.gallery-image',host);if(!image)return;
      if(!photosSeen.has(image)){
        photosSeen.add(image);
        function ready(){
          if(!reduced && image.animate)image.animate([{opacity:0},{opacity:1}],{duration:240,easing:'cubic-bezier(.16,1,.3,1)'});
          const p=S.projects.find(item=>item.title===$('#modal-title').textContent),photos=p?.galleryImages||p?.images||[];
          if(photos.length>1){const i=photos.findIndex(src=>new URL(src,location.href).href===image.src);const preload=new Image();preload.src=photos[(Math.max(i,0)+1)%photos.length];}
        }
        if(image.complete&&image.naturalWidth)ready();else image.addEventListener('load',ready,{once:true});
        let start=null;image.addEventListener('touchstart',e=>{start=e.touches[0].clientX;},{passive:true});image.addEventListener('touchend',e=>{if(start===null)return;const distance=e.changedTouches[0].clientX-start;if(Math.abs(distance)>55)navigate(distance<0?1:-1);start=null;},{passive:true});
      }
      if(!$('.preview-zoom',host)){
        const button=make('button','btn preview-zoom','Enlarge photograph ↗');button.type='button';
        button.addEventListener('click',()=>{const current=$('.gallery-image',host);if(!current?.naturalWidth)return;syncZoom();zoom.showModal();document.body.classList.add('modal-open');close.focus();});
        const anchor=$('.thumbs',host)||$('.gallery-controls',host);if(anchor)anchor.after(button);else host.append(button);
        const p=S.projects.find(item=>item.title===$('#modal-title').textContent);
        if(!p?.galleryImages?.length)host.append(make('p','preview-cover-notice','Illustrative coursework cover — not a photograph of a completed installation.'));
      }
      if(zoom.open)syncZoom();
    }
    new MutationObserver(gallery).observe(host,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
