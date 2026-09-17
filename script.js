'use strict';
document.write('<script src="./script-core.js?v=13"><\/script>');
window.addEventListener('DOMContentLoaded',()=>{
 const card=document.getElementById('soundCard');
 const soundPicBtn=document.getElementById('soundPictureBtn');
 const soundPic=document.getElementById('soundPicture');
 const soundMastery=document.getElementById('soundKnown');
 const word=document.getElementById('word');
 const wordPicBtn=document.getElementById('pictureBtn');
 const wordPic=document.getElementById('picture');
 const wordMastery=document.getElementById('readOk');

 card.onclick=()=>{const s=currentSound();if(s){soundMastery.disabled=true;speakFrench(s.word)}};
 soundPicBtn.onclick=()=>{const s=currentSound();if(!s)return;const willShow=soundPic.hidden;soundPic.hidden=!willShow;soundPicBtn.textContent=willShow?'Cacher l’image':'Voir l’image';if(willShow){soundMastery.disabled=true;speakFrench(s.word)}};
 soundPic.onclick=()=>{const s=currentSound();if(s)speakFrench(s.word)};

 word.onclick=()=>{const w=currentWord();if(w){usedHint=true;wordMastery.disabled=true;speakFrench(w.word)}};
 wordPicBtn.onclick=()=>{const w=currentWord();if(!w)return;usedHint=true;wordMastery.disabled=true;const willShow=wordPic.hidden;wordPic.hidden=!willShow;wordPicBtn.textContent=willShow?'Cacher l’image':'Voir l’image';if(willShow)speakFrench(w.word)};
 wordPic.onclick=()=>{const w=currentWord();if(w){usedHint=true;wordMastery.disabled=true;speakFrench(w.word)}};
});