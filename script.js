/* ============ À COMPLÉTER PAR L'ASSOCIATION ============ */
const CONFIG = {
  // Numéro WhatsApp en format international, chiffres seulement (ex. indicatif 235 + numéro). Laisser vide tant que non fourni.
  whatsapp: "23591427908"
};

// Ajoutez vos vrais éléments ici. Tant que les listes sont vides, un message "à venir" s'affiche.
// Projet : { titre: "...", description: "...", statut: "En cours / Prévu / Terminé" }
const PROJETS = [];
// Actualité : { titre: "...", date: "JJ/MM/AAAA", texte: "..." }
const ACTUALITES = [];
// Partenaire : { nom: "...", description: "..." }
const PARTENAIRES = [];
// Photo : { src: "images/photo1.jpg", legende: "..." }  (placez les images dans un dossier "images")
const PHOTOS = [];
/* ======================================================= */

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function render(id, items, makeCard, fr, ar) {
  $(id).innerHTML = items.length
    ? items.map(makeCard).join("")
    : `<p class="empty todo" data-ar="${ar}">${fr}</p>`;
}

render("projectsList", PROJETS,
  (p) => `<article class="card green"><h3>${esc(p.titre)}</h3><p>${esc(p.description)}</p><p><strong>${esc(p.statut || "")}</strong></p></article>`,
  "[À COMPLÉTER] Les projets de l’association seront présentés ici dès qu’ils seront confirmés.",
  "[يُستكمل] ستُعرض مشاريع الجمعية هنا فور تأكيدها.");

render("newsList", ACTUALITES,
  (a) => `<article class="card blue"><h3>${esc(a.titre)}</h3><p class="small">${esc(a.date || "")}</p><p>${esc(a.texte)}</p></article>`,
  "[À COMPLÉTER] Aucune actualité publiée pour le moment.",
  "[يُستكمل] لا توجد أخبار منشورة حاليًا.");

render("partnersList", PARTENAIRES,
  (p) => `<article class="card"><h3>${esc(p.nom)}</h3><p>${esc(p.description || "")}</p></article>`,
  "[À COMPLÉTER] Aucun partenaire à afficher pour le moment.",
  "[يُستكمل] لا يوجد شركاء للعرض حاليًا.");

$("galleryList").innerHTML = PHOTOS.length
  ? PHOTOS.map((p) => `<figure><img src="${esc(p.src)}" alt="${esc(p.legende || "Photo de l’association")}" loading="lazy"><figcaption>${esc(p.legende || "")}</figcaption></figure>`).join("")
  : [1, 2, 3, 4, 5, 6].map(() => `<div class="ph" data-ar="صورة ستُضاف">Photo à ajouter</div>`).join("");

// Menu mobile
const menuBtn = $("menuBtn"), nav = $("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
});

// Langue : français <-> arabe (le texte français d'origine est conservé dans data-fr)
let lang = "fr";
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-ar]").forEach((el) => {
    if (!el.dataset.fr) el.dataset.fr = el.textContent;
    el.textContent = l === "ar" ? el.dataset.ar : el.dataset.fr;
  });
  const b = $("langBtn");
  b.textContent = l === "ar" ? "Français" : "العربية";
  b.lang = l === "ar" ? "fr" : "ar";
  try { localStorage.setItem("lang", l); } catch (e) {}
}
$("langBtn").addEventListener("click", () => setLang(lang === "fr" ? "ar" : "fr"));

// WhatsApp
const configured = CONFIG.whatsapp.replace(/\D/g, "").length > 5;
$("waWarn").hidden = configured;
$("waSend").addEventListener("click", () => {
  if (!configured) { $("waWarn").hidden = false; return; }
  const nom = $("nom").value.trim(), msg = $("msg").value.trim();
  const text = lang === "ar"
    ? `مرحبًا ATHAPSC، ${nom ? "أنا " + nom + ". " : ""}${msg || "أودّ الحصول على معلومات."}`
    : `Bonjour ATHAPSC, ${nom ? "je suis " + nom + ". " : ""}${msg || "J’aimerais avoir des informations."}`;
  window.open("https://wa.me/" + CONFIG.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(text), "_blank", "noopener");
});

$("year").textContent = new Date().getFullYear();
try { if (localStorage.getItem("lang") === "ar") setLang("ar"); } catch (e) {}
