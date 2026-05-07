const landing = document.getElementById("landing");
const invitationPage = document.getElementById("invitationPage");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("bg-music");
const floatingBtn = document.getElementById("floating-music-btn");

const footer = document.querySelector(".site-footer");

let isPlaying = false;

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

  if (!daysEl) return;

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

const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

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

    } catch (error) {
      console.log(error);
      rsvpStatus.textContent = "Sorry, RSVP failed. Please try again.";
      rsvpStatus.className = "rsvp-status error";
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit RSVP`;
  });
}

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
