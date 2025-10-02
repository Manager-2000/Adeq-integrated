// services-loader.js - Simple dynamic services loader
class ServicesLoader {
  constructor() {
    this.servicesData = null;
  }

  // Load services from JSON file
  async loadServices() {
    try {
      const response = await fetch("/data/services.json");
      const data = await response.json();
      this.servicesData = data.services;
      this.renderServices();
    } catch (error) {
      console.error("Failed to load services:", error);
      this.loadDefaultServices();
    }
  }

  // Render services to the page
  renderServices() {
    const container = document.getElementById("services-container");
    if (!container || !this.servicesData) return;

    container.innerHTML = this.servicesData
      .map(
        (service) => `
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="${service.icon} text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">${service.title}</h3>
        <p class="text-gray-600 mb-4">${service.description}</p>
        <a href="${service.link}" class="text-accent font-medium flex items-center">
          ${service.linkText} <i class="fas fa-arrow-right ml-2"></i>
        </a>
      </div>
    `
      )
      .join("");

    console.log("✅ Services loaded dynamically");
  }

  // Fallback to default services if JSON fails
  loadDefaultServices() {
    const container = document.getElementById("services-container");
    if (!container) return;

    container.innerHTML = `
      <!-- Service 1 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-search-dollar text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Water Surveying</h3>
        <p class="text-gray-600 mb-4">
          Professional groundwater and mining surveys using advanced
          technology to accurately locate water sources.
        </p>
        <a href="#booking" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>

      <!-- Service 2 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-toolbox text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">
          Borehole Drilling
        </h3>
        <p class="text-gray-600 mb-4">
          Expert borehole drilling services for residential, commercial, and
          agricultural water supply needs.
        </p>
        <a href="#booking" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>

      <!-- Service 3 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-wrench text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Installation</h3>
        <p class="text-gray-600 mb-4">
          Complete pump and borehole installation services to ensure
          efficient water delivery to your property.
        </p>
        <a href="#booking" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>

      <!-- Service 4 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-industry text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Equipment Sales</h3>
        <p class="text-gray-600 mb-4">
          We offer top-quality groundwater survey equipment including ADMT
          systems and pool finders.
        </p>
        <a href="#equipment" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>

      <!-- Service 5 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-tint text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Water Tanks</h3>
        <p class="text-gray-600 mb-4">
          Installation of overhead water storage tanks from 4,000 to 40,000+
          liters for reliable water storage.
        </p>
        <a href="#contact" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>

      <!-- Service 6 -->
      <div class="bg-light p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-2">
        <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <i class="fas fa-headset text-2xl"></i>
        </div>
        <h3 class="text-xl font-bold text-primary mb-3">Consultation</h3>
        <p class="text-gray-600 mb-4">
          Get expert advice on the best water solutions for your specific
          needs and location.
        </p>
        <a href="#contact" class="text-accent font-medium flex items-center"
          >Learn more <i class="fas fa-arrow-right ml-2"></i
        ></a>
      </div>
    `;

    console.log("✅ Default services loaded");
  }

  // Initialize the services loader
  init() {
    this.loadServices();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const servicesLoader = new ServicesLoader();
  servicesLoader.init();
});
