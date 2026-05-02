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
