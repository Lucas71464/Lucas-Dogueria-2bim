// Conteúdo completo do arquivo MultipleFiles/pagamento.js

function selectPayment(method) {
    // Esconde todos os formulários
    document.querySelectorAll('.payment-form').forEach(form => {
      form.classList.remove('active');
    });
    
    // Remove a classe 'active' de todos os botões
    document.querySelectorAll('.payment-options button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Mostra o formulário selecionado e marca o botão
    document.getElementById(`form-${method}`).classList.add('active');
    document.getElementById(`btn-${method}`).classList.add('active');
  }
  
  function processPayment() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    fetch('http://localhost:3000/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itens: cart })
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert('Pagamento processado com sucesso! Obrigado pelo seu pedido.');
          sessionStorage.removeItem('cart');
          window.location.href = 'index.html';
        } else {
          alert(result.message || 'Erro ao processar pagamento.');
        }
      })
      .catch(() => {
        alert('Erro de conexão com o servidor!');
      });
  }
  
  // Inicializa com o primeiro método selecionado
  document.addEventListener('DOMContentLoaded', () => {
    selectPayment('cartao');
  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) {
      alert('Você precisa estar logado para acessar o pagamento!');
      window.location.href = 'login.html';
    }
  });