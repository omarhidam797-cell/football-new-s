// Ce fichier est partagé par index.html et conseils.html.
// Chaque bloc vérifie que ses éléments existent avant de s'exécuter.

// ===== 1. Thème clair / sombre (mémorisé) =====
const themeBtn = document.getElementById("theme-toggle");

function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    if (themeBtn) {
        themeBtn.textContent = dark ? "☀️ Mode clair" : "🌙 Mode sombre";
    }
}

let savedDark = false;
try { savedDark = localStorage.getItem("dark") === "1"; } catch (e) {}
applyTheme(savedDark);

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const dark = !document.body.classList.contains("dark");
        applyTheme(dark);
        try { localStorage.setItem("dark", dark ? "1" : "0"); } catch (e) {}
    });
}

// ===== 2. Galerie d'images avec défilement et miniatures =====
const galleryImg = document.getElementById("gallery-img");

if (galleryImg) {
    const images = [
        { src: "images/image1.svg", alt: "Un livre ouvert posé sur une table", caption: "Un livre ouvert, le début d'une pause calme." },
        { src: "images/image2.svg", alt: "Une pile de livres colorés avec une lampe", caption: "Une pile de livres : de quoi tenir tout le trimestre." },
        { src: "images/image3.svg", alt: "Un lycéen qui lit assis sous un arbre", caption: "Lire dehors, c'est aussi se reposer des écrans." }
    ];
    let current = 0;

    const galleryCaption = document.getElementById("gallery-caption");
    const galleryCount = document.getElementById("gallery-count");
    const thumbs = document.querySelectorAll(".thumb");

    function showImage(index) {
        current = (index + images.length) % images.length;
        galleryImg.src = images[current].src;
        galleryImg.alt = images[current].alt;
        galleryCaption.textContent = images[current].caption;
        galleryCount.textContent = "Image " + (current + 1) + " / " + images.length;
        thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
    }

    document.getElementById("next").addEventListener("click", () => showImage(current + 1));
    document.getElementById("prev").addEventListener("click", () => showImage(current - 1));
    thumbs.forEach((t) => {
        t.addEventListener("click", () => showImage(Number(t.dataset.index)));
    });

    // Flèches du clavier (sauf quand on écrit dans un champ)
    document.addEventListener("keydown", (event) => {
        const tag = event.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (event.key === "ArrowRight") showImage(current + 1);
        if (event.key === "ArrowLeft") showImage(current - 1);
    });
}

// ===== 3. Compteur de pages =====
const counterValue = document.getElementById("counter-value");

if (counterValue) {
    let pages = 0;
    document.getElementById("counter-add").addEventListener("click", () => {
        pages += 10;
        counterValue.textContent = pages;
    });
    document.getElementById("counter-reset").addEventListener("click", () => {
        pages = 0;
        counterValue.textContent = pages;
    });
}

// ===== 4. Défi des 7 jours (mémorisé) =====
const dayBoxes = document.querySelectorAll(".day input");

if (dayBoxes.length > 0) {
    const bar = document.getElementById("progress-bar");
    const text = document.getElementById("progress-text");

    function updateProgress() {
        const done = Array.from(dayBoxes).filter((b) => b.checked).length;
        bar.style.width = (done / dayBoxes.length * 100) + "%";
        text.textContent = done + " / " + dayBoxes.length + " jours" +
            (done === dayBoxes.length ? " : bravo, défi réussi !" : "");
        try {
            localStorage.setItem("defi", JSON.stringify(Array.from(dayBoxes).map((b) => b.checked)));
        } catch (e) {}
    }

    try {
        const saved = JSON.parse(localStorage.getItem("defi") || "[]");
        dayBoxes.forEach((b, i) => { b.checked = saved[i] === true; });
    } catch (e) {}

    dayBoxes.forEach((b) => b.addEventListener("change", updateProgress));
    updateProgress();
}

// ===== 5. Affichage / masquage du contenu (accordéon) =====
document.querySelectorAll(".item-title").forEach((btn) => {
    btn.addEventListener("click", () => {
        const body = btn.nextElementSibling;
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        body.hidden = open;
    });
});

// ===== 6. Filtre par catégorie =====
const filterButtons = document.querySelectorAll(".filter");
const items = document.querySelectorAll(".item");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.filter;
        items.forEach((item) => {
            item.style.display = (cat === "tous" || item.dataset.cat === cat) ? "" : "none";
        });
    });
});

// ===== 7. Quiz avec vérification =====
const form = document.getElementById("quiz-form");

if (form) {
    const result = document.getElementById("quiz-result");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const prenom = document.getElementById("prenom").value.trim();
        const q1 = form.querySelector('input[name="q1"]:checked');
        const q2 = form.querySelector('input[name="q2"]:checked');

        result.className = "quiz-result";

        if (prenom === "" || !q1 || !q2) {
            result.textContent = "Merci de saisir votre prénom et de répondre aux deux questions.";
            result.classList.add("ko");
            return;
        }

        let score = 0;
        if (q1.value === "b") score++;
        if (q2.value === "a") score++;

        result.textContent = prenom + ", votre score : " + score + " / 2. " +
            (score === 2 ? "Bravo, vous êtes prêt à lire !" : "Relisez la section Pourquoi / Comment et réessayez.");
        result.classList.add(score === 2 ? "ok" : "ko");
    });
}

// ===== 8. Conseil au hasard (page conseils.html) =====
const tipBtn = document.getElementById("tip-btn");

if (tipBtn) {
    const tips = [
        "Lisez 20 minutes juste avant de dormir : c'est calme et ça devient vite un rituel.",
        "Gardez un marque-page sur votre bureau pour reprendre exactement là où vous vous êtes arrêté.",
        "Si un livre ne vous plaît pas après 50 pages, changez-en sans culpabiliser.",
        "Lisez à voix basse un passage difficile : on le comprend souvent mieux.",
        "Notez un mot nouveau par jour et utilisez-le à l'oral dans la journée.",
        "Proposez un livre à un ami et comparez vos avis une semaine plus tard."
    ];
    const tipText = document.getElementById("tip-text");
    let lastTip = -1;

    tipBtn.addEventListener("click", () => {
        let n;
        do { n = Math.floor(Math.random() * tips.length); } while (n === lastTip);
        lastTip = n;
        tipText.textContent = tips[n];
    });
}

// ===== 9. Bouton retour en haut =====
const topBtn = document.getElementById("top-btn");

if (topBtn) {
    window.addEventListener("scroll", () => {
        topBtn.hidden = window.scrollY < 400;
    });
    topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}