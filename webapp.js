/**
 * SkinCheck App Logic
 * Maneja la navegación SPA, el menú móvil y las simulaciones de funcionalidad.
 */

const app = {
  // Estado de la aplicación
  state: {
    currentView: "dashboard",
    isSidebarOpen: false,
    user: null, // Para guardar datos del usuario
  },

  // Inicialización
  init: function () {
    // 1. VERIFICACIÓN DE SESIÓN (NUEVO)
    this.checkSession();

    this.cacheDOM();
    this.bindEvents();

    // Cargar nombre de usuario si existe
    if (this.state.user && this.dom.userNameDisplay) {
      // Opcional: Actualizar el nombre en el banner de bienvenida
      const firstName = this.state.user.name.split(" ")[0];
      // Asegúrate de tener un elemento donde mostrarlo, por defecto el banner dice "Hola, Juan"
      // Puedes personalizarlo buscando el h1 dentro de .welcome-banner
      const bannerTitle = document.querySelector(".welcome-banner h1");
      if (bannerTitle) bannerTitle.innerText = `Hola, ${firstName}`;
    }

    // Asegurarse de que la vista inicial se muestre
    this.navigate(
      this.state.currentView,
      document.querySelector(
        `.nav-link[data-target="${this.state.currentView}"]`
      )
    );
  },

  // (NUEVO) Verificar si el usuario está logueado
  checkSession: function () {
    const session = localStorage.getItem("skinCheckSession");
    if (!session) {
      // Si no hay sesión, mandar al login
      window.location.href = "login.html";
    } else {
      this.state.user = JSON.parse(session);
    }
  },

  // Cachear elementos del DOM para mejor rendimiento
  cacheDOM: function () {
    this.dom = {
      sidebar: document.getElementById("sidebar"),
      hamburgerBtn: document.getElementById("hamburgerBtn"),
      navLinks: document.querySelectorAll(".nav-link"),
      views: document.querySelectorAll(".view-section"),

      // Elementos del Escáner
      scanArea: document.getElementById("scanArea"),
      fileInput: document.getElementById("fileInput"),
      imagePreview: document.getElementById("imagePreview"),
      scanPlaceholder: document.getElementById("scanPlaceholder"),
      scanLoader: document.getElementById("scanLoader"),
      scanResult: document.getElementById("scanResult"),
      analyzeBtn: document.getElementById("analyzeBtn"),
      riskLabel: document.getElementById("riskLabel"),
      riskDesc: document.getElementById("riskDesc"),

      // Botón Logout (NUEVO)
      logoutBtn: document.getElementById("logoutBtn"),
    };
  },

  // Asignar eventos
  bindEvents: function () {
    // Toggle Sidebar
    this.dom.hamburgerBtn.addEventListener("click", () => this.toggleSidebar());

    // Navegación
    this.dom.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-target");
        this.navigate(target, e.currentTarget);
      });
    });

    // Escáner - Click en área
    // Se adjunta listener al área principal para abrir el selector de archivos
    this.dom.scanArea.addEventListener("click", () => {
      if (this.dom.scanLoader.style.display !== "flex") {
        this.dom.fileInput.click();
      }
    });

    // Escáner - Cambio de archivo
    this.dom.fileInput.addEventListener("change", (e) =>
      this.handleFileSelect(e)
    );

    // Escáner - Botón Analizar
    this.dom.analyzeBtn.addEventListener("click", () => this.startAnalysis());

    // LOGOUT (NUEVO)
    if (this.dom.logoutBtn) {
      this.dom.logoutBtn.addEventListener("click", () => this.logout());
    }
  },

  // (NUEVO) Función de Cerrar Sesión
  logout: function () {
    // Borrar datos de sesión
    localStorage.removeItem("skinCheckSession");
    // Redirigir al login
    window.location.href = "login.html";
  },

  // --- Funciones de Navegación ---

  toggleSidebar: function () {
    this.state.isSidebarOpen = !this.state.isSidebarOpen;
    this.dom.sidebar.classList.toggle("open", this.state.isSidebarOpen);
  },

  navigate: function (viewId, linkElement = null) {
    // 1. Ocultar todas las vistas
    this.dom.views.forEach((view) => view.classList.remove("active"));

    // 2. Mostrar vista objetivo
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add("active");
      // Scroll al top para evitar quedarse abajo
      window.scrollTo(0, 0);
    }

    // 3. Actualizar menú activo
    this.dom.navLinks.forEach((link) => link.classList.remove("active"));

    if (linkElement) {
      linkElement.classList.add("active");
    } else {
      // Si la navegación es manual (desde un botón interno), buscar el link correspondiente
      const activeLink = document.querySelector(
        `.nav-link[data-target="${viewId}"]`
      );
      if (activeLink) activeLink.classList.add("active");
    }

    // 4. Cerrar sidebar en móvil automáticamente
    if (window.innerWidth <= 768) {
      this.dom.sidebar.classList.remove("open");
      this.state.isSidebarOpen = false;
    }
  },

  // --- Funciones del Escáner (HU02) ---

  handleFileSelect: function (event) {
    // Ocultar resultados de análisis previo
    this.dom.scanResult.style.display = "none";

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.dom.imagePreview.src = e.target.result;
        this.dom.imagePreview.style.display = "block";
        this.dom.scanPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  },

  startAnalysis: function () {
    // Validación
    if (!this.dom.fileInput.files[0]) {
      alert("Por favor, selecciona o toma una foto primero.");
      return;
    }

    // UI Loading
    this.dom.scanLoader.style.display = "flex";
    this.dom.scanResult.style.display = "none"; // Ocultar resultado previo

    // Simulación de API (3 segundos)
    setTimeout(() => {
      this.dom.scanLoader.style.display = "none";
      this.showResults();
    }, 3000);
  },

  showResults: function () {
    // Simulación aleatoria de riesgo (Demo)
    const isHighRisk = Math.random() < 0.5;

    this.dom.scanResult.style.display = "block";

    if (isHighRisk) {
      this.dom.scanResult.className = "result-modal risk-high";
      this.dom.riskLabel.innerText = "ALTO RIESGO DETECTADO";
      this.dom.riskDesc.innerText =
        "La IA ha detectado asimetría y bordes irregulares. Se recomienda agendar una cita con un especialista inmediatamente.";
    } else {
      this.dom.scanResult.className = "result-modal";

      // Restaurar estilos (si se necesita)
      this.dom.scanResult.style.background = "";
      this.dom.scanResult.style.borderLeftColor = "";

      this.dom.riskLabel.innerText = "Riesgo Bajo";
      this.dom.riskDesc.innerText =
        "La lesión parece benigna. Continúa monitoreando cambios en el futuro.";
    }

    // Scroll suave hacia el resultado
    this.dom.scanResult.scrollIntoView({ behavior: "smooth" });
  },
};

// Iniciar app cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Exponer el objeto app para acceso desde HTML (onclick)
  window.app = app;
  app.init();
});
