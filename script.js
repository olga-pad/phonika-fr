const sounds=[
 {g:'A',word:'ami',emoji:'🧒',voice:'a',type:'vowel'},
 {g:'M',word:'moto',emoji:'🏍️',voice:'me',type:'consonant'},
 {g:'I',word:'image',emoji:'🖼️',voice:'i',type:'vowel'},
 {g:'P',word:'papi',emoji:'👴',voice:'pe',type:'consonant'},
 {g:'O',word:'olive',emoji:'🫒',voice:'o',type:'vowel'},
 {g:'V',word:'vélo',emoji:'🚲',voice:'ve',type:'consonant'},
 {g:'É',word:'épi',emoji:'🌾',voice:'é',type:'vowel'},
 {g:'L',word:'loto',emoji:'🎱',voice:'le',type:'consonant'},
 {g:'F',word:'fusée',emoji:'🚀',voice:'fe',type:'consonant'},
 {g:'R',word:'rat',emoji:'🐀',voice:'re',type:'consonant'}
];
const words=[
 {word:'ami',emoji:'🧒',parts:['a','m','i']},
 {word:'papi',emoji:'👴',parts:['p','a','p','i']},
 {word:'moto',emoji:'🏍️',parts:['m','o','t','o']},
 {word:'ému',emoji:'🥹',parts:['é','m','u']},
 {word:'ici',emoji:'👇',parts:['i','c','i']}
];
const vowels=new Set(['a','e','i','o','u','y','é','è','ê','à','â','ô','î','ï','ù','û']);
const state=JSON.parse(localStorage.getItem('phonikaFrProgress')||'{"known":{},"review":{},"soundKnown":{},"index":0}');
function save(){localStorage.setItem('phonikaFrProgress',JSON.stringify(state));}
function speak(text){if(!('speechSynthesis'in window))return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=.72; const voices=speechSynthesis.getVoices();const fr=voices.find(v=>v.lang&&v.lang.toLowerCase().startsWith('fr'));if(fr)u.voice=fr;speechSynthesis.speak(u);}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='sounds')renderSounds();if(id==='reading')renderWord();if(id==='parent')renderStats();}
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));document.getElementById('homeBtn').onclick=()=>show('home');document.getElementById('parentBtn').onclick=()=>show('parent');
function activeSounds(){let mastered=sounds.filter(s=>state.soundKnown[s.g]);let not=sounds.filter(s=>!state.soundKnown[s.g]);return [...mastered.slice(-4),...not].slice(0,5);}
function renderSounds(){const box=document.getElementById('soundCards');box.innerHTML='';activeSounds().forEach(s=>{const card=document.createElement('div');card.className='sound-card';card.innerHTML=`<button class="letter-btn ${s.type}" aria-label="Son ${s.g}">${s.g}</button><button class="image-btn" aria-label="${s.word}">${s.emoji}<small>${s.word}</small></button>`;card.querySelector('.letter-btn').onclick=()=>{speak(s.voice);state.soundKnown[s.g]=(state.soundKnown[s.g]||0)+1>=3;save();};card.querySelector('.image-btn').onclick=()=>speak(s.word);box.appendChild(card);});}
function coloredWord(w){return [...w].map(c=>`<span class="${vowels.has(c.toLowerCase())?'vowel':'consonant'}">${c.toUpperCase()}</span>`).join('');}
function current(){return words[state.index%words.length];}
function renderWord(){const w=current();document.getElementById('word').innerHTML=coloredWord(w.word);document.getElementById('pictureEmoji').textContent=w.emoji;document.getElementById('helpLine').textContent='';let done=Object.keys(state.known).length;document.getElementById('progressBar').style.width=`${Math.min(100,done/words.length*100)}%`;}
document.getElementById('pictureBtn').onclick=()=>speak(current().word);
document.getElementById('helpBtn').onclick=()=>{const w=current();const line=document.getElementById('helpLine');line.textContent='';let i=0;const timer=setInterval(()=>{if(i>=w.parts.length){clearInterval(timer);setTimeout(()=>speak(w.word),350);return;}line.textContent+=(i?'  ':'')+w.parts[i].toUpperCase();speak(w.parts[i]);i++;},850);};
document.getElementById('knownBtn').onclick=()=>{state.known[current().word]=(state.known[current().word]||0)+1;delete state.review[current().word];save();next();};document.getElementById('againBtn').onclick=()=>{state.review[current().word]=(state.review[current().word]||0)+1;save();next();};document.getElementById('nextBtn').onclick=next;
function next(){let candidates=words.map((w,i)=>({w,i,score:(state.review[w.word]||0)*4-(state.known[w.word]||0)*2})).filter(x=>x.i!==state.index%words.length);candidates.sort((a,b)=>b.score-a.score||Math.random()-.5);state.index=candidates.length?candidates[0].i:(state.index+1)%words.length;save();renderWord();}
function renderStats(){const known=Object.keys(state.known).length;const review=Object.keys(state.review).length;const masteredSounds=Object.keys(state.soundKnown).filter(k=>state.soundKnown[k]).length;document.getElementById('parentStats').innerHTML=`<strong>Niveau 1</strong><br>Sons maîtrisés : ${masteredSounds} / ${sounds.length}<br>Mots déjà lus : ${known} / ${words.length}<br>Mots à revoir : ${review}<br><br><small>Les mots difficiles reviennent plus souvent.</small>`;}
document.getElementById('resetBtn').onclick=()=>{if(confirm('Réinitialiser toute la progression ?')){localStorage.removeItem('phonikaFrProgress');location.reload();}};
renderSounds();