// verification.js - Updated with real API call
// Global variables to store verification data
let verificationCode = "";
let pendingUser = null;

// Function to generate a random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send verification email
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

// Function to move to next input field
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
    verifyCode();
  }
}

// Function to get the full verification code
function getVerificationCode() {
  const digits = document.querySelectorAll(".verification-digit");
  let code = "";
  digits.forEach((digit) => {
    code += digit.value;
  });
  return code;
}

// Function to show verification form
function showVerificationForm() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("verificationForm").classList.remove("hidden");

  // Focus on first digit input
  const firstDigit = document.querySelector(".verification-digit");
  if (firstDigit) {
    firstDigit.focus();
  }
}

// Function to go back to register form
function backToRegisterForm() {
  document.getElementById("verificationForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
}

// Function to verify the code
function verifyCode() {
  const enteredCode = getVerificationCode();

  if (enteredCode.length !== 6) {
    alert("Please enter the full 6-digit code");
    return;
  }

  if (enteredCode === verificationCode) {
    // Code is correct, complete registration
    completeRegistration();
  } else {
    alert("Invalid verification code. Please try again.");

    // Clear all inputs
    const digits = document.querySelectorAll(".verification-digit");
    digits.forEach((digit) => (digit.value = ""));

    // Focus on first input
    if (digits.length > 0) {
      digits[0].focus();
    }
  }
}

// Function to complete registration after verification
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
}

// Function to resend verification code
async function resendVerificationCode() {
  if (!pendingUser) {
    alert("No pending registration found");
    return;
  }

  // Generate new code
  verificationCode = generateVerificationCode();

  // Send new code
  const emailSent = await sendVerificationEmail(
    pendingUser.email,
    verificationCode
  );

  if (emailSent) {
    showNotification("Verification code sent again!", "success");
  } else {
    showNotification("Failed to resend code. Please try again.", "error");
  }
}

// Initialize verification functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners
  const verifyCodeBtn = document.getElementById("verifyCodeBtn");
  const resendCodeBtn = document.getElementById("resendCodeBtn");
  const backToRegister = document.getElementById("backToRegister");

  if (verifyCodeBtn) {
    verifyCodeBtn.addEventListener("click", verifyCode);
  }

  if (resendCodeBtn) {
    resendCodeBtn.addEventListener("click", resendVerificationCode);
  }

  if (backToRegister) {
    backToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      backToRegisterForm();
    });
  }

  // Allow pressing Enter to verify code
  const digitInputs = document.querySelectorAll(".verification-digit");
  digitInputs.forEach((input) => {
    input.addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        verifyCode();
      }
    });

    // Auto-navigate between inputs
    input.addEventListener("input", function () {
      moveToNext(this);
    });

    // Allow backspace to move to previous input
    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && !this.value && this.previousElementSibling) {
        this.previousElementSibling.focus();
      }
    });
  });
});
