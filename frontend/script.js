<<<<<<< HEAD
// script.js

// URL del endpoint de FastAPI para el chat
const API_URL = "http://127.0.0.1:8080/chat";

document.addEventListener("DOMContentLoaded", () => {
  // Toggle menú móvil
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  // Cerrar menú al hacer clic en enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });

  // Inicializar galería
  initGallery();

  // Validación formulario de contacto
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (validateContactForm()) {
      alert("¡Gracias por tu mensaje! Pronto te contactaremos.");
      contactForm.reset();
    }
  });

  // Manejo del chat
  const chatForm = document.getElementById("chat-form");
  const chatContainer = document.getElementById("chat-container");
  const userInput = document.getElementById("user-input");
  chatForm.addEventListener("submit", async e => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    addMessage(question, "user");
    userInput.value = "";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: question })
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      addMessage(data.respuesta, "bot");
    } catch (err) {
      console.error(err);
      addMessage("Hubo un error al procesar tu consulta. Intenta nuevamente.", "bot");
    }
  });

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    if (sender === 'bot' && text.includes('<div')) {
      msg.innerHTML = text;
    } else {
      msg.textContent = text;
    }
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function initGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item.src, item.alt));
    });
  }

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="${src}" alt="${alt}" />
        <span class="close-lightbox">&times;</span>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.close-lightbox').addEventListener('click', () => overlay.remove());
  }

  function validateContactForm() {
    const n = document.getElementById('nombre'),
          e = document.getElementById('email'),
          m = document.getElementById('mensaje');
    if (!n.value.trim()) { alert('Por favor, ingresa tu nombre.'); n.focus(); return false; }
    if (!e.value.trim()) { alert('Por favor, ingresa tu email.'); e.focus(); return false; }
    if (!m.value.trim()) { alert('El campo de mensaje no puede estar vacío.'); m.focus(); return false; }
    return true;
  }
});
=======
// script.js

// URL del endpoint de FastAPI para el chat
const API_URL = "http://127.0.0.1:8080/chat";

document.addEventListener("DOMContentLoaded", () => {
  // Toggle menú móvil
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  // Cerrar menú al hacer clic en enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('active'));
  });

  // Inicializar galería
  initGallery();

  // Validación formulario de contacto
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", e => {
    e.preventDefault();
    if (validateContactForm()) {
      alert("¡Gracias por tu mensaje! Pronto te contactaremos.");
      contactForm.reset();
    }
  });

  // Manejo del chat
  const chatForm = document.getElementById("chat-form");
  const chatContainer = document.getElementById("chat-container");
  const userInput = document.getElementById("user-input");
  chatForm.addEventListener("submit", async e => {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    addMessage(question, "user");
    userInput.value = "";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: question })
      });
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      addMessage(data.respuesta, "bot");
    } catch (err) {
      console.error(err);
      addMessage("Hubo un error al procesar tu consulta. Intenta nuevamente.", "bot");
    }
  });

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    if (sender === 'bot' && text.includes('<div')) {
      msg.innerHTML = text;
    } else {
      msg.textContent = text;
    }
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function initGallery() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(item.src, item.alt));
    });
  }

  function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="${src}" alt="${alt}" />
        <span class="close-lightbox">&times;</span>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector('.close-lightbox').addEventListener('click', () => overlay.remove());
  }

  function validateContactForm() {
    const n = document.getElementById('nombre'),
          e = document.getElementById('email'),
          m = document.getElementById('mensaje');
    if (!n.value.trim()) { alert('Por favor, ingresa tu nombre.'); n.focus(); return false; }
    if (!e.value.trim()) { alert('Por favor, ingresa tu email.'); e.focus(); return false; }
    if (!m.value.trim()) { alert('El campo de mensaje no puede estar vacío.'); m.focus(); return false; }
    return true;
  }
});
>>>>>>> e707900abc7e99db73049c63d590af7cb1a84006
