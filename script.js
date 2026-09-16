const sounds=[
 {g:'A',word:'avion',emoji:'✈️',type:'vowel'}, {g:'M',word:'maman',emoji:'👩',type:'consonant'}, {g:'I',word:'image',emoji:'🖼️',type:'vowel'}, {g:'P',word:'papa',emoji:'👨',type:'consonant'}, {g:'O',word:'olive',emoji:'🫒',type:'vowel'},
 {g:'L',word:'lune',emoji:'🌙',type:'consonant'}, {g:'V',word:'vélo',emoji:'🚲',type:'consonant'}, {g:'É',word:'épi',emoji:'🌾',type:'vowel'}, {g:'F',word:'fusée',emoji:'🚀',type:'consonant'}, {g:'R',word:'rat',emoji:'🐀',type:'consonant'}
];
const words=[
 {word:'ami',emoji:'🧒',need:['A','M','I']},
 {word:'papi',emoji:'👴',need:['P','A','I']},
 {word:'papa',emoji:'👨',need:['P','A']},
 {word:'mami',emoji:'👵',need:['M','A','I']},
 {word:'poli',emoji:'🙂',need:['P','O','L','I']},
 {word:'vélo',emoji:'🚲',need:['V','É','L','O']}
];
const KEY='phonika-fr-v2';
let state=JSON.parse(localStorage.getItem(KEY)||'{"sounds":{},"words":{},"soundQueue":[],"wordQueue":[]}');
const $=id=>document.getElementById(id);const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
function speakFrench(text){if(!text||!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.78;const voices=window.speechSynthesis.getVoices();const fr=voices.find(v=>(v.lang||'').toLowerCase().startsWith('fr'));if(fr)u.voice=fr;window.speechSynthesis.speak(u)}
function sp(g){if(!state.sounds[g])state.sounds[g]={self:0,mastered:false};return state.sounds[g]}
function wp(w){if(!state.words[w])state.words[w]={self:0,mastered:false};return state.words[w]}
function soundQueue(){let q=state.soundQueue.filter(g=>sounds.some(s=>s.g===g)&&!sp(g).mastered);for(const s of sounds){if(q.length>=5)break;if(!sp(s.g).mastered&&!q.includes(s.g))q.push(s.g)}state.soundQueue=q.slice(0,5);save();return state.soundQueue}
function availableWords(){return words.filter(w=>w.need.every(g=>sp(g).mastered))}
function wordQueue(){let available=availableWords(),q=state.wordQueue.filter(w=>available.some(x=>x.word===w)&&!wp(w).mastered);for(const w of available){if(q.length>=5)break;if(!wp(w.word).mastered&&!q.includes(w.word))q.push(w.word)}state.wordQueue=q.slice(0,5);save();return state.wordQueue}
let section='words',wi=0,si=0,usedHint=false;
function colorText(text){return [...text].map(c=>`<span class="${'AEIOUYÉÈÊÀÂÔÎÏÙÛ'.includes(c.toUpperCase())?'vowel':'consonant'}">${c.toUpperCase()}</span>`).join('')}
function showSection(which){section=which;$('readingView').hidden=which!=='words';$('soundsView').hidden=which!=='sounds';$('readingTab').classList.toggle('on',which==='words');$('soundsTab').classList.toggle('on',which==='sounds');which==='words'?showWord():showSound()}
function currentWord(){const q=wordQueue();return words.find(w=>w.word===q[wi%Math.max(q.length,1)])}
function showWord(){const w=currentWord();usedHint=false;$('reward').textContent='';$('picture').hidden=true;$('pictureBtn').textContent='Voir l’image';$('readOk').disabled=false;$('readOk').classList.remove('done');$('readOk').textContent='✓ Je l’ai lu seul';if(!w){$('word').textContent='';$('readOk').hidden=true;$('helpBtn').hidden=true;$('pictureBtn').hidden=true;$('nextBtn').hidden=true;$('reward').textContent='Découvrons encore quelques sons';return}$('readOk').hidden=$('helpBtn').hidden=$('pictureBtn').hidden=$('nextBtn').hidden=false;$('word').innerHTML=colorText(w.word);$('picture').textContent=w.emoji}
function currentSound(){const q=soundQueue();return sounds.find(s=>s.g===q[si%Math.max(q.length,1)])}
function showSound(){const s=currentSound();if(!s){$('soundCard').textContent='Bravo !';return}$('soundCard').innerHTML=`<span class="${s.type}">${s.g}</span>`;$('soundPicture').textContent=s.emoji;$('soundPicture').hidden=true;$('soundPictureBtn').textContent="Voir l’image";$('soundKnown').disabled=false;$('soundKnown').classList.remove('done');$('soundKnown').textContent='✓ Je connais ce son'}
$('readingTab').onclick=()=>showSection('words');$('soundsTab').onclick=()=>showSection('sounds');
$('pictureBtn').onclick=()=>{if(!currentWord())return;usedHint=true;$('readOk').disabled=true;$('picture').hidden=!$('picture').hidden;$('pictureBtn').textContent=$('picture').hidden?'Voir l’image':'Cacher l’image'};
$('picture').onclick=()=>{const w=currentWord();if(w)speakFrench(w.word)};
$('helpBtn').onclick=()=>{if(!currentWord())return;usedHint=true;$('readOk').disabled=true;$('reward').textContent='Regarde les sons et assemble-les doucement.'};
$('readOk').onclick=()=>{const w=currentWord();if(!w||usedHint)return;const p=wp(w.word);p.self++;p.mastered=p.self>=3;$('readOk').disabled=true;$('readOk').classList.add('done');$('readOk').textContent='✓ Validé';state.wordQueue=state.wordQueue.filter(x=>x!==w.word||!p.mastered);save()};
$('nextBtn').onclick=()=>{wi++;showWord()};
$('soundPictureBtn').onclick=()=>{$('soundPicture').hidden=!$('soundPicture').hidden;$('soundPictureBtn').textContent=$('soundPicture').hidden?'Voir l’image':'Cacher l’image'};
$('soundPicture').onclick=()=>{const s=currentSound();if(s)speakFrench(s.word)};
$('soundKnown').onclick=()=>{const s=currentSound();if(!s)return;const p=sp(s.g);p.self++;p.mastered=p.self>=3;$('soundKnown').disabled=true;$('soundKnown').classList.add('done');$('soundKnown').textContent='✓ Validé';if(p.mastered)state.soundQueue=state.soundQueue.filter(g=>g!==s.g);save()};
$('soundNext').onclick=()=>{si++;showSound()};
$('parentBtn').onclick=()=>{$('childView').hidden=true;$('parentView').hidden=false;renderParent()};$('backBtn').onclick=()=>{$('parentView').hidden=true;$('childView').hidden=false;showSection(section)};
function renderParent(){$('soundStats').innerHTML=sounds.map(s=>`<div class="row"><span>${s.g} · ${s.word}</span><span>${sp(s.g).mastered?'Acquis':sp(s.g).self+'/3'}</span></div>`).join('');$('wordStats').innerHTML=words.map(w=>`<div class="row"><span>${w.word.toUpperCase()}</span><span>${wp(w.word).mastered?'Acquis':wp(w.word).self+'/3'}</span></div>`).join('')}
$('resetBtn').onclick=()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem(KEY);location.reload()}};
showSection('words');