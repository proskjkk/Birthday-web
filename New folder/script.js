const landing = document.getElementById("landing");
const invitationPage = document.getElementById("invitationPage");
const openInvitation = document.getElementById("openInvitation");

const music = document.getElementById("bg-music");
const floatingBtn = document.getElementById("floating-music-btn");

let isPlaying = false;

// OPEN INVITATION
openInvitation.addEventListener("click", async () => {
  landing.classList.add("fade-out");

  setTimeout(() => {
    landing.style.display = "none";
    invitationPage.classList.remove("hidden");
    window.scrollTo(0, 0);
  }, 800);

  try {
    await music.play();
    isPlaying = true;
    floatingBtn.classList.add("active"); // animation ON
  } catch (err) {
    console.log(err);
  }
});

// TOGGLE MUSIC
floatingBtn.addEventListener("click", async () => {
  if (isPlaying) {
    music.pause();
    floatingBtn.classList.remove("active"); // animation OFF
  } else {
    await music.play();
    floatingBtn.classList.add("active"); // animation ON
  }

  isPlaying = !isPlaying;
});

// SCROLL REVEAL
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