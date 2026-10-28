// dynamique.js : à placer à côté de index.html
// Ajoute : bouton Français/العربية, lien de menu actif, section Actualités lue depuis Firestore.
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const app = getApps()[0] || initializeApp({
  apiKey: "AIzaSyAOnjke9ttytVJyRNW8nWJkvnBSPVw2AjY",
  authDomain: "athapsc-74302.firebaseapp.com",
  projectId: "athapsc-74302",
  storageBucket: "athapsc-74302.firebasestorage.app",
  messagingSenderId: "887875788297",
  appId: "1:887875788297:web:a9742ef1ce1c5ed3c822d8",
  measurementId: "G-2L0JB59FS2"
});
const db = getFirestore(app);

// 1. Section Actualités + lien dans le menu (créés ici, rien à ajouter dans le HTML)
const style = document.createElement('style');
style.textContent = `.news-date{font-size:.85rem;color:#5b7480;margin-bottom:.3rem}
#newsEmpty{color:#5b7480;font-style:italic;margin-top:1rem}
[dir="rtl"] .nav a,[dir="rtl"] .card{text-align:right}`;
document.head.appendChild(style);

const sec = document.createElement('section');
sec.id = 'actualites'; sec.className = 'section';
sec.innerHTML = `<div class="wrap">
  <h2 data-ar="آخر الأخبار">Actualités</h2>
  <div class="grid two" id="newsList"></div>
  <p id="newsEmpty" data-ar="لا توجد أخبار حاليا.">Aucune actualité pour le moment.</p>
</div>`;
document.getElementById('projets').after(sec);

const nav = document.getElementById('nav');
const navLink = document.createElement('a');
navLink.href = '#actualites'; navLink.textContent = 'Actualités'; navLink.dataset.ar = 'الأخبار';
nav.querySelector('a[href="#adhesion"]').before(navLink);

// 2. Langue français / arabe
const langBtn = document.getElementById('langBtn');
const menuBtn = document.getElementById('menuBtn');
const items = document.querySelectorAll('[data-ar]');
items.forEach(el => { el.dataset.fr = el.textContent; });

function setLang(lang) {
  const ar = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = ar ? 'rtl' : 'ltr';
  items.forEach(el => { el.textContent = ar ? el.dataset.ar : el.dataset.fr; });
  langBtn.textContent = ar ? 'Français' : 'العربية';
  try { localStorage.setItem('lang', lang); } catch (e) {}
}
langBtn.addEventListener('click', () => setLang(document.documentElement.lang === 'ar' ? 'fr' : 'ar'));
try { if (localStorage.getItem('lang') === 'ar') setLang('ar'); } catch (e) {}

// 3. Menu : fermeture après un clic, lien actif selon la section visible
const links = nav.querySelectorAll('a');
links.forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));
document.querySelectorAll('main section[id]').forEach(s => {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
    }
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
});

// 4. Actualités lues dans Firestore (collection "actualites")
(async () => {
  const list = document.getElementById('newsList');
  try {
    const snap = await getDocs(query(collection(db, 'actualites'), orderBy('date', 'desc'), limit(6)));
    snap.forEach(d => {
      const n = d.data();
      if (n.publie === false) return;
      const card = document.createElement('article'); card.className = 'card orange';
      const when = document.createElement('p'); when.className = 'news-date';
      if (n.date && n.date.toDate) {
        when.textContent = n.date.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      const h = document.createElement('h3'); h.textContent = n.titre || '';
      const t = document.createElement('p'); t.textContent = n.texte || '';
      card.append(when, h, t);
      list.appendChild(card);
    });
    if (list.children.length) document.getElementById('newsEmpty').style.display = 'none';
  } catch (err) { console.error('Actualités :', err); }
})();
