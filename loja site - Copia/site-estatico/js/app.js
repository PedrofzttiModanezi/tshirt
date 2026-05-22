(function () {
  "use strict";

  var STORAGE_KEY = "street-tees-cart-html";
  var WHATSAPP_NUMBER = "5515997861572";

  var PRODUCTS = [
    {
      id: "p1",
      name: "SUNNY DAY",
      model: "Oversized · 100% algodão",
      description:
        "Corte largo, gola canelada grossa. Ideal para dias ensolarados.",
      priceCents: 12990,
      imageUrl: "loja site - Copia/site-estatico/images/1.png",
      backImageUrl: "loja site - Copia/site-estatico/images/2.png",
      collection: "nature-over",
    },
    {
      id: "p2",
      name: "NATURE VIBES",
      model: "Oversized · 100% algodão",
      description:
        "Estampa frontal minimalista, vibe floresta. Perfeita para dias frescos.",
      priceCents: 9990,
      imageUrl: "loja site - Copia/site-estatico/images/3.png",
      backImageUrl: "loja site - Copia/site-estatico/images/4.png",
      collection: "nature-over",
    },
    {
      id: "p3",
      name: "OCEAN DEPTHS",
      model: "Oversized · 100% algodão",
      description:
        "Detalhes em azul claro + base escura. Combina com cargo e tênis chunky.",
      priceCents: 11990,
      imageUrl: "loja site - Copia/site-estatico/images/5.png",
      backImageUrl: "loja site - Copia/site-estatico/images/6.png",
      collection: "nature-over",
    },
    {
      id: "p4",
      name: "ROCK SOLID",
      model: "Oversized · 100% algodão",
      description:
        "Logo pequeno no peito, estética clean. Marrom terra, relembrando sua força.",
      priceCents: 10990,
      imageUrl: "loja site - Copia/site-estatico/images/7.png",
      backImageUrl: "loja site - Copia/site-estatico/images/8.png",
      collection: "nature-over",
    },
    {
      id: "p5",
      name: "FLOWER FEELINGS",
      model: "Oversized · 100% algodão",
      description:
        "Base clara pra contrastar com calça escura. Estampa nas costas pensada na sua fé.",
      priceCents: 10490,
      imageUrl: "loja site - Copia/site-estatico/images/9.png",
      backImageUrl: "loja site - Copia/site-estatico/images/10.png",
      collection: "nature-over",
    },
    {
      id: "p6",
      name: "FIREBALL SPIRIT",
      model: "Oversized · 100% algodão",
      description:
        "Palheta vermelha com detalhes em preto. Cada peça varia levemente — autenticidade street.",
      priceCents: 13990,
      imageUrl: "loja site - Copia/site-estatico/images/11.png",
      backImageUrl: "loja site - Copia/site-estatico/images/12.png",
      collection: "nature-over",
    },
    {
      id: "p7",
      name: "FROSTED CREW",
      model: "Moletom unissex · interior felpa",
      description:
        "Aquece com estilo urbano e estampa discreta. Perfeito para noites de inverno.",
      priceCents: 17990,
      imageUrl: "loja site - Copia/site-estatico/images/13.png",
      backImageUrl: "loja site - Copia/site-estatico/images/14.png",
      collection: "winter-tide",
    },
    {
      id: "p8",
      name: "ARCTIC HYPE",
      model: "Moletom com capuz · algodão premium",
      description:
        "Corte oversized e capuz ajustável para looks quentes e contemporâneos.",
      priceCents: 18990,
      imageUrl: "loja site - Copia/site-estatico/images/15.png",
      backImageUrl: "loja site - Copia/site-estatico/images/16.png",
      collection: "winter-tide",
    },
    {
      id: "p9",
      name: "SALT LAKE",
      model: "Moletom com bolso canguru · felpa pesada",
      description:
        "Design minimalista com toque confortável, ideal para o clima frio da cidade.",
      priceCents: 16490,
      imageUrl: "loja site - Copia/site-estatico/images/17.png",
      backImageUrl: "loja site - Copia/site-estatico/images/18.png",
      collection: "winter-tide",
    },
  ];

  function formatBRL(cents) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  }

  function createWhatsappMessage(items) {
    var lines = ["Olá, gostaria de fazer um pedido:", ""];
    var subtotal = 0;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var total = item.priceCents * item.quantity;
      subtotal += total;
      lines.push(
        i + 1 + ". " +
          item.quantity +
          "x " +
          item.name +
          " (" +
          item.model +
          ") — " +
          formatBRL(total),
      );
    }

    lines.push("", "Subtotal: " + formatBRL(subtotal));
    lines.push("", "Por favor, me envie as instruções de pagamento.");
    return encodeURIComponent(lines.join("\n"));
  }

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(lines) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  var cart = loadCart();

  var elGridNature = document.getElementById("product-grid");
  var elGridWinter = document.getElementById("product-grid-winter-tide");
  var elCollections = document.getElementById("colecoes");
  var elBadge = document.getElementById("cart-badge");
  var elBackdrop = document.getElementById("cart-backdrop");
  var elDrawer = document.getElementById("cart-drawer");
  var elLines = document.getElementById("cart-lines");
  var elSubtotal = document.getElementById("cart-subtotal");
  var elToast = document.getElementById("toast");
  var elCheckoutMsg = document.getElementById("checkout-msg");

  var toastTimer = null;

  function itemCount() {
    var n = 0;
    for (var i = 0; i < cart.length; i++) n += cart[i].quantity;
    return n;
  }

  function subtotalCents() {
    var s = 0;
    for (var i = 0; i < cart.length; i++) {
      s += cart[i].priceCents * cart[i].quantity;
    }
    return s;
  }

  function persist() {
    saveCart(cart);
    updateBadge();
    renderCartLines();
    elSubtotal.textContent = formatBRL(subtotalCents());
  }

  function updateBadge() {
    var n = itemCount();
    elBadge.hidden = n === 0;
    elBadge.textContent = n > 99 ? "99+" : String(n);
  }

  function showToast(message) {
    elToast.textContent = message;
    elToast.hidden = false;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      elToast.hidden = true;
      toastTimer = null;
    }, 3200);
  }

  function openCart() {
    elBackdrop.hidden = false;
    elDrawer.hidden = false;
    elBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    renderCartLines();
    elCheckoutMsg.hidden = true;
  }

  function closeCart() {
    elBackdrop.hidden = true;
    elDrawer.hidden = true;
    elBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function addToCart(productId) {
    var p = findProduct(productId);
    if (!p) return;
    var found = -1;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId) {
        found = i;
        break;
      }
    }
    if (found >= 0) {
      cart[found].quantity += 1;
    } else {
      cart.push({
        productId: p.id,
        name: p.name,
        model: p.model,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl,
        quantity: 1,
      });
    }
    persist();
    showToast(p.name + " · adicionado ao carrinho");
  }

  function setQuantity(productId, qty) {
    var q = Math.min(99, Math.max(1, parseInt(qty, 10) || 1));
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId === productId) {
        cart[i].quantity = q;
        persist();
        return;
      }
    }
  }

  function removeLine(productId) {
    var next = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].productId !== productId) next.push(cart[i]);
    }
    cart = next;
    persist();
  }

  function clearCart() {
    cart = [];
    persist();
  }

  function renderProducts() {
    elGridNature.innerHTML = "";
    elGridWinter.innerHTML = "";
    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];
      var li = document.createElement("li");
      li.innerHTML =
        '<article class="card">' +
        '<div class="card__media">' +
        '<div class="card__image-swap">' +
        '<img class="card__image card__image--front" src="' +
        escapeAttr(p.imageUrl) +
        '" alt="' +
        escapeAttr(p.name) +
        ' frente" loading="lazy" width="600" height="750" />' +
        '<img class="card__image card__image--back" src="' +
        escapeAttr(p.backImageUrl || p.imageUrl) +
        '" alt="' +
        escapeAttr(p.name) +
        ' costa" loading="lazy" width="600" height="750" />' +
        '</div>' +
        "</div>" +
        '<div class="card__body">' +
        '<h2 class="card__title">' +
        escapeHtml(p.name) +
        "</h2>" +
        '<p class="card__model">' +
        escapeHtml(p.model) +
        "</p>" +
        '<p class="card__desc">' +
        escapeHtml(p.description) +
        "</p>" +
        '<div class="card__footer">' +
        '<span class="card__price">' +
        formatBRL(p.priceCents) +
        "</span>" +
        '<button type="button" class="btn btn--primary btn-add" data-id="' +
        escapeAttr(p.id) +
        '">Adicionar ao carrinho</button>' +
        "</div>" +
        "</div>" +
        "</article>";
      var targetGrid = p.collection === "winter-tide" ? elGridWinter : elGridNature;
      targetGrid.appendChild(li);
    }
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function renderCartLines() {
    if (cart.length === 0) {
      elLines.innerHTML =
        '<p class="cart-drawer__empty">Seu carrinho tá vazio. Bora escolher uma camiseta?</p>';
      return;
    }

    var html = '<ul class="cart-lines">';
    for (var i = 0; i < cart.length; i++) {
      var line = cart[i];
      var thumb = line.imageUrl
        ? '<img src="' +
          escapeAttr(line.imageUrl) +
          '" alt="" width="64" height="80" />'
        : '<span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:1.5rem;opacity:.5;">ðŸ‘•</span>';

      html +=
        '<li class="cart-line">' +
        '<div class="cart-line__thumb">' +
        thumb +
        "</div>" +
        '<div class="cart-line__info">' +
        '<p class="cart-line__name">' +
        escapeHtml(line.name) +
        "</p>" +
        '<p class="cart-line__model">' +
        escapeHtml(line.model) +
        "</p>" +
        '<p class="cart-line__unit">' +
        formatBRL(line.priceCents) +
        " · unidade</p>" +
        '<div class="cart-line__controls">' +
        '<div class="qty">' +
        '<button type="button" aria-label="Diminuir" data-action="dec" data-id="' +
        escapeAttr(line.productId) +
        '">-</button>' +
        '<input type="number" min="1" max="99" aria-label="Quantidade" data-qty="' +
        escapeAttr(line.productId) +
        '" value="' +
        line.quantity +
        '" />' +
        '<button type="button" aria-label="Aumentar" data-action="inc" data-id="' +
        escapeAttr(line.productId) +
        '">+</button>' +
        "</div>" +
        '<button type="button" class="cart-line__remove" data-remove="' +
        escapeAttr(line.productId) +
        '">Remover</button>' +
        "</div>" +
        "</div>" +
        "</li>";
    }
    html += "</ul>";
    elLines.innerHTML = html;
  }

  elLines.addEventListener("click", function (e) {
    var dec = e.target.closest("[data-action=dec]");
    var inc = e.target.closest("[data-action=inc]");
    var rem = e.target.closest("[data-remove]");
    if (dec) {
      var id = dec.getAttribute("data-id");
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === id) {
          if (cart[i].quantity <= 1) removeLine(id);
          else setQuantity(id, cart[i].quantity - 1);
          break;
        }
      }
      return;
    }
    if (inc) {
      var id2 = inc.getAttribute("data-id");
      for (var j = 0; j < cart.length; j++) {
        if (cart[j].productId === id2) {
          setQuantity(id2, cart[j].quantity + 1);
          break;
        }
      }
      return;
    }
    if (rem) {
      removeLine(rem.getAttribute("data-remove"));
    }
  });

  elLines.addEventListener("change", function (e) {
    var inp = e.target;
    if (inp.tagName !== "INPUT" || !inp.getAttribute("data-qty")) return;
    var pid = inp.getAttribute("data-qty");
    var val = parseInt(inp.value, 10);
    if (isNaN(val) || val < 1) {
      inp.value = "1";
      setQuantity(pid, 1);
      return;
    }
    setQuantity(pid, val);
    renderCartLines();
    elSubtotal.textContent = formatBRL(subtotalCents());
  });

  elCollections.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-add");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    if (id) addToCart(id);
  });

  document.getElementById("btn-open-cart").addEventListener("click", openCart);

  /** Fechar: captura no documento evita clique "perdido" por sobreposição / bolha */
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (!t.closest("#btn-close-cart")) return;
      e.preventDefault();
      e.stopPropagation();
      closeCart();
    },
    true
  );

  elBackdrop.addEventListener("click", function (e) {
    if (e.target === elBackdrop) closeCart();
  });

  document.getElementById("btn-clear-cart").addEventListener("click", function () {
    clearCart();
    elCheckoutMsg.hidden = true;
  });

  document.getElementById("btn-checkout").addEventListener("click", function () {
    elCheckoutMsg.hidden = false;
    if (cart.length === 0) {
      elCheckoutMsg.textContent = "Adicione pelo menos um item.";
      return;
    }

    var message = createWhatsappMessage(cart);
    var whatsappUrl =
      "https://wa.me/" +
      WHATSAPP_NUMBER.replace(/\D/g, "") +
      "?text=" +
      message;

    elCheckoutMsg.style.background = "rgba(21, 94, 117, 0.35)";
    elCheckoutMsg.style.color = "#a5f3fc";
    elCheckoutMsg.textContent = "Redirecionando para o WhatsApp...";

    window.location.href = whatsappUrl;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !elDrawer.hidden) closeCart();
  });

  renderProducts();
  persist();
})();

