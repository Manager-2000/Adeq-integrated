// dashboard.js - Dashboard-specific functionality

// Global variables
let dashboardData = {
  bookings: [],
  equipment: [],
  testimonials: [],
  services: [],
};

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the dashboard page
  if (document.getElementById("dashboardPage")) {
    initializeDashboard();
  }
});

function initializeDashboard() {
  // Load initial data
  loadDashboardData();

  // Set up dashboard-specific event listeners
  setupQuickActionLinks();
  setupRecentActivityActions();
  setupNavigation();
  setupDataUpdateInterval();
}

function loadDashboardData() {
  // In a real application, this would fetch data from an API
  // For now, we'll use simulated data
  simulateDataLoading();
}

function simulateDataLoading() {
  // Simulate loading data with a delay
  setTimeout(() => {
    // Generate mock data
    dashboardData.bookings = generateMockBookings(5);
    dashboardData.equipment = generateMockEquipmentOrders(12);
    dashboardData.testimonials = generateMockTestimonials(3);
    dashboardData.services = generateMockServices(8);

    // Update the UI with the loaded data
    updateStatsCards();
    updateRecentActivityTable();

    // Show content after data is loaded
    document.getElementById("dashboardContent").classList.remove("opacity-0");
  }, 1000);
}

function generateMockBookings(count) {
  const bookings = [];
  const types = [
    "Residential Survey",
    "Commercial Assessment",
    "Land Mapping",
    "Construction Planning",
  ];
  const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

  for (let i = 0; i < count; i++) {
    bookings.push({
      id: "B" + (1000 + i),
      client: "Client " + (i + 1),
      type: types[Math.floor(Math.random() * types.length)],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 7) * 86400000
      ).toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return bookings;
}

function generateMockEquipmentOrders(count) {
  const orders = [];
  const equipment = [
    "ADMT System",
    "Laser Measure",
    "GPS Unit",
    "Drone Package",
  ];
  const statuses = ["Processing", "Shipped", "Delivered", "On Hold"];

  for (let i = 0; i < count; i++) {
    orders.push({
      id: "EQ" + (2000 + i),
      product: equipment[Math.floor(Math.random() * equipment.length)],
      customer: "Customer " + (i + 1),
      orderDate: new Date(
        Date.now() - Math.floor(Math.random() * 14) * 86400000
      ).toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return orders;
}

function generateMockTestimonials(count) {
  const testimonials = [];
  const companies = [
    "Mining Company",
    "Construction Ltd",
    "Architecture Firm",
    "Property Development",
  ];

  for (let i = 0; i < count; i++) {
    testimonials.push({
      id: "T" + (3000 + i),
      author: "Client " + (i + 1),
      company: companies[Math.floor(Math.random() * companies.length)],
      date: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 86400000
      ).toLocaleDateString(),
      status: Math.random() > 0.5 ? "Approved" : "Pending",
    });
  }

  return testimonials;
}

function generateMockServices(count) {
  const services = [];
  const serviceTypes = [
    "Surveying",
    "Mapping",
    "Consultation",
    "Equipment Rental",
  ];

  for (let i = 0; i < count; i++) {
    services.push({
      id: "S" + (4000 + i),
      name: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      price: "$" + (500 + Math.floor(Math.random() * 2000)),
      status: Math.random() > 0.2 ? "Active" : "Inactive",
    });
  }

  return services;
}

function updateStatsCards() {
  // Update booking count
  const pendingBookings = dashboardData.bookings.filter(
    (b) => b.status === "Pending"
  ).length;
  document
    .querySelectorAll(".stat-card")[0]
    .querySelector("p.text-2xl").textContent = pendingBookings;

  // Update equipment orders count
  document
    .querySelectorAll(".stat-card")[1]
    .querySelector("p.text-2xl").textContent = dashboardData.equipment.length;

  // Update testimonials count
  const newTestimonials = dashboardData.testimonials.filter(
    (t) => t.status === "Pending"
  ).length;
  document
    .querySelectorAll(".stat-card")[2]
    .querySelector("p.text-2xl").textContent = newTestimonials;
}

function updateRecentActivityTable() {
  const tableBody = document.querySelector(".activity-table tbody");
  if (!tableBody) return;

  // Clear existing rows
  tableBody.innerHTML = "";

  // Add recent bookings
  dashboardData.bookings.slice(0, 3).forEach((booking) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="bg-blue-100 p-2 rounded-full">
                        <i class="fas fa-calendar-plus text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Booking</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${booking.client} - ${booking.type}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" class="text-primary hover:text-secondary mr-3 approve-action" data-id="${booking.id}">Approve</a>
                <a href="#" class="text-red-600 hover:text-red-800 delete-action" data-id="${booking.id}">Delete</a>
            </td>
        `;
    tableBody.appendChild(row);
  });

  // Add recent equipment orders
  dashboardData.equipment.slice(0, 2).forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="bg-green-100 p-2 rounded-full">
                        <i class="fas fa-shopping-cart text-green-600"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Order</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${order.product} - ${order.customer}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.orderDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" class="text-primary hover:text-secondary mr-3 approve-action" data-id="${order.id}">Process</a>
                <a href="#" class="text-red-600 hover:text-red-800 delete-action" data-id="${order.id}">Cancel</a>
            </td>
        `;
    tableBody.appendChild(row);
  });

  // Add recent testimonials
  dashboardData.testimonials.slice(0, 2).forEach((testimonial) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="bg-purple-100 p-2 rounded-full">
                        <i class="fas fa-star text-purple-600"></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Testimonial</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${testimonial.author} - ${testimonial.company}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${testimonial.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" class="text-primary hover:text-secondary mr-3 approve-action" data-id="${testimonial.id}">Approve</a>
                <a href="#" class="text-red-600 hover:text-red-800 delete-action" data-id="${testimonial.id}">Delete</a>
            </td>
        `;
    tableBody.appendChild(row);
  });

  // Set up event listeners for the new buttons
  setupRecentActivityActions();
}

function setupQuickActionLinks() {
  // Add any specific behavior for quick action links
  const quickActions = document.querySelectorAll(".quick-action");
  quickActions.forEach((action) => {
    action.addEventListener("click", function (e) {
      e.preventDefault();
      // Handle quick action clicks
      console.log("Quick action clicked:", this.href);
      // In a real app, you might navigate to a specific editor page
      alert(`Redirecting to: ${this.href}`);
    });
  });
}

function setupRecentActivityActions() {
  // Add behavior for recent activity action buttons
  const approveButtons = document.querySelectorAll(".approve-action");
  const deleteButtons = document.querySelectorAll(".delete-action");

  approveButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const itemId = this.dataset.id;
      approveItem(itemId);
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const itemId = this.dataset.id;
      deleteItem(itemId);
    });
  });
}

function setupNavigation() {
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

function setupDataUpdateInterval() {
  // Update data every 30 seconds
  setInterval(() => {
    // Simulate new data
    const newBookings = Math.floor(Math.random() * 3);
    const newOrders = Math.floor(Math.random() * 2);
    const newTestimonials = Math.floor(Math.random() * 2);

    if (newBookings > 0 || newOrders > 0 || newTestimonials > 0) {
      // Add new items to data
      dashboardData.bookings = [
        ...generateMockBookings(newBookings),
        ...dashboardData.bookings,
      ];

      dashboardData.equipment = [
        ...generateMockEquipmentOrders(newOrders),
        ...dashboardData.equipment,
      ];

      dashboardData.testimonials = [
        ...generateMockTestimonials(newTestimonials),
        ...dashboardData.testimonials,
      ];

      // Update the UI
      updateStatsCards();
      updateRecentActivityTable();

      // Show notification
      showNotification(
        `${newBookings} new bookings, ${newOrders} new orders, and ${newTestimonials} new testimonials`
      );
    }
  }, 30000);
}

function approveItem(itemId) {
  console.log("Approving item:", itemId);

  // Find the item in our data
  let item, type;

  if (itemId.startsWith("B")) {
    item = dashboardData.bookings.find((b) => b.id === itemId);
    type = "booking";
  } else if (itemId.startsWith("EQ")) {
    item = dashboardData.equipment.find((e) => e.id === itemId);
    type = "equipment order";
  } else if (itemId.startsWith("T")) {
    item = dashboardData.testimonials.find((t) => t.id === itemId);
    type = "testimonial";
  }

  if (item) {
    item.status = item.status === "Pending" ? "Approved" : "Completed";
    showNotification(`${type} ${itemId} has been approved`);
    updateStatsCards();
    updateRecentActivityTable();
  }
}

function deleteItem(itemId) {
  console.log("Deleting item:", itemId);

  // Find the item in our data
  let type;

  if (itemId.startsWith("B")) {
    dashboardData.bookings = dashboardData.bookings.filter(
      (b) => b.id !== itemId
    );
    type = "booking";
  } else if (itemId.startsWith("EQ")) {
    dashboardData.equipment = dashboardData.equipment.filter(
      (e) => e.id !== itemId
    );
    type = "equipment order";
  } else if (itemId.startsWith("T")) {
    dashboardData.testimonials = dashboardData.testimonials.filter(
      (t) => t.id !== itemId
    );
    type = "testimonial";
  }

  showNotification(`${type} ${itemId} has been deleted`);
  updateStatsCards();
  updateRecentActivityTable();
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 translate-y-[-100px]";
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-y-[-100px]");
    notification.classList.add("translate-y-0");
  }, 10);

  // Animate out after 3 seconds
  setTimeout(() => {
    notification.classList.remove("translate-y-0");
    notification.classList.add("translate-y-[-100px]");

    // Remove from DOM after animation
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Make functions available globally if needed
window.dashboard = {
  approveItem,
  deleteItem,
  showNotification,
};
