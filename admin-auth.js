// admin-auth.js - Authentication and session management for ADEQ Admin

// Default admin credentials
const ADMIN_CREDENTIALS = {
  email: "admin@adeq.com",
  password: "password123",
};

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// DOM Elements
let loginPage, dashboardPage, loginForm, emailInput, passwordInput;
let emailError,
  passwordError,
  loginButton,
  loadingSpinner,
  logoutButton,
  userName;

// Initialize authentication system
function initAuthSystem() {
  initializeElements();

  // Check if user is already logged in
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }

  // Set up form submission handler
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Set up input validation on the fly
  if (emailInput) {
    emailInput.addEventListener("input", validateEmail);
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", validatePassword);
  }

  // Set up logout handler
  if (logoutButton) {
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }

  // Set up dashboard navigation if available
  setupDashboardNavigation();

  // Start simulated data updates if on dashboard
  if (isLoggedIn()) {
    startDataUpdates();
  }
}

// Initialize DOM elements
function initializeElements() {
  loginPage = document.getElementById("loginPage");
  dashboardPage = document.getElementById("dashboardPage");
  loginForm = document.getElementById("loginForm");
  emailInput = document.getElementById("email");
  passwordInput = document.getElementById("password");
  emailError = document.getElementById("emailError");
  passwordError = document.getElementById("passwordError");
  loginButton = document.getElementById("loginButton");
  loadingSpinner = document.getElementById("loadingSpinner");
  logoutButton = document.getElementById("logoutButton");
  userName = document.getElementById("userName");
}

// Set up dashboard navigation
function setupDashboardNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const contentAreas = document.querySelectorAll(".content-area");

  if (navItems.length > 0 && contentAreas.length > 0) {
    navItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();

        // Remove active class from all items
        navItems.forEach((i) => {
          i.classList.remove("bg-primary", "text-white");
          i.classList.add("text-gray-600", "hover:bg-gray-50");
        });

        // Add active class to clicked item
        this.classList.remove("text-gray-600", "hover:bg-gray-50");
        this.classList.add("bg-primary", "text-white");

        // Show the corresponding content area
        const target = this.getAttribute("data-target");
        contentAreas.forEach((area) => {
          area.classList.remove("active");
        });

        const targetElement = document.getElementById(target);
        if (targetElement) {
          targetElement.classList.add("active");
        }
      });
    });
  }
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();

  // Validate inputs
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    shakeForm();
    return;
  }

  // Show loading state
  setLoadingState(true);

  // Simulate API call delay
  setTimeout(() => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // Successful login
      createSession();
      showDashboard();
      startDataUpdates();
    } else {
      // Failed login
      setLoadingState(false);
      showLoginError();
      shakeForm();
    }
  }, 1000);
}

// Validate email format
function validateEmail() {
  const email = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValid && email.length > 0) {
    emailError.classList.remove("hidden");
    emailInput.classList.add("border-red-500");
    return false;
  } else {
    emailError.classList.add("hidden");
    emailInput.classList.remove("border-red-500");
    return true;
  }
}

// Validate password
function validatePassword() {
  const password = passwordInput.value;
  const isValid = password.length >= 8;

  if (!isValid && password.length > 0) {
    passwordError.classList.remove("hidden");
    passwordInput.classList.add("border-red-500");
    return false;
  } else {
    passwordError.classList.add("hidden");
    passwordInput.classList.remove("border-red-500");
    return true;
  }
}

// Create user session
function createSession() {
  const sessionData = {
    loggedIn: true,
    loginTime: new Date().getTime(),
    user: {
      email: emailInput.value.trim(),
      name: "Administrator",
    },
  };

  // Store session in localStorage
  localStorage.setItem("adeq_admin_session", JSON.stringify(sessionData));
}

// Check if user is logged in
function isLoggedIn() {
  // For testing purposes, you can force login page by adding ?forceLogin=true to URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("forceLogin") === "true") {
    return false;
  }

  const sessionData = JSON.parse(
    localStorage.getItem("adeq_admin_session") || "{}"
  );

  if (!sessionData.loggedIn) {
    return false;
  }

  // Check if session has expired
  const currentTime = new Date().getTime();
  if (currentTime - sessionData.loginTime > SESSION_TIMEOUT) {
    localStorage.removeItem("adeq_admin_session");
    return false;
  }

  return true;
}

// Show dashboard page
function showDashboard() {
  if (loginPage) loginPage.style.display = "none";
  if (dashboardPage) dashboardPage.style.display = "block";

  // Display user info
  const sessionData = JSON.parse(
    localStorage.getItem("adeq_admin_session") || "{}"
  );
  if (sessionData.user && userName) {
    userName.textContent = sessionData.user.name;
  }

  // Set up dashboard navigation
  setupDashboardNavigation();
}

// Show login page
function showLogin() {
  if (loginPage) loginPage.style.display = "flex";
  if (dashboardPage) dashboardPage.style.display = "none";
}

// Logout function
function logout() {
  localStorage.removeItem("adeq_admin_session");
  showLogin();

  // Clear form
  if (loginForm) loginForm.reset();
}

// Show login error message
function showLoginError() {
  // Create error message if it doesn't exist
  let errorAlert = document.getElementById("loginErrorAlert");

  if (!errorAlert && loginForm) {
    errorAlert = document.createElement("div");
    errorAlert.id = "loginErrorAlert";
    errorAlert.className =
      "mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm";
    errorAlert.innerHTML =
      '<i class="fas fa-exclamation-circle mr-2"></i> Invalid email or password. Please try again.';

    loginForm.appendChild(errorAlert);
  } else if (errorAlert) {
    errorAlert.classList.remove("hidden");
  }

  // Remove error after 5 seconds
  if (errorAlert) {
    setTimeout(() => {
      errorAlert.classList.add("hidden");
    }, 5000);
  }
}

// Set loading state for login button
function setLoadingState(isLoading) {
  if (!loginButton || !loadingSpinner) return;

  if (isLoading) {
    loginButton.disabled = true;
    loginButton.classList.add("opacity-75");
    loadingSpinner.classList.remove("hidden");
  } else {
    loginButton.disabled = false;
    loginButton.classList.remove("opacity-75");
    loadingSpinner.classList.add("hidden");
  }
}

// Shake form animation for invalid inputs
function shakeForm() {
  if (!loginForm) return;

  loginForm.classList.add("shake");
  setTimeout(() => {
    loginForm.classList.remove("shake");
  }, 500);
}

// Start simulated data updates for dashboard
function startDataUpdates() {
  // This would be replaced with actual API calls in a real implementation
  setInterval(() => {
    if (isLoggedIn()) {
      const pendingBookings = Math.floor(Math.random() * 10);
      const equipmentOrders = Math.floor(Math.random() * 15);
      const newTestimonials = Math.floor(Math.random() * 5);

      const statCards = document.querySelectorAll(".stat-card");
      if (statCards.length >= 3) {
        const bookingElement = statCards[0].querySelector("p.text-2xl");
        const orderElement = statCards[1].querySelector("p.text-2xl");
        const testimonialElement = statCards[2].querySelector("p.text-2xl");

        if (bookingElement) bookingElement.textContent = pendingBookings;
        if (orderElement) orderElement.textContent = equipmentOrders;
        if (testimonialElement)
          testimonialElement.textContent = newTestimonials;
      }
    }
  }, 10000);
}

// Make functions available globally for HTML onclick attributes
window.adminAuth = {
  logout: logout,
};

// Initialize when DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuthSystem);
} else {
  initAuthSystem();
}
