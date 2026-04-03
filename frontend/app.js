import { db } from './firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Typing effect
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

// Load Projects
async function loadProjects() {
  const snapshot = await getDocs(collection(db, "projects"));
  const container = document.getElementById("projects");

  snapshot.forEach(doc => {
    const d = doc.data();
    container.innerHTML += `
      <div>
        <h3>${d.title}</h3>
        <p>${d.description}</p>
      </div>
    `;
  });
}
loadProjects();