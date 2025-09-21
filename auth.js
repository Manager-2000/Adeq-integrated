// auth.js - Modern Authentication with User Dropdown and Password Reset
let registrationVerificationCode = "";
let passwordResetVerificationCode = "";
let pendingUser = null;
let resetUser = null;

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const authButton = document.getElementById("authButton");
  const authModal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");
  const verifyCodeBtn = document.getElementById("verifyCodeBtn");
  const resendCodeBtn = document.getElementById("resendCodeBtn");
  const backToRegister = document.getElementById("backToRegister");
  const userDropdown = document.getElementById("userDropdown");
  const logoutButton = document.getElementById("logoutButton");

  // Password reset elements
  const showForgotPassword = document.getElementById("showForgotPassword");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const backToLoginFromForgot = document.getElementById(
    "backToLoginFromForgot"
  );
  const backToLoginFromReset = document.getElementById("backToLoginFromReset");
  const sendResetLinkBtn = document.getElementById("sendResetLinkBtn");
  const submitNewPasswordBtn = document.getElementById("submitNewPasswordBtn");
  const resendResetCodeBtn = document.getElementById("resendResetCodeBtn");

  // Initialize
  checkLoginStatus();
  setupDropdown();

  // Event Listeners
  if (closeModal) closeModal.addEventListener("click", closeAuthModal);
  if (showRegister) showRegister.addEventListener("click", showRegisterForm);
  if (showLogin) showLogin.addEventListener("click", showLoginForm);

  // Password reset listeners
  if (showForgotPassword)
    showForgotPassword.addEventListener("click", showForgotPasswordForm);
  if (backToLoginFromForgot)
    backToLoginFromForgot.addEventListener("click", backToLoginFromForgotForm);
  if (backToLoginFromReset)
    backToLoginFromReset.addEventListener("click", backToLoginFromResetForm);
  if (sendResetLinkBtn)
    sendResetLinkBtn.addEventListener("click", handleSendResetLink);
  if (submitNewPasswordBtn)
    submitNewPasswordBtn.addEventListener("click", handlePasswordReset);
  if (resendResetCodeBtn)
    resendResetCodeBtn.addEventListener("click", resendPasswordResetCode);

  // Form submissions
  const loginSubmitBtn = document.querySelector(
    '#loginForm button[type="submit"]'
  );
  const registerSubmitBtn = document.querySelector(
    '#registerForm button[type="submit"]'
  );
  if (loginSubmitBtn) loginSubmitBtn.addEventListener("click", handleLogin);
  if (registerSubmitBtn)
    registerSubmitBtn.addEventListener("click", handleRegister);

  // Verification buttons
  if (verifyCodeBtn)
    verifyCodeBtn.addEventListener("click", verifyRegistrationCode);
  if (resendCodeBtn)
    resendCodeBtn.addEventListener("click", resendRegistrationCode);
  if (backToRegister)
    backToRegister.addEventListener("click", backToRegisterForm);

  // Dropdown
  if (logoutButton) logoutButton.addEventListener("click", handleLogout);

  // Auto-navigate verification inputs
  const digitInputs = document.querySelectorAll(".verification-digit");
  digitInputs.forEach((input) => {
    input.addEventListener("input", function () {
      moveToNext(this);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !this.value && this.previousElementSibling) {
        this.previousElementSibling.focus();
      }
    });
  });

  // Password reset verification inputs
  const resetDigitInputs = document.querySelectorAll(
    ".reset-verification-digit"
  );
  resetDigitInputs.forEach((input) => {
    input.addEventListener("input", function () {
      moveToNextReset(this);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !this.value && this.previousElementSibling) {
        this.previousElementSibling.focus();
      }
    });
  });

  // Functions
  function setupDropdown() {
    if (authButton && userDropdown) {
      authButton.addEventListener("click", function (e) {
        const isLoggedIn = localStorage.getItem("userLoggedIn");

        if (isLoggedIn) {
          userDropdown.classList.toggle("show");
          e.stopPropagation();
        } else {
          authModal.classList.remove("hidden");
          showLoginForm();
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (
        userDropdown &&
        !userDropdown.contains(e.target) &&
        authButton &&
        !authButton.contains(e.target)
      ) {
        userDropdown.classList.remove("show");
      }
    });
  }

  function toggleAuthModal() {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    if (isLoggedIn) {
      handleLogout();
    } else {
      authModal.classList.remove("hidden");
      showLoginForm();
    }
  }

  function closeAuthModal() {
    authModal.classList.add("hidden");
    // Reset forms when closing modal
    showLoginForm();
  }

  function showRegisterForm(e) {
    if (e) e.preventDefault();
    loginForm.classList.add("hidden");
    document.getElementById("verificationForm").classList.add("hidden");
    forgotPasswordForm.classList.add("hidden");
    resetPasswordForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  }

  function showLoginForm(e) {
    if (e) e.preventDefault();
    registerForm.classList.add("hidden");
    document.getElementById("verificationForm").classList.add("hidden");
    forgotPasswordForm.classList.add("hidden");
    resetPasswordForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  }

  function showForgotPasswordForm(e) {
    if (e) e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    document.getElementById("verificationForm").classList.add("hidden");
    resetPasswordForm.classList.add("hidden");
    forgotPasswordForm.classList.remove("hidden");
  }

  function backToLoginFromForgotForm(e) {
    if (e) e.preventDefault();
    showLoginForm();
  }

  function backToLoginFromResetForm(e) {
    if (e) e.preventDefault();
    showLoginForm();
  }

  function handleLogin(e) {
    e.preventDefault();
    const email = document.querySelector(
      '#loginForm input[type="email"]'
    ).value;
    const password = document.querySelector(
      '#loginForm input[type="password"]'
    ).value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      updateUIAfterLogin(user);
      closeAuthModal();
      showNotification("Login successful!", "success");
    } else {
      showNotification("Invalid email or password", "error");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const firstName = document.querySelector(
      '#registerForm input[placeholder="First Name"]'
    ).value;
    const secondName = document.querySelector(
      '#registerForm input[placeholder="Second Name"]'
    ).value;
    const email = document.querySelector(
      '#registerForm input[type="email"]'
    ).value;
    const password = document.querySelector(
      '#registerForm input[type="password"]'
    ).value;
    const name = `${firstName} ${secondName}`;

    if (!firstName || !secondName || !email || !password) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((user) => user.email === email)) {
      showNotification("User with this email already exists", "error");
      return;
    }

    pendingUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "customer",
      createdAt: new Date().toISOString(),
      verified: false,
    };

    registrationVerificationCode = generateVerificationCode();
    const emailSent = await sendVerificationEmail(
      email,
      registrationVerificationCode
    );

    if (emailSent) {
      showVerificationForm();
      showNotification("Verification code sent to your email", "success");
    } else {
      showNotification(
        "Failed to send verification email. Please try again.",
        "error"
      );
    }
  }

  async function handleSendResetLink(e) {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;

    if (!email) {
      showNotification("Please enter your email address", "error");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.email === email);

    if (!user) {
      showNotification("No account found with this email", "error");
      return;
    }

    resetUser = user;
    passwordResetVerificationCode = generateVerificationCode();
    const emailSent = await sendPasswordResetEmail(
      email,
      passwordResetVerificationCode
    );

    if (emailSent) {
      showResetPasswordForm();
      showNotification("Password reset code sent to your email", "success");
    } else {
      showNotification(
        "Failed to send reset email. Please try again.",
        "error"
      );
    }
  }

  // Auto-move to next reset input
  function moveToNextReset(input) {
    const nextInput = input.nextElementSibling;
    if (
      input.value &&
      nextInput &&
      nextInput.classList.contains("reset-verification-digit")
    ) {
      nextInput.focus();
    }
  }

  // Collect the 6-digit reset code
  function getResetVerificationCode() {
    const digits = document.querySelectorAll(".reset-verification-digit");
    let code = "";
    digits.forEach((digit) => {
      code += digit.value;
    });
    return code;
  }

  async function handlePasswordReset(e) {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    const newPasswordEl = document.getElementById("newPassword");
    const confirmPasswordEl = document.getElementById("confirmPassword");
    const enteredCode = getResetVerificationCode();

    if (!newPasswordEl || !confirmPasswordEl) {
      showNotification("Reset form elements not found", "error");
      return;
    }

    const newPassword = newPasswordEl.value.trim();
    const confirmPassword = confirmPasswordEl.value.trim();

    if (!newPassword || !confirmPassword || enteredCode.length !== 6) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (enteredCode !== passwordResetVerificationCode) {
      showNotification("Invalid verification code", "error");
      return;
    }

    // ✅ Save new password
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.email === resetUser.email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));

      showNotification(
        "Password reset successfully! Please log in.",
        "success"
      );

      // Clear inputs
      newPasswordEl.value = "";
      confirmPasswordEl.value = "";
      document
        .querySelectorAll(".reset-verification-digit")
        .forEach((digit) => (digit.value = ""));

      // Reset temp state
      resetUser = null;
      passwordResetVerificationCode = "";

      // Redirect to login
      showLoginForm();
      const loginEmail = document.getElementById("loginEmail");
      if (loginEmail) loginEmail.focus();
    } else {
      showNotification("User not found", "error");
    }
  }

  function showResetPasswordForm() {
    loginForm.classList.add("hidden");
    registerForm.classList.add("hidden");
    document.getElementById("verificationForm").classList.add("hidden");
    forgotPasswordForm.classList.add("hidden");
    resetPasswordForm.classList.remove("hidden");

    // Focus on first digit input
    const firstDigit = document.querySelector(".reset-verification-digit");
    if (firstDigit) {
      firstDigit.focus();
    }
  }

  function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (isLoggedIn && userData.id) {
      updateUIAfterLogin(userData);
    } else {
      const authButtonText = document.getElementById("authButtonText");
      if (authButtonText) authButtonText.textContent = "Login";
      if (authButton) authButton.classList.remove("logged-in");
    }
  }

  function updateUIAfterLogin(user) {
    if (authButton) {
      const firstName = user.name.split(" ")[0];
      authButton.innerHTML = `
        <i class="fas fa-user-circle text-xl mr-2"></i>
        <span id="authButtonText">${firstName}</span>
        <i class="fas fa-chevron-down ml-2 text-sm"></i>
      `;
      authButton.classList.add("logged-in");
    }

    const userNameElement = document.getElementById("userDropdownName");
    const userEmailElement = document.getElementById("userDropdownEmail");
    if (userNameElement) userNameElement.textContent = user.name;
    if (userEmailElement) userEmailElement.textContent = user.email;
  }

  function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");

    if (authButton) {
      authButton.innerHTML = `
        <i class="fas fa-user-circle text-xl mr-2"></i>
        <span id="authButtonText">Login</span>
        <i class="fas fa-chevron-down ml-2 text-sm"></i>
      `;
      authButton.classList.remove("logged-in");
    }

    if (userDropdown) userDropdown.classList.remove("show");
    showNotification("Logged out successfully", "success");
  }

  // Verification functions
  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async function sendVerificationEmail(email, code) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/send-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Verification email sent successfully");
        return true;
      } else {
        console.error("Failed to send verification email:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return false;
    }
  }

  async function sendPasswordResetEmail(email, code) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/send-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Password reset email sent successfully");
        return true;
      } else {
        console.error("Failed to send password reset email:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return false;
    }
  }

  function moveToNext(input) {
    const nextInput = input.nextElementSibling;
    if (
      input.value &&
      nextInput &&
      nextInput.classList.contains("verification-digit")
    ) {
      nextInput.focus();
    }

    // Auto-submit if all digits are filled
    const digits = document.querySelectorAll(".verification-digit");
    const allFilled = Array.from(digits).every((digit) => digit.value !== "");
    if (allFilled) {
      verifyRegistrationCode();
    }
  }

  function moveToNextReset(input) {
    const nextInput = input.nextElementSibling;
    if (
      input.value &&
      nextInput &&
      nextInput.classList.contains("reset-verification-digit")
    ) {
      nextInput.focus();
    }

    // Auto-submit if all digits are filled
    const digits = document.querySelectorAll(".reset-verification-digit");
    const allFilled = Array.from(digits).every((digit) => digit.value !== "");
    if (allFilled) {
      handlePasswordReset(new Event("submit"));
    }
  }

  function getVerificationCode() {
    const digits = document.querySelectorAll(".verification-digit");
    let code = "";
    digits.forEach((digit) => {
      code += digit.value;
    });
    return code;
  }

  function getResetVerificationCode() {
    const digits = document.querySelectorAll(".reset-verification-digit");
    let code = "";
    digits.forEach((digit) => {
      code += digit.value;
    });
    return code;
  }

  function showVerificationForm() {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("forgotPasswordForm").classList.add("hidden");
    document.getElementById("resetPasswordForm").classList.add("hidden");
    document.getElementById("verificationForm").classList.remove("hidden");

    // Focus on first digit input
    const firstDigit = document.querySelector(".verification-digit");
    if (firstDigit) {
      firstDigit.focus();
    }
  }

  function backToRegisterForm() {
    document.getElementById("verificationForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
  }

  function verifyRegistrationCode() {
    const enteredCode = getVerificationCode();

    if (enteredCode.length !== 6) {
      showNotification("Please enter the full 6-digit code", "error");
      return;
    }

    if (enteredCode === registrationVerificationCode) {
      // Code is correct, complete registration
      completeRegistration();
    } else {
      showNotification("Invalid verification code. Please try again.", "error");

      // Clear all inputs
      const digits = document.querySelectorAll(".verification-digit");
      digits.forEach((digit) => (digit.value = ""));

      // Focus on first input
      if (digits.length > 0) {
        digits[0].focus();
      }
    }
  }

  function completeRegistration() {
    // Get users from localStorage or initialize empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Add to users array
    users.push(pendingUser);

    // Save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Auto login after registration
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(pendingUser));

    // Update UI
    updateUIAfterLogin(pendingUser);

    // Close modal
    closeAuthModal();

    // Show success message
    showNotification("Registration successful! Email verified.", "success");

    // Reset pending user
    pendingUser = null;
    registrationVerificationCode = "";
  }

  async function resendRegistrationCode() {
    if (!pendingUser) {
      showNotification("No pending registration found", "error");
      return;
    }

    // Generate new code
    registrationVerificationCode = generateVerificationCode();
    const emailSent = await sendVerificationEmail(
      pendingUser.email,
      registrationVerificationCode
    );

    if (emailSent) {
      showNotification("Verification code sent again!", "success");
    } else {
      showNotification("Failed to resend code. Please try again.", "error");
    }
  }

  async function resendPasswordResetCode() {
    if (!resetUser) {
      showNotification("No password reset request found", "error");
      return;
    }

    // Generate new code
    passwordResetVerificationCode = generateVerificationCode();
    const emailSent = await sendPasswordResetEmail(
      resetUser.email,
      passwordResetVerificationCode
    );

    if (emailSent) {
      showNotification("Password reset code sent again!", "success");
    } else {
      showNotification("Failed to resend code. Please try again.", "error");
    }
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
});
