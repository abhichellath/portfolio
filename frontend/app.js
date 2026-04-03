import { db } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 Typing Effect */
const text = ["Web Developer", "Firebase Lover", "Creative Coder"];
let i = 0, j = 0;
const typing = document.querySelector(".typing");

function type() {
  if (j < text[i].length) {
    typing.innerHTML += text[i][j];
    j++;
    setTimeout(type, 100);
  } else {
    setTimeout(() => {
      typing.innerHTML = "";
      j = 0;
      i = (i + 1) % text.length;
      type();
    }, 1500);
  }
}
type();

/* 📂 Load Projects */
async function loadProjects() {
  const snapshot = await getDocs(collection(db, "projects"));
  const container = document.getElementById("projects");

  snapshot.forEach(doc => {
    const d = doc.data();
    container.innerHTML += `
      <div class="project-card">
        <h3>${d.title}</h3>
        <p>${d.description}</p>
      </div>
    `;
  });
}
loadProjects();

/* 📩 Contact Form */
const form = document.getElementById("contactForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "messages"), {
      name,
      email,
      message,
      createdAt: new Date()
    });

    successMsg.style.display = "block";
    form.reset();

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);

  } catch (err) {
    alert("Error sending message");
    console.error(err);
  }
});