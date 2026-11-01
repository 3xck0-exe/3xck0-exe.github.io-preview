/* Interaction layer for the reviewed Modern Field Notebook markup only. */
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const site=window.SITE;
if(!site||!$('[data-theme-toggle]')||!$('#photo-dialog'))return;
let theme='dark';
const themeButton=$('[data-theme-toggle]');
function setTheme(){document.documentElement.dataset.theme=theme;themeButton.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);themeButton.title=themeButton.getAttribute('aria-label');}
setTheme();themeButton.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';setTheme();});
const menu=$('#mobile-nav'),menuButton=$('.menu-toggle');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));menuButton.setAttribute('aria-label',menu.hidden?'Open navigation':'Close navigation');});
$$('#mobile-nav a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
const cards=$$('.project-card');
$$('.filters button').forEach(button=>button.addEventListener('click',()=>{
$$('.filters button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));let count=0;
cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
$('.project-grid').classList.toggle('filtered',button.dataset.filter!=='all');
$('#filter-count').textContent=`${String(count).padStart(2,'0')} project${count===1?'':'s'}`;
}));
const projectDialog=$('#project-dialog'),photoDialog=$('#photo-dialog'),galleryImage=$('#gallery-image'),imageState=$('#image-state');
let currentProject=null,photoIndex=0,lastFocus=null,imageRequest=0;
const lockScroll=()=>{document.body.style.overflow=projectDialog.open||photoDialog.open?'hidden':'';};
const captionFor=()=>currentProject.captions[photoIndex]||`${currentProject.title}, project photograph ${photoIndex+1}`;
function syncLarge(){$('#large-photo').src=currentProject.photos[photoIndex];$('#large-photo').alt=captionFor();$('#photo-dialog-title').textContent=`${photoIndex+1} / ${currentProject.photos.length} · ${captionFor()}`;}
function showPhoto(index){
const project=currentProject,photos=project.photos;photoIndex=(index+photos.length)%photos.length;const src=photos[photoIndex],request=++imageRequest;
imageState.textContent='Loading photograph…';galleryImage.style.opacity='.18';
galleryImage.onload=()=>{if(request===imageRequest){imageState.textContent='';galleryImage.style.opacity='1';}};
galleryImage.onerror=()=>{if(request===imageRequest){imageState.textContent='This photograph could not load. Try the original-image link below.';galleryImage.style.opacity='0';}};
galleryImage.alt=captionFor();galleryImage.src=src;
if(galleryImage.complete&&galleryImage.naturalWidth){imageState.textContent='';galleryImage.style.opacity='1';}
$('#photo-caption').textContent=captionFor();$('#photo-counter').textContent=`${photoIndex+1} / ${photos.length}`;
$('#previous-photo').disabled=$('#next-photo').disabled=photos.length<2;$('#large-previous').disabled=$('#large-next').disabled=photos.length<2;
$('#photo-callout').hidden=true;$('#photo-marker').setAttribute('aria-expanded','false');
$('#photo-callout').textContent=`${captionFor()} ${project.context==='School practice'?'Training exercise — not a claim of an inspected installation.':project.id==='calculations'?'This cover is illustrative; no calculation worksheet is supplied in the existing gallery.':'See the personal-contribution notes for the scope of this work.'}`;
$('#photo-marker').hidden=false;$('#original-image-link').href=project.galleryOriginals[photoIndex];
$$('#gallery-thumbnails button').forEach((button,i)=>button.setAttribute('aria-current',String(i===photoIndex)));
if(photoDialog.open)syncLarge();if(photos.length>1){const next=new Image();next.src=photos[(photoIndex+1)%photos.length];}
}
function openProject(id,trigger){
const project=site.projects.find(item=>item.id===id);if(!project)return;lastFocus=trigger||document.activeElement;currentProject=project;
$('#dialog-title').textContent=project.title;$('#dialog-context').textContent=project.context;$('#dialog-meta').textContent=project.meta;$('#project-summary').textContent=project.summary;
const contributions=$('#contribution-list');contributions.replaceChildren();project.contribution.forEach(text=>{const li=document.createElement('li');li.textContent=text;contributions.append(li);});
$('#learning-note').textContent=project.learning;$('#project-tags').replaceChildren();project.tags.forEach(text=>{const span=document.createElement('span');span.className='tag';span.textContent=text;$('#project-tags').append(span);});
$('#project-scope').textContent=project.category==='School'?'Electrical work shown here is training / coursework, not a claim of independent licensed work or inspection approval.':project.id==='telecom'?'Field work shown is low-voltage communications service, separate from the school electrical training.':'Mechanical work was performed in an assisting / apprentice capacity.';
$('#gallery-thumbnails').replaceChildren();if(project.photos.length>1)project.photos.forEach((src,index)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`View photograph ${index+1}: ${project.captions[index]}`);const img=document.createElement('img');img.src=src;img.alt='';img.width=68;img.height=56;img.loading='lazy';button.append(img);button.addEventListener('click',()=>showPhoto(index));$('#gallery-thumbnails').append(button);});
$('#cover-image').src=project.images[0];$('#original-cover').open=false;$('#original-cover').hidden=project.id==='calculations';showPhoto(0);projectDialog.showModal();lockScroll();projectDialog.scrollTop=0;$('#dialog-close').focus({preventScroll:true});
}
$$('[data-project]').forEach(trigger=>trigger.addEventListener('click',()=>openProject(trigger.dataset.project,trigger)));
$('#dialog-close').addEventListener('click',()=>projectDialog.close());
projectDialog.addEventListener('click',event=>{if(event.target===projectDialog){const r=projectDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)projectDialog.close();}});
projectDialog.addEventListener('close',()=>{lockScroll();if(lastFocus)lastFocus.focus({preventScroll:true});});
$('#previous-photo').addEventListener('click',()=>showPhoto(photoIndex-1));$('#next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));
$('#photo-marker').addEventListener('click',()=>{const panel=$('#photo-callout');panel.hidden=!panel.hidden;$('#photo-marker').setAttribute('aria-expanded',String(!panel.hidden));});
$('#enlarge-photo').addEventListener('click',()=>{syncLarge();photoDialog.showModal();lockScroll();$('#close-photo').focus();});
$('#close-photo').addEventListener('click',()=>photoDialog.close());photoDialog.addEventListener('close',()=>{lockScroll();if(projectDialog.open)$('#enlarge-photo').focus({preventScroll:true});});
$('#large-previous').addEventListener('click',()=>showPhoto(photoIndex-1));$('#large-next').addEventListener('click',()=>showPhoto(photoIndex+1));
[projectDialog,photoDialog].forEach(dialog=>dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();event.stopPropagation();showPhoto(photoIndex+(event.key==='ArrowLeft'?-1:1));}}));
let touchX=null;galleryImage.addEventListener('touchstart',event=>{touchX=event.touches[0].clientX;},{passive:true});
galleryImage.addEventListener('touchend',event=>{if(touchX===null)return;const delta=event.changedTouches[0].clientX-touchX;if(Math.abs(delta)>55)showPhoto(photoIndex+(delta<0?1:-1));touchX=null;},{passive:true});
const switchPositions=[0,1];let showPath=false;
function paintCircuit(){
const [a,b]=switchPositions,lit=a===b;$('#switch-1').setAttribute('aria-pressed',String(Boolean(a)));$('#switch-2').setAttribute('aria-pressed',String(Boolean(b)));
$('#sw1 .blade').setAttribute('y2',a?'148':'92');$('#sw2 .blade').setAttribute('y2',b?'148':'92');$('#lamp').classList.toggle('on',lit);$('#lamp-state').textContent=lit?'Lamp on':'Lamp off';$('#lamp-state').classList.toggle('on',lit);
$('#circuit-explanation').textContent=lit?'The switches connect the same traveler. The path is complete and the lamp is on.':'The switches connect different travelers. The path is interrupted and the lamp is off.';
$$('#circuit .wire, #circuit .blade').forEach(wire=>wire.classList.remove('path-active','path-selected'));
if(showPath){$('#sw1 .blade').classList.add(lit?'path-active':'path-selected');if(lit)$('#sw2 .blade').classList.add('path-active');const ids=['w-hot',a?'w-trav2':'w-trav1'];if(lit)ids.push('w-load','w-neutral');ids.forEach(id=>{const wire=document.getElementById(id);if(wire)wire.classList.add(lit?'path-active':'path-selected');});}
}
$('#switch-1').addEventListener('click',()=>{switchPositions[0]=1-switchPositions[0];paintCircuit();});$('#switch-2').addEventListener('click',()=>{switchPositions[1]=1-switchPositions[1];paintCircuit();});
$('#sw1').addEventListener('click',()=>$('#switch-1').click());$('#sw2').addEventListener('click',()=>$('#switch-2').click());$('#sw1').style.cursor=$('#sw2').style.cursor='pointer';
$('#show-path').addEventListener('click',()=>{showPath=!showPath;$('#show-path').setAttribute('aria-pressed',String(showPath));$('#show-path').textContent=showPath?'Hide circuit path':'Show circuit path';paintCircuit();});paintCircuit();
$('#copy-email').addEventListener('click',async()=>{const status=$('#copy-status');try{await navigator.clipboard.writeText(site.contact.email);status.textContent='Copied.';}catch{status.textContent='Select the email address above to copy it.';}setTimeout(()=>{status.textContent='';},4500);});
$$('img:not(#gallery-image):not(#large-photo)').forEach(img=>img.addEventListener('error',()=>{if(!img.getAttribute('src'))return;const fallback=document.createElement('div');fallback.className='image-fallback';fallback.setAttribute('role','img');fallback.setAttribute('aria-label',img.alt||'Project photograph unavailable');fallback.textContent='Photo unavailable — the project notes are still available.';img.replaceWith(fallback);},{once:true}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)$$('.header-inner nav a').forEach(link=>{if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-20% 0px -50% 0px'});$$('main>section[id]').forEach(section=>observer.observe(section));}
})();
