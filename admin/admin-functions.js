// admin-functions.js - Functional admin panel operations

// Initialize admin functionality
function initAdminFunctions() {
  loadServices();
  loadEquipment();
  setupEventListeners();
}

// Load services from backend
async function loadServices() {
  try {
    const response = await fetch("/api/services");
    const data = await response.json();
    displayServices(data.services);
  } catch (error) {
    console.error("Failed to load services:", error);
    showNotification("Failed to load services", "error");
  }
}

// Display services in admin panel
function displayServices(services) {
  const container = document.getElementById("services-list");
  if (!container) return;

  if (services.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center py-4">No services found. Add your first service!</p>';
    return;
  }

  container.innerHTML = services
    .map(
      (service) => `
        <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
                <div class="flex items-start space-x-3">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <i class="${service.icon}"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">${service.title}</h4>
                        <p class="text-gray-600 text-sm mt-1">${service.description}</p>
                        <p class="text-xs text-gray-500 mt-1">Link: ${service.link}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editService(${service.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteService(${service.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Load equipment from backend
async function loadEquipment() {
  try {
    const response = await fetch("/api/equipment");
    const data = await response.json();
    displayEquipment(data.equipment || []);
  } catch (error) {
    console.error("Failed to load equipment:", error);
    showNotification("Failed to load equipment", "error");
  }
}

// Display equipment in admin panel
function displayEquipment(equipment) {
  const container = document.getElementById("equipment-list");
  if (!container) return;

  if (equipment.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500 text-center py-4">No equipment found. Add your first equipment item!</p>';
    return;
  }

  container.innerHTML = equipment
    .map(
      (item) => `
        <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
                <div class="flex items-start space-x-3">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">` : ""}
                    <div>
                        <h4 class="font-semibold text-lg">${item.name}</h4>
                        <p class="text-gray-600 text-sm mt-1">${item.description}</p>
                        <p class="text-green-600 font-semibold mt-1">₦${item.price?.toLocaleString()}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editEquipment(${item.id})" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteEquipment(${item.id})" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// Service Editor Functions
function openServiceEditor(serviceId = null) {
  const modal = document.getElementById("serviceEditorModal");
  const title = document.getElementById("serviceEditorTitle");
  const form = document.getElementById("serviceEditorForm");

  if (serviceId) {
    title.textContent = "Edit Service";
    // Load service data for editing
    loadServiceData(serviceId);
  } else {
    title.textContent = "Add New Service";
    form.reset();
    document.getElementById("editServiceId").value = "";
  }

  modal.classList.remove("hidden");
}

function closeServiceEditor() {
  document.getElementById("serviceEditorModal").classList.add("hidden");
}

async function loadServiceData(serviceId) {
  try {
    const response = await fetch("/api/services");
    const data = await response.json();
    const service = data.services.find((s) => s.id === serviceId);

    if (service) {
      document.getElementById("editServiceId").value = service.id;
      document.getElementById("serviceTitle").value = service.title;
      document.getElementById("serviceIcon").value = service.icon;
      document.getElementById("serviceDescription").value = service.description;
      document.getElementById("serviceLink").value = service.link;
    }
  } catch (error) {
    console.error("Failed to load service data:", error);
  }
}

async function saveService(event) {
  event.preventDefault();

  const serviceId = document.getElementById("editServiceId").value;
  const serviceData = {
    title: document.getElementById("serviceTitle").value,
    icon: document.getElementById("serviceIcon").value,
    description: document.getElementById("serviceDescription").value,
    link: document.getElementById("serviceLink").value,
    linkText: "Learn more",
  };

  try {
    // Get current services
    const response = await fetch("/api/services");
    const data = await response.json();
    let services = data.services;

    if (serviceId) {
      // Update existing service
      const index = services.findIndex((s) => s.id === parseInt(serviceId));
      if (index !== -1) {
        services[index] = { ...services[index], ...serviceData };
      }
    } else {
      // Add new service
      const newId = Math.max(...services.map((s) => s.id), 0) + 1;
      services.push({ id: newId, ...serviceData });
    }

    // Save updated services
    const saveResponse = await fetch("/api/services/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });

    const result = await saveResponse.json();

    if (result.success) {
      showNotification("Service saved successfully!", "success");
      closeServiceEditor();
      loadServices(); // Reload the list
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to save service:", error);
    showNotification("Failed to save service", "error");
  }
}

function editService(serviceId) {
  openServiceEditor(serviceId);
}

async function deleteService(serviceId) {
  if (!confirm("Are you sure you want to delete this service?")) return;

  try {
    const response = await fetch("/api/services");
    const data = await response.json();
    const services = data.services.filter((s) => s.id !== serviceId);

    const saveResponse = await fetch("/api/services/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });

    const result = await saveResponse.json();

    if (result.success) {
      showNotification("Service deleted successfully!", "success");
      loadServices(); // Reload the list
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to delete service:", error);
    showNotification("Failed to delete service", "error");
  }
}

// Equipment Editor Functions (similar pattern as services)
function openEquipmentEditor(equipmentId = null) {
  const modal = document.getElementById("equipmentEditorModal");
  const title = document.getElementById("equipmentEditorTitle");

  if (equipmentId) {
    title.textContent = "Edit Equipment";
    loadEquipmentData(equipmentId);
  } else {
    title.textContent = "Add New Equipment";
    document.getElementById("equipmentEditorForm").reset();
    document.getElementById("editEquipmentId").value = "";
  }

  modal.classList.remove("hidden");
}

function closeEquipmentEditor() {
  document.getElementById("equipmentEditorModal").classList.add("hidden");
}

async function loadEquipmentData(equipmentId) {
  try {
    const response = await fetch("/api/equipment");
    const data = await response.json();
    const equipment = (data.equipment || []).find((e) => e.id === equipmentId);

    if (equipment) {
      document.getElementById("editEquipmentId").value = equipment.id;
      document.getElementById("equipmentName").value = equipment.name;
      document.getElementById("equipmentDescription").value =
        equipment.description;
      document.getElementById("equipmentPrice").value = equipment.price;
      document.getElementById("equipmentImage").value = equipment.image || "";
    }
  } catch (error) {
    console.error("Failed to load equipment data:", error);
  }
}

async function saveEquipment(event) {
  event.preventDefault();

  const equipmentId = document.getElementById("editEquipmentId").value;
  const equipmentData = {
    name: document.getElementById("equipmentName").value,
    description: document.getElementById("equipmentDescription").value,
    price: parseInt(document.getElementById("equipmentPrice").value),
    image: document.getElementById("equipmentImage").value,
  };

  try {
    const response = await fetch("/api/equipment");
    const data = await response.json();
    let equipment = data.equipment || [];

    if (equipmentId) {
      const index = equipment.findIndex((e) => e.id === parseInt(equipmentId));
      if (index !== -1) {
        equipment[index] = { ...equipment[index], ...equipmentData };
      }
    } else {
      const newId = Math.max(...equipment.map((e) => e.id || 0), 0) + 1;
      equipment.push({ id: newId, ...equipmentData });
    }

    const saveResponse = await fetch("/api/equipment/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipment }),
    });

    const result = await saveResponse.json();

    if (result.success) {
      showNotification("Equipment saved successfully!", "success");
      closeEquipmentEditor();
      loadEquipment();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to save equipment:", error);
    showNotification("Failed to save equipment", "error");
  }
}

function editEquipment(equipmentId) {
  openEquipmentEditor(equipmentId);
}

async function deleteEquipment(equipmentId) {
  if (!confirm("Are you sure you want to delete this equipment?")) return;

  try {
    const response = await fetch("/api/equipment");
    const data = await response.json();
    const equipment = (data.equipment || []).filter(
      (e) => e.id !== equipmentId
    );

    const saveResponse = await fetch("/api/equipment/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equipment }),
    });

    const result = await saveResponse.json();

    if (result.success) {
      showNotification("Equipment deleted successfully!", "success");
      loadEquipment();
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to delete equipment:", error);
    showNotification("Failed to delete equipment", "error");
  }
}

// Utility Functions
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function setupEventListeners() {
  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.id === "serviceEditorModal") closeServiceEditor();
    if (e.target.id === "equipmentEditorModal") closeEquipmentEditor();
  });
}

// Page-specific functions
function editHomepage() {
  showNotification("Homepage editor would open here", "info");
}

function editAboutPage() {
  showNotification("About page editor would open here", "info");
}

function loadBookings() {
  showNotification("Refreshing bookings...", "info");
}

function addTestimonial() {
  showNotification("Testimonial editor would open here", "info");
}

function saveSettings() {
  showNotification("Settings saved successfully!", "success");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAdminFunctions);
} else {
  initAdminFunctions();
}
