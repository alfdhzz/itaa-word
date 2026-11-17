// A Little World of Itaa — interaksi ringan dan efek kelopak bunga.
document.addEventListener("DOMContentLoaded", () => {

  // ── Gift Box & Welcome Popup ──
  const giftBox      = document.getElementById("gift-box");
  const burstLayer   = document.getElementById("burst-layer");
  const rbxHint      = document.getElementById("rbx-hint");
  const welcomePopup = document.getElementById("welcome-popup");
  const closeWelcome = document.getElementById("close-welcome");
  const enterSite    = document.getElementById("enter-site");
  const bgMusic      = document.getElementById("bg-music");
  const toggleMusic  = document.getElementById("toggle-music");
  let musicPlaying   = false;
  let boxOpened      = false;

  const burstSymbols = ["✿","❀","✧","♡","✦","❁","✾","♫"];
  const burstColors  = ["#e9a8b8","#d4849a","#f5c6d2","#c27387","#f0a3b7","#b77f8d"];

  function fireBurst() {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "burst-petal";
      el.textContent = burstSymbols[Math.floor(Math.random() * burstSymbols.length)];
      el.style.color = burstColors[Math.floor(Math.random() * burstColors.length)];

      const angle  = (360 / count) * i + Math.random() * 20;
      const dist   = 90 + Math.random() * 110;
      const rad    = (angle * Math.PI) / 180;
      const tx     = Math.cos(rad) * dist + "px";
      const ty     = Math.sin(rad) * dist - 60 + "px";
      const rot    = (-180 + Math.random() * 360) + "deg";

      el.style.setProperty("--tx", tx);
      el.style.setProperty("--ty", ty);
      el.style.setProperty("--rot", rot);
      el.style.animationDelay = (Math.random() * 0.2) + "s";
      el.style.fontSize = (16 + Math.random() * 14) + "px";

      burstLayer.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  function openGiftBox() {
    if (boxOpened) return;
    boxOpened = true;
    giftBox.classList.add("opened");
    if (rbxHint) rbxHint.style.opacity = "0";

    // Fire burst flowers
    fireBurst();
    setTimeout(fireBurst, 250);

    // Open popup after animation
    setTimeout(() => {
      welcomePopup.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      bgMusic?.play().then(() => {
        musicPlaying = true;
        if (toggleMusic) toggleMusic.textContent = "⏸";
      }).catch(() => {});
    }, 700);
  }

  giftBox?.addEventListener("click", openGiftBox);
  giftBox?.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openGiftBox(); });

  function dismissPopup() {
    welcomePopup.classList.add("hidden");
    document.body.style.overflow = "";
    // Reset gift box
    setTimeout(() => {
      giftBox?.classList.remove("opened");
      boxOpened = false;
      if (rbxHint) rbxHint.style.opacity = "1";
    }, 400);
    if (bgMusic && musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      if (toggleMusic) toggleMusic.textContent = "▶";
    }
  }

  closeWelcome?.addEventListener("click", dismissPopup);
  enterSite?.addEventListener("click", dismissPopup);

  toggleMusic?.addEventListener("click", () => {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      toggleMusic.textContent = "▶";
    } else {
      bgMusic.play();
      musicPlaying = true;
      toggleMusic.textContent = "⏸";
    }
  });

  // Mobile navigation
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Reveal elements on scroll
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Gentle falling flower petals
  const petalLayer = document.getElementById("petal-layer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const symbols = ["✿", "❀", "✧"];
  function createPetal() {
    if (!petalLayer || reducedMotion || document.hidden) return;
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.fontSize = `${10 + Math.random() * 11}px`;
    petal.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    petal.style.animationDuration = `${8 + Math.random() * 8}s`;
    petalLayer.appendChild(petal);
    window.setTimeout(() => petal.remove(), 17000);
  }
  if (!reducedMotion) {
    for (let i = 0; i < 7; i++) window.setTimeout(createPetal, i * 450);
    window.setInterval(createPetal, 1050);
  }

  // Open and close the letter
  const openLetter = document.getElementById("open-letter");
  const letterMessage = document.getElementById("letter-message");
  openLetter?.addEventListener("click", () => {
    const isHidden = letterMessage.hidden;
    letterMessage.hidden = !isHidden;
    openLetter.innerHTML = isHidden
      ? 'Close your little note <span>×</span>'
      : 'Open your little note <span>♡</span>';
    if (isHidden) letterMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const closeLightbox = document.getElementById("close-lightbox");
  document.querySelectorAll(".gallery-card").forEach(card => {
    card.addEventListener("click", () => {
      lightboxImage.src = card.dataset.full;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  function hideLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  closeLightbox?.addEventListener("click", hideLightbox);
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) hideLightbox();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") hideLightbox();
  });
});
