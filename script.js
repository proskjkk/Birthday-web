const landing = document.getElementById("landing");
const invitationPage = document.getElementById("invitationPage");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("bg-music");
const floatingBtn = document.getElementById("floating-music-btn");

const footer = document.querySelector(".site-footer");

let isPlaying = false;

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-WWu5iO4dNgKX0lC76eJzkqvla6e8n0gGz7O5VJHRW-yjPYbF7iTi1-oT9P_qh5ZHrg/exec";

/* ================= OPEN INVITATION ================= */

openInvitation.addEventListener("click", async () => {
  landing.classList.add("fade-out");

  setTimeout(() => {
    landing.style.display = "none";
    invitationPage.classList.remove("hidden");
    invitationPage.classList.add("opening-main");
    window.scrollTo(0, 0);
  }, 850);

  setTimeout(() => {
    invitationPage.classList.remove("opening-main");
  }, 3300);

  try {
    music.volume = 0.7;
    await music.play();
    isPlaying = true;
    floatingBtn.classList.add("active");
  } catch (err) {
    console.log(err);
  }
});

/* ================= MUSIC ================= */

floatingBtn.addEventListener("click", async () => {
  if (isPlaying) {
    music.pause();
    floatingBtn.classList.remove("active");
  } else {
    await music.play();
    floatingBtn.classList.add("active");
  }

  isPlaying = !isPlaying;
});

/* ================= COUNTDOWN ================= */

const eventDate = new Date("2026-06-06T17:30:00+07:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  if (distance <= 0) {
    daysEl.textContent = "0";
    hoursEl.textContent = "0";
    minutesEl.textContent = "0";
    secondsEl.textContent = "0";
    return;
  }

  daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  hoursEl.textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
  minutesEl.textContent = Math.floor((distance / (1000 * 60)) % 60);
  secondsEl.textContent = Math.floor((distance / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ================= SCROLL ANIMATION ================= */

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach(el => observer.observe(el));

/* ================= RSVP TO GOOGLE SHEETS ================= */

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = rsvpForm.querySelector(".rsvp-btn");

    const rsvpData = {
      name: document.getElementById("guestName").value.trim(),
      attendance: document.getElementById("attendance").value,
      guestCount: document.getElementById("guestCount").value || "-",
      message: document.getElementById("message").value.trim() || "-"
    };

    if (!rsvpData.name || !rsvpData.attendance) {
      rsvpStatus.textContent = "Please fill in your name and attendance confirmation.";
      rsvpStatus.className = "rsvp-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    rsvpStatus.textContent = "";
    rsvpStatus.className = "rsvp-status";

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(rsvpData)
      });

      rsvpStatus.textContent = "Thank you! Your RSVP has been submitted.";
      rsvpStatus.className = "rsvp-status success";

      rsvpForm.reset();

      setTimeout(() => {
        loadGuestMessages();
      }, 1200);

    } catch (error) {
      console.log(error);
      rsvpStatus.textContent = "Sorry, RSVP failed. Please try again.";
      rsvpStatus.className = "rsvp-status error";
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit RSVP`;
  });
}

/* ================= SHOW GUEST MESSAGES ================= */

const guestMessagesContainer = document.getElementById("guestMessages");

async function loadGuestMessages() {
  if (!guestMessagesContainer) return;

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const messages = await response.json();

    guestMessagesContainer.innerHTML = "";

    if (!messages.length) {
      guestMessagesContainer.innerHTML = `
        <p class="loading-message">No messages yet.</p>
      `;
      return;
    }

    messages.forEach(item => {
      const card = document.createElement("article");
      card.className = "guest-message-card";

      card.innerHTML = `
        <p class="guest-message-text">“${escapeHTML(item.message)}”</p>
        <h3>${escapeHTML(item.name)}</h3>
        <span>${escapeHTML(item.attendance)}</span>
      `;

      guestMessagesContainer.appendChild(card);
    });

  } catch (error) {
    console.log(error);
    guestMessagesContainer.innerHTML = `
      <p class="loading-message">Unable to load messages.</p>
    `;
  }
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadGuestMessages();

/* ================= GALLERY ZOOM MODAL ================= */

const galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
const galleryModal = document.getElementById("galleryModal");
const galleryModalImg = document.getElementById("galleryModalImg");
const galleryClose = document.getElementById("galleryClose");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryCounter = document.getElementById("galleryCounter");

let currentGalleryIndex = 0;

function openGallery(index) {
  if (!galleryModal || !galleryModalImg || !galleryImages.length) return;

  currentGalleryIndex = index;
  updateGalleryModal();

  galleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  if (!galleryModal) return;

  galleryModal.classList.remove("active");
  document.body.style.overflow = "";
}

function updateGalleryModal() {
  const currentImage = galleryImages[currentGalleryIndex];

  if (!currentImage || !galleryModalImg || !galleryCounter) return;

  galleryModalImg.src = currentImage.src;
  galleryModalImg.alt = currentImage.alt;

  galleryCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
}

function showPrevGalleryImage() {
  if (!galleryImages.length) return;

  currentGalleryIndex =
    currentGalleryIndex === 0
      ? galleryImages.length - 1
      : currentGalleryIndex - 1;

  updateGalleryModal();
}

function showNextGalleryImage() {
  if (!galleryImages.length) return;

  currentGalleryIndex =
    currentGalleryIndex === galleryImages.length - 1
      ? 0
      : currentGalleryIndex + 1;

  updateGalleryModal();
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    openGallery(index);
  });
});

if (galleryClose) {
  galleryClose.addEventListener("click", closeGallery);
}

if (galleryPrev) {
  galleryPrev.addEventListener("click", showPrevGalleryImage);
}

if (galleryNext) {
  galleryNext.addEventListener("click", showNextGalleryImage);
}

if (galleryModal) {
  galleryModal.addEventListener("click", e => {
    if (e.target === galleryModal) {
      closeGallery();
    }
  });
}

document.addEventListener("keydown", e => {
  if (!galleryModal || !galleryModal.classList.contains("active")) return;

  if (e.key === "Escape") {
    closeGallery();
  }

  if (e.key === "ArrowLeft") {
    showPrevGalleryImage();
  }

  if (e.key === "ArrowRight") {
    showNextGalleryImage();
  }
});

/* ================= FOOTER FIX ================= */

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const pageHeight = document.body.scrollHeight;
  const windowHeight = window.innerHeight;

  if (scrollY + windowHeight > pageHeight - 150) {
    footer.classList.add("show-footer");
  } else {
    footer.classList.remove("show-footer");
  }
});

/* ================= PAUSE MUSIC WHEN TAB CLOSED / MINIMIZED ================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    music.pause();
    floatingBtn.classList.remove("active");
    isPlaying = false;
  }
});

window.addEventListener("pagehide", () => {
  music.pause();
  floatingBtn.classList.remove("active");
  isPlaying = false;
});

window.addEventListener("blur", () => {
  music.pause();
  floatingBtn.classList.remove("active");
  isPlaying = false;
});
