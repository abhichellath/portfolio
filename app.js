import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("JS LOADED ✅");

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY ✅");

  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("successMsg");
  const btn = form.querySelector("button");

  if (!form) {
    console.error("FORM NOT FOUND ❌");
    return;
  }

  form.addEventListener("submit", async function(e) {

    e.preventDefault(); // 🔥 MAIN FIX
    e.stopPropagation(); // 🔥 EXTRA STRONG FIX

    console.log("FORM SUBMIT STOPPED ✅");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
      btn.innerText = "Sending...";
      btn.disabled = true;

      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: new Date()
      });

      console.log("DATA SENT ✅");

      successMsg.style.display = "block";
      form.reset();

      btn.innerText = "Send Message";
      btn.disabled = false;

      setTimeout(() => {
        successMsg.style.display = "none";
      }, 3000);

    } catch (err) {
      console.error("ERROR ❌", err);

      btn.innerText = "Send Message";
      btn.disabled = false;
    }
  });

});