document.addEventListener('click',function(event){
 const link=event.target.closest('a');
 if(link?.dataset.localOnly){event.preventDefault();}
 const print=event.target.closest('[data-print]');
 if(print){event.preventDefault();window.print();}
});

// Align the download box with the title's lowercase c after fonts have loaded.
(function () {
 function alignDownload() {
  const title=document.querySelector('#scoreTable > h1');
  if(!title || !matchMedia('(max-width: 980px)').matches) return;
  const text=title.firstChild;
  if(!text || text.nodeType!==Node.TEXT_NODE) return;
  const start=text.textContent.indexOf('Score')+1;
  const end=text.textContent.indexOf('Report')+6;
  if(start<1 || end<6) return;
  const range=document.createRange();range.setStart(text,start);range.setEnd(text,end);
  const rect=range.getBoundingClientRect(),origin=title.getBoundingClientRect();
  const extra=parseFloat(getComputedStyle(title).fontSize)*0.3;
  title.parentElement.style.setProperty('--download-right',`${rect.right-origin.left+extra}px`);
  title.parentElement.style.setProperty('--download-width',`${rect.width+extra}px`);
 }
 document.fonts.ready.then(alignDownload);
 window.addEventListener('resize',alignDownload);
})();
