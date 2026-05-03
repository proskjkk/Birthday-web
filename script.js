const landing = document.getElementById("landing");
const invitationPage = document.getElementById("invitationPage");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("bg-music");
const floatingBtn = document.getElementById("floating-music-btn");

let isPlaying = false;

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

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => observer.observe(el));
