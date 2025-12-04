document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;

  // Simulación simple de validación
  if (email) {
    // 1. Guardar "sesión" en localStorage
    // Guardamos el nombre de usuario (simulado) para usarlo en la app
    const userData = {
      name: "Juan Doe",
      email: email,
      plan: "Gratuito",
    };

    localStorage.setItem("skinCheckSession", JSON.stringify(userData));

    // 2. Redirigir a la Web App
    window.location.href = "webapp.html";
  }
});
