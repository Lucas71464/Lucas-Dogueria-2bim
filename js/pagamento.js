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
    alert('Pagamento processado com sucesso! Obrigado pelo seu pedido.');
    localStorage.removeItem('cart'); // Limpa o carrinho
    window.location.href = 'index.html'; // Volta para a página inicial
  }
  
  // Inicializa com o primeiro método selecionado
  document.addEventListener('DOMContentLoaded', () => {
    selectPayment('cartao');
  });