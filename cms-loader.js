// cms-loader.js - Load content from Netlify CMS
class CMSLoader {
  constructor() {
    this.baseURL = window.location.origin;
  }

  async loadServices() {
    try {
      const response = await fetch("/content/services/services.json");
      const services = await response.json();
      this.renderServices(services);
    } catch (error) {
      console.log("No custom services found, using default");
      this.loadDefaultServices();
    }
  }

  async loadEquipment() {
    try {
      const response = await fetch("/content/equipment/equipment.json");
      const equipment = await response.json();
      this.renderEquipment(equipment);
    } catch (error) {
      console.log("No custom equipment found, using default");
      this.loadDefaultEquipment();
    }
  }

  async loadProjects() {
    try {
      const response = await fetch("/content/projects/projects.json");
      const projects = await response.json();
      this.renderProjects(projects);
    } catch (error) {
      console.log("No custom projects found, using default");
      this.loadDefaultProjects();
    }
  }

  renderServices(services) {
    const container = document.getElementById("services-container");
    if (!container) return;

    container.innerHTML = services
      .map(
        (service) => `
      <div class="bg-white rounded-lg shadow-lg p-6 text-center service-item">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-water text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">${service.title}</h3>
        <p class="text-gray-600 mb-4">${service.description}</p>
        <p class="text-secondary font-bold text-lg">₦${service.price?.toLocaleString() || "Contact for pricing"}</p>
      </div>
    `
      )
      .join("");
  }

  renderEquipment(equipment) {
    const container = document.getElementById("equipment-container");
    if (!container) return;

    container.innerHTML = equipment
      .map(
        (item) => `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden equipment-item">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">` : ""}
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-3">${item.name}</h3>
          <p class="text-gray-600 mb-4">${item.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-secondary font-bold text-lg">₦${item.price?.toLocaleString() || "Contact for price"}</span>
            <button class="add-to-cart bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Re-attach cart event listeners
    this.attachCartListeners();
  }

  renderProjects(projects) {
    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = projects
      .map(
        (project) => `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">` : ""}
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-3">${project.title}</h3>
          <p class="text-gray-600">${project.description}</p>
          <span class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mt-4">
            ${project.category}
          </span>
        </div>
      </div>
    `
      )
      .join("");
  }

  attachCartListeners() {
    // Your existing cart attachment code
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Your existing cart logic
        console.log("Add to cart clicked");
      });
    });
  }

  loadDefaultServices() {
    const container = document.getElementById("services-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Your existing default services HTML -->
      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-search text-white text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Water Survey</h3>
        <p class="text-gray-600 mb-4">Professional groundwater survey and analysis</p>
        <p class="text-secondary font-bold text-lg">From ₦30,000</p>
      </div>
      <!-- Add more default services as needed -->
    `;
  }

  loadDefaultEquipment() {
    const container = document.getElementById("equipment-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Your existing default equipment HTML -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src="/assets/images/borehole-machine.jpg" alt="Borehole Machine" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-3">Borehole Machine</h3>
          <p class="text-gray-600 mb-4">Professional borehole drilling equipment</p>
          <div class="flex justify-between items-center">
            <span class="text-secondary font-bold text-lg">₦2,500,000</span>
            <button class="add-to-cart bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <!-- Add more default equipment as needed -->
    `;

    this.attachCartListeners();
  }

  loadDefaultProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Your existing default projects HTML -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src="/assets/images/project-1.jpg" alt="Commercial Borehole" class="w-full h-48 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold text-primary mb-3">Commercial Borehole</h3>
          <p class="text-gray-600">Large-scale borehole installation for commercial use</p>
          <span class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mt-4">
            Commercial
          </span>
        </div>
      </div>
      <!-- Add more default projects as needed -->
    `;
  }

  init() {
    this.loadServices();
    this.loadEquipment();
    this.loadProjects();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const cmsLoader = new CMSLoader();
  cmsLoader.init();
});
