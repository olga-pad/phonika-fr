'use strict';
document.write('<script src="./script-core.js?v=13"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
 // French content is rendered in uppercase by default; keep that as the default letter style.
 const card=document.getElementById('soundCard'), picBtn=document.getElementById('soundPictureBtn'), pic=document.getElementById('soundPicture'), mastery=document.getElementById('soundKnown');
 const hint=(show)=>{const s=currentSound();if(!s)return;mastery.disabled=true;if(show)pic.hidden=false;speakFrench(s.word)};
 card.addEventListener('click',()=>hint(false));
 picBtn.addEventListener('click',()=>hint(true));
 const wordPicBtn=document.getElementById('pictureBtn');
 wordPicBtn.addEventListener('click',()=>{const w=currentWord();if(w){usedHint=true;document.getElementById('readOk').disabled=true;speakFrench(w.word)}});
});