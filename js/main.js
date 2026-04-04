/* =============================================
   MAIN.JS — AfriTalent
   7 fonctionnalités JavaScript obligatoires
============================================= */

/* ------------------------------------------------------------------
   1. ANNÉE DYNAMIQUE dans le footer
------------------------------------------------------------------ */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ------------------------------------------------------------------
   2. DARK MODE — toggle + sauvegarde localStorage
------------------------------------------------------------------ */
const darkToggle = document.getElementById('darkModeToggle');
const darkIcon   = document.getElementById('darkModeIcon');

// Appliquer le thème sauvegardé au chargement
function appliquerTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  if (darkIcon) {
    darkIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  }
}

appliquerTheme(localStorage.getItem('darkMode') === 'true');

if (darkToggle) {
  darkToggle.addEventListener('click', function () {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    if (darkIcon) darkIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  });
}


/* ------------------------------------------------------------------
   3. NAVBAR — change de style au scroll
------------------------------------------------------------------ */
const navbar = document.getElementById('mainNavbar');

window.addEventListener('scroll', function () {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  // Afficher/masquer le bouton retour en haut
  const btn = document.getElementById('backToTop');
  if (btn) btn.style.display = window.scrollY > 300 ? 'block' : 'none';
});


/* ------------------------------------------------------------------
   4. BOUTON RETOUR EN HAUT — smooth scroll
------------------------------------------------------------------ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ------------------------------------------------------------------
   5. COMPTEURS ANIMÉS — IntersectionObserver
------------------------------------------------------------------ */
function animerCompteur(el) {
  const cible = parseInt(el.getAttribute('data-target'), 10);
  const duree  = 1500; // ms
  const debut  = performance.now();

  function etape(timestamp) {
    const progres = Math.min((timestamp - debut) / duree, 1);
    el.textContent = Math.floor(progres * cible).toLocaleString('fr-FR');
    if (progres < 1) requestAnimationFrame(etape);
    else el.textContent = cible.toLocaleString('fr-FR');
  }

  requestAnimationFrame(etape);
}

const obsCompteurs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animerCompteur(entry.target);
      obsCompteurs.unobserve(entry.target); // ne s'anime qu'une fois
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(function (el) {
  obsCompteurs.observe(el);
});


/* ------------------------------------------------------------------
   6. ANIMATIONS FADE-IN au scroll — IntersectionObserver
------------------------------------------------------------------ */
const obsFade = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obsFade.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(function (el) {
  obsFade.observe(el);
});


/* ------------------------------------------------------------------
   7. FILTRAGE DYNAMIQUE — page freelances.html
------------------------------------------------------------------ */
const boutonsFiltres = document.querySelectorAll('.btn-filtre');
const cartesFreelance = document.querySelectorAll('.freelance-item');

boutonsFiltres.forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Mettre à jour le bouton actif
    boutonsFiltres.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');

    const filtre = btn.getAttribute('data-filtre');

    // Afficher ou masquer les cartes
    cartesFreelance.forEach(function (carte) {
      if (filtre === 'tous' || carte.getAttribute('data-categorie') === filtre) {
        carte.classList.remove('hidden');
      } else {
        carte.classList.add('hidden');
      }
    });
  });
});


/* ------------------------------------------------------------------
   8. VALIDATION FORMULAIRE — page contact.html
------------------------------------------------------------------ */
const form = document.getElementById('contactForm');

function afficherErreur(champId, erreurId, message) {
  const champ  = document.getElementById(champId);
  const erreur = document.getElementById(erreurId);
  if (!champ || !erreur) return;
  erreur.textContent = message;
  champ.classList.add('erreur');
  champ.classList.remove('valide');
}

function afficherValide(champId, erreurId) {
  const champ  = document.getElementById(champId);
  const erreur = document.getElementById(erreurId);
  if (!champ || !erreur) return;
  erreur.textContent = '';
  champ.classList.remove('erreur');
  champ.classList.add('valide');
}

function validerFormulaire() {
  let valide = true;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Nom
  const nom = document.getElementById('nom');
  if (nom && nom.value.trim() === '') {
    afficherErreur('nom', 'nomError', 'Le nom est obligatoire.');
    valide = false;
  } else { afficherValide('nom', 'nomError'); }

  // Prénom
  const prenom = document.getElementById('prenom');
  if (prenom && prenom.value.trim() === '') {
    afficherErreur('prenom', 'prenomError', 'Le prénom est obligatoire.');
    valide = false;
  } else { afficherValide('prenom', 'prenomError'); }

  // Email
  const email = document.getElementById('email');
  if (email && !regexEmail.test(email.value.trim())) {
    afficherErreur('email', 'emailError', 'Veuillez entrer un email valide.');
    valide = false;
  } else { afficherValide('email', 'emailError'); }

  // Sujet
  const sujet = document.getElementById('sujet');
  if (sujet && sujet.value === '') {
    afficherErreur('sujet', 'sujetError', 'Veuillez choisir un sujet.');
    valide = false;
  } else { afficherValide('sujet', 'sujetError'); }

  // Message (20 caractères minimum)
  const message = document.getElementById('message');
  if (message && message.value.trim().length < 20) {
    afficherErreur('message', 'messageError', 'Le message doit contenir au moins 20 caractères.');
    valide = false;
  } else { afficherValide('message', 'messageError'); }

  return valide;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validerFormulaire()) {
      // Afficher le message de succès
      const success = document.getElementById('successMessage');
      if (success) success.style.display = 'block';
      form.reset();
      // Supprimer les classes de validation
      form.querySelectorAll('.valide').forEach(function (el) {
        el.classList.remove('valide');
      });
    }
  });
}
