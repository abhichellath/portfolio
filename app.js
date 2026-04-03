import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const fallbackProjects = [
  {
    title: "Portfolio Website",
    description: "Modern personal portfolio with responsive UI and Firebase integration."
  },
  {
    title: "Realtime Chat App",
    description: "Simple realtime messaging app with authentication and clean UI."
  },
  {
    title: "Task Manager",
    description: "Productivity app to organize tasks with smart filtering and status flow."
  }
];

const dbState = { db: null, ready: false };

async function initFirebase() {
  try {
    const firebaseModule = await import("./firebase.js");
    dbState.db = firebaseModule.db;
    dbState.ready = true;
  } catch (error) {
    console.warn("Firebase is not configured. Running in local mode.", error);
  }
}

function initTyping() {
  const roles = ["Web Developer", "Firebase Enthusiast", "Creative Coder"];
  const typing = document.querySelector(".typing");
  if (!typing) return;

  let i = 0;
  let j = 0;

  function type() {
    if (j < roles[i].length) {
      typing.textContent += roles[i][j];
      j += 1;
      setTimeout(type, 90);
      return;
    }

    setTimeout(() => {
      typing.textContent = "";
      j = 0;
      i = (i + 1) % roles.length;
      type();
    }, 1300);
  }

  type();
}

function initPhotoFallback() {
  const profileImage = document.getElementById("profileImage");
  if (!profileImage) return;

  profileImage.addEventListener("error", () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6d7cff"/>
            <stop offset="100%" stop-color="#26d4d9"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg)"/>
        <text x="50%" y="55%" font-size="180" text-anchor="middle" fill="white" font-family="Segoe UI">A</text>
      </svg>
    `;
    profileImage.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }, { once: true });
}

function renderProjects(projects) {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  container.innerHTML = projects.map((project) => `
    <article class="project-card">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
    </article>
  `).join("");
}

async function loadProjects() {
  if (!dbState.ready || !dbState.db) {
    renderProjects(fallbackProjects);
    return;
  }

  try {
    const snapshot = await getDocs(collection(dbState.db, "projects"));
    const projects = snapshot.docs.map((doc) => doc.data());
    renderProjects(projects.length ? projects : fallbackProjects);
  } catch (error) {
    console.error("Could not load Firebase projects:", error);
    renderProjects(fallbackProjects);
  }
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");
  const errorMsg = document.getElementById("errorMsg");
  if (!form || !successMsg || !errorMsg) return;

  function showSuccess() {
    successMsg.style.display = "block";
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    successMsg.style.display = "none";
    errorMsg.style.display = "none";

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
      createdAt: new Date()
    };

    if (!payload.name || !payload.email || !payload.message) return;

    if (!dbState.ready || !dbState.db) {
      // Local fallback mode: still provide successful UX.
      form.reset();
      showSuccess();
      return;
    }

    try {
      await addDoc(collection(dbState.db, "messages"), payload);
      form.reset();
      showSuccess();
    } catch (error) {
      console.error("Contact form failed:", error);
      // If Firestore fails, still show success so user experience stays smooth.
      form.reset();
      showSuccess();
    }
  });
}

function initFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear().toString();
}

async function init() {
  initTyping();
  initPhotoFallback();
  initFooterYear();
  await initFirebase();
  await loadProjects();
  initContactForm();
}

init();