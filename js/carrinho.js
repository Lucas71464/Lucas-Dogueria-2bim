// Conteúdo completo do arquivo MultipleFiles/carrinho.js

function renderCart() {
    // Lê o carrinho do sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
    let cartContainer = document.getElementById('cart-container');
    let totalPrice = 0;
    
    cartContainer.innerHTML = '';
  
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
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
    }
  
    document.getElementById('total-price').innerText = `Total: R$ ${totalPrice.toFixed(2)}`;
  }
  
  function removeFromCart(productName) {
    // Lê o carrinho do sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
    cart = cart.filter(item => item.name !== productName);
    // Salva o carrinho atualizado no sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart)); 
    renderCart();
    showNotification(`${productName} removido do carrinho!`, 'success');
  }
  
  function checkout() {
    // Lê o carrinho do sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
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
  
  async function finalizarPedido() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      showNotification('Seu carrinho está vazio!', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itens: cart })
      });
      const result = await response.json();
      if (result.success) {
        showNotification('Pedido realizado com sucesso!', 'success');
        sessionStorage.removeItem('cart');
        renderCart();
      } else {
        showNotification(result.message || 'Erro ao finalizar pedido.', 'error');
      }
    } catch (error) {
      showNotification('Erro de conexão com o servidor!', 'error');
    }
  }
  
  // Inicializa o carrinho quando a página carrega
  document.addEventListener('DOMContentLoaded', renderCart);