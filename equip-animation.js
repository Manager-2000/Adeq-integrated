document.addEventListener("DOMContentLoaded", function () {
  // Loop through each product card with slider images
  document.querySelectorAll(".relative").forEach((container) => {
    const sliders = container.querySelectorAll(".slider-image");
    let index = 0;

    if (sliders.length > 0) {
      sliders[index].classList.add("active");

      setInterval(() => {
        sliders[index].classList.remove("active");
        index = (index + 1) % sliders.length;
        sliders[index].classList.add("active");
      }, 2000);
    }

    // Image popup (per product)
    sliders.forEach((img, i) => {
      img.addEventListener("click", () => {
        const modalImages = Array.from(sliders).map((im) => im.src);
        let modalIndex = i;

        const modal = document.createElement("div");
        modal.classList.add(
          "fixed",
          "inset-0",
          "bg-black/80",
          "flex",
          "items-center",
          "justify-center",
          "z-50"
        );
        modal.innerHTML = `
          <div class="relative">
            <img id="modalImg" src="${modalImages[modalIndex]}" class="max-h-[80vh] rounded-lg shadow-lg">
            <button id="closeModal" class="absolute top-2 right-2 text-white text-2xl">&times;</button>
            <button id="prevImg" class="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl">&#10094;</button>
            <button id="nextImg" class="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl">&#10095;</button>
          </div>
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector("#modalImg");

        // close
        modal
          .querySelector("#closeModal")
          .addEventListener("click", () => modal.remove());
        // prev
        modal.querySelector("#prevImg").addEventListener("click", () => {
          modalIndex =
            (modalIndex - 1 + modalImages.length) % modalImages.length;
          modalImg.src = modalImages[modalIndex];
        });
        // next
        modal.querySelector("#nextImg").addEventListener("click", () => {
          modalIndex = (modalIndex + 1) % modalImages.length;
          modalImg.src = modalImages[modalIndex];
        });
      });
    });
  });
});

// veiw more equipment
document.addEventListener("DOMContentLoaded", function () {
  const viewMoreBtn = document.getElementById("viewMoreBtn");
  const grid = document.querySelector("#equipment .grid");

  if (!viewMoreBtn || !grid) {
    console.warn("View more button or equipment grid not found.");
    return;
  }

  // select direct children of the grid (your product cards)
  const cards = Array.from(grid.querySelectorAll(":scope > div"));

  // if there are <= 3 cards there's nothing to hide
  if (cards.length <= 3) {
    viewMoreBtn.style.display = "none";
    return;
  }

  // Hide items from index 3 onward (0-based)
  cards.forEach((card, idx) => {
    card.classList.add("equipment-item"); // optional: mark them
    if (idx >= 3) {
      // use Tailwind 'hidden' class so layout remains consistent
      card.classList.add("hidden", "hidden-equipment");
    }
  });

  // set initial state
  viewMoreBtn.setAttribute("data-expanded", "false");
  viewMoreBtn.innerHTML =
    'View All Equipment <i class="fas fa-arrow-down ml-2"></i>';

  // Toggle handler
  viewMoreBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const expanded = viewMoreBtn.getAttribute("data-expanded") === "true";

    if (!expanded) {
      // show hidden items
      cards.forEach((card, idx) => {
        if (idx >= 3) card.classList.remove("hidden");
      });
      viewMoreBtn.setAttribute("data-expanded", "true");
      viewMoreBtn.innerHTML =
        'View Less Equipment <i class="fas fa-arrow-up ml-2"></i>';
      // optional: scroll to newly revealed area smoothly
      // grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // hide them again
      cards.forEach((card, idx) => {
        if (idx >= 3) card.classList.add("hidden");
      });
      viewMoreBtn.setAttribute("data-expanded", "false");
      viewMoreBtn.innerHTML =
        'View All Equipment <i class="fas fa-arrow-down ml-2"></i>';
      // scroll back to top of equipment section so user sees the first three
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
