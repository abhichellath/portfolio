const text = ["Web Developer", "Firebase Lover", "Creative Coder"];
let i = 0;
let j = 0;

const firebaseState = {
  db: null,
  collection: null,
  getDocs: null,
  addDoc: null,
  ready: false
};

async function initFirebase() {
  if (firebaseState.ready) return true;
  try {
    const firestore = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const firebaseModule = await import("./firebase.js");
    const cfg = firebaseModule.firebaseConfig || {};
    const hasRealConfig =
      Boolean(cfg.apiKey) &&
      Boolean(cfg.projectId) &&
      !String(cfg.authDomain || "").includes("your-project") &&
      !String(cfg.projectId || "").includes("your-project");

    if (!hasRealConfig || !firebaseModule.db) {
      console.error("Firebase config is placeholder/invalid.");
      return false;
    }

    firebaseState.db = firebaseModule.db;
    firebaseState.collection = firestore.collection;
    firebaseState.getDocs = firestore.getDocs;
    firebaseState.addDoc = firestore.addDoc;
    firebaseState.ready = true;
    return true;
  } catch (error) {
    console.error("Firebase init failed:", error);
    return false;
  }
}

function type() {
  const typing = document.querySelector(".typing");
  if (!typing) return;

  if (j < text[i].length) {
    typing.textContent += text[i][j];
    j += 1;
    setTimeout(type, 100);
  } else {
    setTimeout(() => {
      typing.textContent = "";
      j = 0;
      i = (i + 1) % text.length;
      type();
    }, 1500);
  }
}

async function loadProjects() {
  const container = document.getElementById("projects");
  if (!container) return;

  const ok = await initFirebase();
  if (!ok) return;

  try {
    const snapshot = await firebaseState.getDocs(
      firebaseState.collection(firebaseState.db, "projects")
    );

    snapshot.forEach((doc) => {
      const d = doc.data();
      container.innerHTML += `
        <div class="project-card">
          <h3>${d.title || "Untitled"}</h3>
          <p>${d.description || ""}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Projects load failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  type();
  loadProjects();

  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");
  const btn = form ? form.querySelector("button") : null;
  if (!form || !successMsg || !btn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) return;

    btn.innerText = "Sending...";
    btn.disabled = true;

    const ok = await initFirebase();
    if (!ok) {
      successMsg.textContent = "Firebase config invalid. Update firebase.js with your real project keys.";
      successMsg.style.color = "#ff8f8f";
      successMsg.style.display = "block";
      btn.innerText = "Send Message";
      btn.disabled = false;
      return;
    }

    try {
      await firebaseState.addDoc(firebaseState.collection(firebaseState.db, "messages"), {
        name,
        email,
        message,
        createdAt: new Date()
      });

      successMsg.textContent = "Message sent successfully!";
      successMsg.style.color = "lightgreen";
      successMsg.style.display = "block";
      form.reset();
    } catch (err) {
      console.error("Message save failed:", err);
      successMsg.textContent = "Save failed. Check Firestore rules.";
      successMsg.style.color = "#ff8f8f";
      successMsg.style.display = "block";
    } finally {
      btn.innerText = "Send Message";
      btn.disabled = false;
      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);
    }
  });
});