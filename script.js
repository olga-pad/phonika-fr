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
 const wordPrev=document.getElementById('wordPrev'),wordNext=document.getElementById('wordNext');
 const soundPrev=document.getElementById('soundPrev'),soundNavNext=document.getElementById('soundNavNext');
 const oldWordNext=document.getElementById('nextBtn'),oldSoundNext=document.getElementById('soundNext');
 wordNext.onclick=()=>oldWordNext?.click();soundNavNext.onclick=()=>oldSoundNext?.click();
 wordPrev.onclick=()=>{};soundPrev.onclick=()=>{};
 const home=document.getElementById('homeButton');if(home)home.onclick=()=>{document.getElementById('readingTab')?.click();};


 // Letter style: uppercase print by default, placed first in parent settings.
 let frStyle=localStorage.getItem('phonika-fr-letter-style')||'upper';
 const parentMain=document.querySelector('#parentView main');
 const summary=document.querySelector('#parentView .summary');
 const stylePanel=document.createElement('section');
 stylePanel.className='panel';
 stylePanel.innerHTML='<h2>Style des lettres</h2><p>Choisissez l’écriture affichée pendant les activités. Les majuscules d’imprimerie sont utilisées par défaut.</p><select id="frLetterStyle" class="mode" style="width:100%;min-height:52px;border:1px solid #cadbd3;border-radius:13px;background:white;color:#173b35;padding:10px 14px"><option value="upper">ABC</option><option value="lower">abc</option><option value="title">Abc</option></select>';
 if(summary)summary.insertAdjacentElement('afterend',stylePanel);else parentMain?.prepend(stylePanel);
 const styleSelect=document.getElementById('frLetterStyle');styleSelect.value=frStyle;
 const styled=t=>{const s=t.toLowerCase();if(frStyle==='upper')return s.toUpperCase();if(frStyle==='title')return s.charAt(0).toUpperCase()+s.slice(1);return s;};
 const applyStyle=()=>{
   const w=currentWord();if(w&&word.children.length)[...word.children].forEach((span,i)=>{span.textContent=styled(w.word)[i]||''});
   const s=currentSound();if(s&&card.children.length){const shown=styled(s.g);card.firstElementChild.textContent=shown;}
 };
 styleSelect.onchange=e=>{frStyle=e.target.value;localStorage.setItem('phonika-fr-letter-style',frStyle);applyStyle();};
 const oldShowWord=showWord;showWord=function(){oldShowWord();applyStyle();};
 const oldShowSound=showSound;showSound=function(){oldShowSound();applyStyle();};
 applyStyle();

 card.onclick=()=>{const s=currentSound();if(s){soundMastery.disabled=true;speakFrench(s.word)}};
 soundPicBtn.onclick=()=>{const s=currentSound();if(!s)return;const willShow=soundPic.hidden;soundPic.hidden=!willShow;soundPicBtn.textContent=willShow?'Cacher l’image':'Voir l’image';if(willShow){soundMastery.disabled=true;speakFrench(s.word)}};
 soundPic.onclick=()=>{const s=currentSound();if(s)speakFrench(s.word)};
 word.onclick=()=>{const w=currentWord();if(w){usedHint=true;wordMastery.disabled=true;speakFrench(w.word)}};
 wordPicBtn.onclick=()=>{const w=currentWord();if(!w)return;usedHint=true;wordMastery.disabled=true;const willShow=wordPic.hidden;wordPic.hidden=!willShow;wordPicBtn.textContent=willShow?'Cacher l’image':'Voir l’image';if(willShow)speakFrench(w.word)};
 wordPic.onclick=()=>{const w=currentWord();if(w){usedHint=true;wordMastery.disabled=true;speakFrench(w.word)}};
});