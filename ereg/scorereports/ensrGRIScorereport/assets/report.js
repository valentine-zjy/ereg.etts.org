document.addEventListener('click',function(event){
 const link=event.target.closest('a');
 if(link?.dataset.localOnly){event.preventDefault();}
 const print=event.target.closest('[data-print]');
 if(print){event.preventDefault();window.print();}
});
