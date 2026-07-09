const storageKey = "fullTankCart";
const deliveryThreshold = 600;
const deliveryFee = 60;

const products = [
  {
    id: "scuba-tracksuit",
    name: "Scuba Streetwear Tracksuit",
    type: "Tracksuit",
    category: "tracksuits",
    price: 300,
    description: "A complete streetwear set with a clean FULL TANK look and relaxed everyday comfort.",
    badge: "Best seller",
    stock: "In stock",
    fit: "Relaxed set",
    material: "Soft streetwear fleece",
    featured: true,
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Black", image: "scuba Streetwear Tracksuit/R300.jpg" },
      { name: "Graphite", image: "scuba Streetwear Tracksuit/741013351_1004830838987822_966475086576234290_n.jpg" }
    ]
  },
  {
    id: "signature-hoodie",
    name: "Signature Hoodie",
    type: "Hoodie",
    category: "hoodies",
    price: 300,
    description: "Warm fleece, bold front branding, and a fit made for layering.",
    badge: "New colours",
    stock: "In stock",
    fit: "Regular to oversized",
    material: "Premium fleece blend",
    featured: true,
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Black", image: "Hoodies/BLACK.jpg" },
      { name: "Blue", image: "Hoodies/BLUE.png" },
      { name: "White", image: "Hoodies/WHITE FRONT.png" },
      { name: "Red", image: "Hoodies/RED.png" },
      { name: "Pink", image: "Hoodies/PINK.png" },
      { name: "Grey", image: "Hoodies/GREY.png" }
    ]
  },
  {
    id: "full-tank-tshirt",
    name: "FULL TANK T-Shirt",
    type: "T-Shirt",
    category: "t-shirts",
    price: 180,
    description: "Soft cotton tee with a clean streetwear fit for daily rotation.",
    badge: "Everyday essential",
    stock: "In stock",
    fit: "Regular fit",
    material: "Cotton feel jersey",
    featured: true,
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Black", image: "T - SHIRTS/front.jpg" },
      { name: "Blue", image: "T - SHIRTS/BLUE FRONT.png" },
      { name: "White", image: "T - SHIRTS/671288190_932150109589229_3068946505125500257_n.jpg" }
    ]
  },
  {
    id: "full-tank-cap",
    name: "FULL TANK Cap",
    type: "Cap",
    category: "caps",
    price: 180,
    description: "Structured cap with adjustable streetwear styling and bold brand presence.",
    badge: "Accessory",
    stock: "In stock",
    fit: "Adjustable",
    material: "Structured cotton twill",
    featured: true,
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Black", image: "Caps/736593112_1000301816107391_978307785066684734_n.jpg" },
      { name: "Pink", image: "Caps/PINK.png" },
      { name: "Cream", image: "Caps/R180.png" }
    ]
  },
  {
    id: "barnie-drop",
    name: "Barnie Drop",
    type: "Barnie",
    category: "barnie",
    price: 120,
    description: "A bold FULL TANK Barnie piece for finishing the outfit with attitude.",
    badge: "Limited style",
    stock: "Limited stock",
    fit: "Easy everyday fit",
    material: "Soft casual fabric",
    featured: true,
    sizes: ["Small", "Medium", "Large"],
    colors: [
      { name: "Black", image: "Barnie/background-remover-1783595070268.png" },
      { name: "Grey", image: "Barnie/741092674_1005521738918732_4446661250432703074_n.jpg" },
      { name: "Cream", image: "Barnie/703064732_964748286329411_4245490186207635809_n.jpg" },
      { name: "Pink", image: "Barnie/741416076_1004959865641586_2014291967593515706_n.jpg" }
    ]
  }
];

let cart = loadCart();
let activeFilter = "all";
let searchTerm = "";
let sortMode = "featured";

function loadCart() {
  try {
    const savedCart = localStorage.getItem(storageKey);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(storageKey, JSON.stringify(cart));
}

function formatMoney(amount) {
  return Number(amount).toFixed(2);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getDeliveryCost() {
  const subtotal = getCartSubtotal();
  return subtotal > 0 && subtotal < deliveryThreshold ? deliveryFee : 0;
}

function getCartTotal() {
  return getCartSubtotal() + getDeliveryCost();
}

function getProduct(productId) {
  return products.find(product => product.id === productId);
}

function createOptions(options) {
  return options.map(option => `<option value="${option.name || option}">${option.name || option}</option>`).join("");
}

function createSwatches(product) {
  return product.colors.map(color => `<span title="${color.name}" aria-label="${color.name}" style="background-image: url('${color.image}')"></span>`).join("");
}

function getVisibleProducts(mode) {
  let list = mode === "featured" ? products.filter(product => product.featured).slice(0, 4) : [...products];

  if (mode !== "featured" && activeFilter !== "all") {
    list = list.filter(product => product.category === activeFilter);
  }

  if (mode !== "featured" && searchTerm) {
    const query = searchTerm.toLowerCase();
    list = list.filter(product => {
      return [
        product.name,
        product.type,
        product.category,
        product.description,
        product.colors.map(color => color.name).join(" ")
      ].join(" ").toLowerCase().includes(query);
    });
  }

  if (mode !== "featured") {
    list.sort((a, b) => {
      if (sortMode === "price-low") {
        return a.price - b.price;
      }
      if (sortMode === "price-high") {
        return b.price - a.price;
      }
      if (sortMode === "name") {
        return a.name.localeCompare(b.name);
      }
      return Number(b.featured) - Number(a.featured);
    });
  }

  return list;
}

function renderProductCard(product) {
  const firstColor = product.colors[0];

  return `
    <article class="product-card" data-product-id="${product.id}" data-category="${product.category}">
      <div class="product-media">
        <img src="${firstColor.image}" alt="${product.name} in ${firstColor.name}" data-product-image>
        <span class="product-type">${product.type}</span>
        <span class="product-badge">${product.badge}</span>
      </div>
      <div class="product-copy">
        <div class="product-meta">
          <h3>${product.name}</h3>
          <p class="price">R${formatMoney(product.price)}</p>
        </div>
        <p>${product.description}</p>
        <div class="swatches" aria-label="${product.name} available colours">${createSwatches(product)}</div>
        <ul class="product-details">
          <li>${product.stock}</li>
          <li>${product.fit}</li>
          <li>${product.material}</li>
        </ul>
      </div>
      <div class="product-options">
        <label>
          Colour
          <select class="product-color-select" aria-label="Choose ${product.name} colour">
            ${createOptions(product.colors)}
          </select>
        </label>
        <label>
          Size
          <select class="product-size-select" aria-label="Choose ${product.name} size">
            ${createOptions(product.sizes)}
          </select>
        </label>
      </div>
      <button type="button" data-add-product="${product.id}">Add to Bag</button>
    </article>
  `;
}

function renderProductGrids() {
  document.querySelectorAll("[data-product-grid]").forEach(grid => {
    const mode = grid.dataset.productGrid;
    const list = getVisibleProducts(mode);

    grid.innerHTML = list.length
      ? list.map(renderProductCard).join("")
      : `<div class="empty-state wide">No products match that search. Try another category or keyword.</div>`;
  });
}

function setActiveFilter(category) {
  activeFilter = category || "all";
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === activeFilter);
  });
  renderProductGrids();
}

function readInitialFilter() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const allowed = ["all", ...new Set(products.map(product => product.category))];
  return allowed.includes(category) ? category : "all";
}

function updateProductImage(select) {
  const card = select.closest("[data-product-id]");
  const product = getProduct(card.dataset.productId);
  const image = card.querySelector("[data-product-image]");
  const selected = product.colors.find(color => color.name === select.value) || product.colors[0];

  image.src = selected.image;
  image.alt = `${product.name} in ${selected.name}`;
}

function addProductToCart(productId, card) {
  const product = getProduct(productId);
  if (!product || !card) {
    return;
  }

  const colorName = card.querySelector(".product-color-select").value;
  const size = card.querySelector(".product-size-select").value;
  const color = product.colors.find(option => option.name === colorName) || product.colors[0];
  const existing = cart.find(item => item.id === product.id && item.color === color.name && item.size === size);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      color: color.name,
      size,
      image: color.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  renderCart();
  renderCheckout();
  showToast(`${product.name} added in ${color.name}, ${size}.`);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(element => {
    element.textContent = count;
  });
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-subtotal");
  const deliveryElement = document.getElementById("cart-delivery");
  const totalElement = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cartItems || !totalElement) {
    return;
  }

  cartItems.innerHTML = cart.length
    ? cart.map((item, index) => renderCartLine(item, index)).join("")
    : `<div class="empty-state">Your bag is empty. Add pieces from the shop to get started.</div>`;

  if (subtotalElement) {
    subtotalElement.textContent = formatMoney(getCartSubtotal());
  }

  if (deliveryElement) {
    deliveryElement.textContent = formatMoney(getDeliveryCost());
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

  totalElement.textContent = formatMoney(getCartTotal());
}

function renderCartLine(item, index, compact = false) {
  const lineTotal = item.price * item.quantity;
  const controls = compact
    ? ""
    : `
      <div class="quantity-actions">
        <div class="quantity-controls" aria-label="Change quantity">
          <button class="quantity-btn" type="button" data-cart-action="decrease" data-cart-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" type="button" data-cart-action="increase" data-cart-index="${index}">+</button>
        </div>
        <button class="remove-btn" type="button" data-cart-action="remove" data-cart-index="${index}">Remove</button>
      </div>
    `;

  return `
    <article class="cart-line">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${item.color} / ${item.size}</p>
        <p>Qty ${item.quantity}</p>
      </div>
      <div class="line-actions">
        <strong>R${formatMoney(lineTotal)}</strong>
        ${controls}
      </div>
    </article>
  `;
}

function changeCartItem(action, index) {
  const item = cart[index];
  if (!item) {
    return;
  }

  if (action === "increase") {
    item.quantity += 1;
  }

  if (action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  if (action === "remove") {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartCount();
  renderCart();
  renderCheckout();
}

function renderCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutDelivery = document.getElementById("checkout-delivery");
  const checkoutTotal = document.getElementById("checkout-total");
  const checkoutForm = document.getElementById("checkout-form");

  if (!checkoutItems || !checkoutTotal) {
    return;
  }

  checkoutItems.innerHTML = cart.length
    ? cart.map((item, index) => renderCartLine(item, index, true)).join("")
    : `<div class="empty-state">Your bag is empty. Add products before checkout.</div>`;

  checkoutSubtotal.textContent = formatMoney(getCartSubtotal());
  checkoutDelivery.textContent = formatMoney(getDeliveryCost());
  checkoutTotal.textContent = formatMoney(getCartTotal());

  if (checkoutForm) {
    checkoutForm.querySelectorAll("input, select, textarea, button").forEach(field => {
      field.disabled = cart.length === 0;
    });
    syncPaymentPanels();
  }
}

function completePayment(event) {
  event.preventDefault();

  const statusMessage = document.getElementById("payment-status");
  const method = document.querySelector('input[name="payment-method"]:checked');

  if (!cart.length) {
    statusMessage.textContent = "Your bag is empty. Add items before payment.";
    statusMessage.className = "error-message";
    return;
  }

  if (!method) {
    statusMessage.textContent = "Choose Stripe or Ozow to continue.";
    statusMessage.className = "error-message";
    return;
  }

  const orderNumber = `FT-${Math.floor(100000 + Math.random() * 900000)}`;
  statusMessage.textContent = `Demo ${method.value} payment approved. Order ${orderNumber} is ready for fulfilment.`;
  statusMessage.className = "success-message";
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  renderCheckout();
  syncPaymentPanels();
}

function syncPaymentPanels() {
  const selected = document.querySelector('input[name="payment-method"]:checked');
  if (!selected) {
    return;
  }

  document.querySelectorAll("[data-gateway-panel]").forEach(panel => {
    const isActive = panel.dataset.gatewayPanel === selected.value;
    panel.classList.toggle("hidden", !isActive);
    panel.querySelectorAll("input, select, textarea").forEach(field => {
      field.disabled = !isActive || cart.length === 0;
    });
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function setupAuth() {
  const tabs = document.querySelectorAll("[data-auth-tab]");
  const panels = document.querySelectorAll("[data-auth-panel]");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(item => item.classList.toggle("active", item === tab));
      panels.forEach(panel => panel.classList.toggle("active", panel.dataset.authPanel === tab.dataset.authTab));
    });
  });

  panels.forEach(panel => {
    panel.addEventListener("submit", event => {
      event.preventDefault();
      const status = panel.querySelector(".auth-status");
      const isSignup = panel.dataset.authPanel === "signup";
      status.textContent = isSignup
        ? "Demo account created. You can now continue shopping."
        : "Demo login successful. Welcome back to FULL TANK.";
      status.className = "auth-status success-message";
    });
  });
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) {
    return;
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const status = form.querySelector(".contact-status");
    status.textContent = "Demo message sent. FULL TANK support will respond soon.";
    status.className = "contact-status success-message";
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const searchInput = document.querySelector("[data-shop-search]");
  const sortSelect = document.querySelector("[data-shop-sort]");

  searchTerm = searchInput ? searchInput.value.trim() : "";
  sortMode = sortSelect ? sortSelect.value : "featured";

  setActiveFilter(readInitialFilter());
  updateCartCount();
  renderCart();
  renderCheckout();
  setupAuth();
  setupContactForm();
  syncPaymentPanels();

  document.addEventListener("input", event => {
    if (event.target.matches("[data-shop-search]")) {
      searchTerm = event.target.value.trim();
      renderProductGrids();
    }
  });

  document.addEventListener("change", event => {
    if (event.target.matches(".product-color-select")) {
      updateProductImage(event.target);
    }

    if (event.target.matches("[data-shop-sort]")) {
      sortMode = event.target.value;
      renderProductGrids();
    }

    if (event.target.matches('input[name="payment-method"]')) {
      syncPaymentPanels();
    }
  });

  document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add-product]");
    const cartButton = event.target.closest("[data-cart-action]");
    const filterButton = event.target.closest("[data-filter]");

    if (addButton) {
      const card = addButton.closest("[data-product-id]");
      addProductToCart(addButton.dataset.addProduct, card);
    }

    if (cartButton) {
      changeCartItem(cartButton.dataset.cartAction, Number(cartButton.dataset.cartIndex));
    }

    if (filterButton) {
      setActiveFilter(filterButton.dataset.filter);
      history.replaceState(null, "", filterButton.dataset.filter === "all" ? "clothes.html" : `clothes.html?category=${filterButton.dataset.filter}`);
    }
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length) {
        window.location.href = "checkout.html";
      }
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", completePayment);
  }
});
