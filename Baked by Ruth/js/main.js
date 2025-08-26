// Make cart modal's Checkout button go to checkout.html
document.addEventListener('DOMContentLoaded', function() {
  var checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.onclick = function(e) {
      e.preventDefault();
      window.location.href = 'checkout.html';
    };
  }
});
// Baked by Ruth - Main JavaScript
// Responsive mobile menu, form validation, scroll-to-top, and dark mode toggle

document.addEventListener('DOMContentLoaded', function() {
  // --- Cart System ---
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  const cartCount = document.getElementById('cart-count');
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalDiv = document.getElementById('cart-total');
  const closeCartBtn = document.getElementById('close-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  function updateCartCount() {
    if (cartCount) {
      const count = cart.reduce((sum, item) => sum + item.qty, 0);
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'inline-block' : 'none';
    }
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function renderCart() {
    if (!cartItemsDiv || !cartTotalDiv) return;
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
      cartTotalDiv.textContent = '';
      checkoutBtn.style.display = 'none';
      return;
    }
    let html = '<ul style="list-style:none;padding:0;">';
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
        let qtyLabel = '';
        if (item.name.includes('(Dozen)')) {
          qtyLabel = ' dozen';
        } else if (item.name.includes('(Tray)')) {
          qtyLabel = ' tray';
        } else if (item.name.includes('(Whole)')) {
          qtyLabel = ' whole';
        }
        html += `<li style="margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;">
          <span style="flex:1;">${item.name}</span>
          <div style="display:flex;align-items:center;gap:0.25rem;">
            <button data-idx="${idx}" class="qty-btn minus" style="background:#eee;border:none;padding:0.2rem 0.5rem;border-radius:0.3rem;font-size:1rem;cursor:pointer;">-</button>
            <input type="number" min="1" value="${item.qty}" data-idx="${idx}" class="qty-input" style="width:2.5rem;text-align:center;border:1px solid #ccc;border-radius:0.3rem;" />${qtyLabel}
            <button data-idx="${idx}" class="qty-btn plus" style="background:#eee;border:none;padding:0.2rem 0.5rem;border-radius:0.3rem;font-size:1rem;cursor:pointer;">+</button>
          </div>
          <span style="width:4rem;text-align:right;">R${item.price * item.qty}</span>
          <button data-idx="${idx}" class="remove-cart-item" style="background:none;border:none;color:#d4183d;font-size:1.2rem;cursor:pointer;">&times;</button>
        </li>`;
    });
    html += '</ul>';
    cartItemsDiv.innerHTML = html;
    cartTotalDiv.textContent = `Total: R${total}`;
    checkoutBtn.style.display = 'block';
  }

  function showCart() {
    if (cartModal) cartModal.style.display = 'flex';
    renderCart();
  }
  function hideCart() {
    if (cartModal) cartModal.style.display = 'none';
  }

  // Add to Cart button logic
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const name = btn.getAttribute('data-product');
      const price = parseFloat(btn.getAttribute('data-price'));
      const existing = cart.find(item => item.name === name && item.price === price);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      saveCart();
      updateCartCount();
      showAddToCartNotification(name);
    });


  // Add to Cart notification
  function showAddToCartNotification(productName) {
    let notif = document.getElementById('add-to-cart-notif');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'add-to-cart-notif';
      notif.style.position = 'fixed';
      notif.style.top = '2rem';
      notif.style.right = '2rem';
      notif.style.background = '#b45309';
      notif.style.color = '#fff';
      notif.style.padding = '1rem 2rem';
      notif.style.borderRadius = '0.5rem';
      notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      notif.style.zIndex = '3000';
      notif.style.fontWeight = '600';
      notif.style.fontSize = '1rem';
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s';
      document.body.appendChild(notif);
    }
    notif.textContent = `Added "${productName}" to cart!`;
    notif.style.opacity = '1';
    setTimeout(() => {
      notif.style.opacity = '0';
    }, 1800);
  }
  });

  if (cartBtn) {
    cartBtn.addEventListener('click', showCart);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', hideCart);
  }
  if (cartModal) {
    cartModal.addEventListener('click', function(e) {
      if (e.target === cartModal) hideCart();
    });
  }

  // Remove item from cart
  if (cartItemsDiv) {
    cartItemsDiv.addEventListener('click', function(e) {
      // Remove item
      if (e.target.classList.contains('remove-cart-item')) {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        cart.splice(idx, 1);
        saveCart();
        updateCartCount();
        renderCart();
      }
      // Quantity plus/minus
      if (e.target.classList.contains('qty-btn')) {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        if (e.target.classList.contains('plus')) {
          cart[idx].qty += 1;
        } else if (e.target.classList.contains('minus')) {
          if (cart[idx].qty > 1) {
            cart[idx].qty -= 1;
          }
        }
        saveCart();
        updateCartCount();
        renderCart();
      }
    });
    // Listen for direct input changes
    cartItemsDiv.addEventListener('input', function(e) {
      if (e.target.classList.contains('qty-input')) {
        const idx = parseInt(e.target.getAttribute('data-idx'));
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        cart[idx].qty = val;
        saveCart();
        updateCartCount();
        renderCart();
      }
    });
  }

  // Checkout button (placeholder)
  // Removed checkoutBtn event listener to allow products.html inline script to control behavior

  updateCartCount();
  // Mobile menu toggle
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // Scroll to top button
  const scrollBtn = document.getElementById('scroll-top-btn');
  if (scrollBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 200) {
        scrollBtn.style.display = 'block';
      } else {
        scrollBtn.style.display = 'none';
      }
    });
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dark mode toggle
  const darkToggle = document.getElementById('dark-toggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark');
    });
  }

  // Simple form validation (for all forms)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#d4183d';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  });
});
