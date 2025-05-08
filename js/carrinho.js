function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cart-container');
    let totalPrice = 0;
    
    cartContainer.innerHTML = '';
  
    cart.forEach(item => {
      let itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
        <p>Quantidade: ${item.quantity}</p>
        <p>Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-button" onclick="removeFromCart('${item.name}')">Remover Item</button>
      `;
      cartContainer.appendChild(itemDiv);
      totalPrice += item.price * item.quantity;
    });
  
    document.getElementById('total-price').innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
  }
  
  function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    showNotification(`${productName} removido do carrinho!`, 'success');
  }
  
  function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      showNotification('Seu carrinho está vazio!', 'error');
      return;
    }
    window.location.href = 'pagamento.html';
  }
  
  function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    setTimeout(() => {
      notification.className = 'notification';
    }, 2000);
  }
  
  // Inicializa o carrinho quando a página carrega
  document.addEventListener('DOMContentLoaded', renderCart);