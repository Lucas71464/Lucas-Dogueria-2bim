// Conteúdo completo do arquivo MultipleFiles/cardapio.js

function scrollToSection(id) {
  const allSections = Array.from(document.querySelectorAll('.categoria-produto'));
  const target = allSections.find(sec => {
    const h2 = sec.querySelector('h2');
    return h2 && h2.textContent.trim().toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '') === id.toLowerCase().normalize('NFD').replace(/[^\w\s]/gi, '');
  });
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.style.boxShadow = '0 0 0 4px #ffe58f, 0 0 16px #c40000';
    setTimeout(() => {
      target.style.boxShadow = '';
    }, 1200);
  }
}

function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification show ${type}`;
  setTimeout(() => {
    notification.className = "notification";
  }, 2000);
}

function addToCart(productName, productPrice) {
  // Lê o carrinho do sessionStorage
  let cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
  let product = { name: productName, price: productPrice };

  let existingProductIndex = cart.findIndex(item => item.name === productName);
  if (existingProductIndex >= 0) {
    cart[existingProductIndex].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  // Salva o carrinho atualizado no sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(cart));
  showNotification(`${productName} adicionado ao carrinho!`, "added");
}

function removeFromCart(productName) {
  // Lê o carrinho do sessionStorage
  let cart = JSON.parse(sessionStorage.getItem('cart')) || []; 
  let existingProductIndex = cart.findIndex(item => item.name === productName);

  if (existingProductIndex >= 0) {
    if (cart[existingProductIndex].quantity > 1) {
      cart[existingProductIndex].quantity -= 1;
      showNotification(`${productName} removido do carrinho!`, "removed");
    } else {
      cart.splice(existingProductIndex, 1);
      showNotification(`${productName} removido do carrinho!`, "removed");
    }
  }

  // Salva o carrinho atualizado no sessionStorage
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', async () => {
  // Busca produtos do backend
  try {
    const response = await fetch('http://localhost:3000/produtos');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const produtos = await response.json();
    console.log('Produtos recebidos:', produtos); // DEBUG
    if (!Array.isArray(produtos) || produtos.length === 0) {
      showNotification('Nenhum produto encontrado!', 'error');
      return;
    }
    renderProdutos(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error); // DEBUG
    showNotification('Erro ao carregar produtos do servidor! ' + error, 'error');
  }
});

function renderProdutos(produtos) {
  const produtosContainer = document.getElementById('produtos-container');
  if (!produtosContainer) return;
  produtosContainer.innerHTML = '';

  // Mapeamento de imagens para produtos
  const imagens = {
    'Cachorro-Quente Tradicional': 'img/hot-dog-classico-capa-730x480.jpeg',
    'Cachorro-Quente Especial': 'img/cachorro-quente-maneiras-de-preparar.jpeg',
    'Cachorro-Quente Vegano': 'img/images.jfif',
    'Combo Família': 'img/hot-dog-classico-capa-730x480.jpeg',
    'Batata Frita': 'img/batata-frita-sequinha.avif',
    'Refrigerante Lata': 'img/refrigerante.jpg',
    'Suco Natural': 'img/Orangejuice.jpeg',
    'Água Mineral': 'img/agua.jpg',
  };

  // Palavras-chave ampliadas
  const categorias = {
    Lanches: ['cachorro-quente', 'combo', 'frango', 'peixe', 'iscas'],
    Bebidas: ['refrigerante', 'suco', 'água', 'agua', 'chá', 'cha'],
    Porções: ['batata', 'onion', 'porção', 'porcao', 'iscas', 'frango', 'peixe']
  };
  const grupos = { Lanches: [], Bebidas: [], Porções: [] };

  produtos.forEach(produto => {
    const nome = produto.nome || produto.name || '';
    const descricao = produto.descricao || produto.description || '';
    const preco = produto.preco || produto.price || '0.00';
    const secao = produto.secao || '';
    if (!nome) return;
    const nomeLower = nome.toLowerCase();
    // Prioriza o campo secao, usa palavras-chave só se não houver secao
    if (secao === 'Lanches') grupos.Lanches.push({ ...produto, nome, descricao, preco });
    else if (secao === 'Bebidas') grupos.Bebidas.push({ ...produto, nome, descricao, preco });
    else if (secao === 'Porções') grupos.Porções.push({ ...produto, nome, descricao, preco });
    else if (categorias.Lanches.some(c => nomeLower.includes(c))) grupos.Lanches.push({ ...produto, nome, descricao, preco });
    else if (categorias.Bebidas.some(c => nomeLower.includes(c))) grupos.Bebidas.push({ ...produto, nome, descricao, preco });
    else if (categorias.Porções.some(c => nomeLower.includes(c))) grupos.Porções.push({ ...produto, nome, descricao, preco });
    else grupos.Lanches.push({ ...produto, nome, descricao, preco }); // Default
  });

  let algumProduto = false;
  Object.entries(grupos).forEach(([cat, lista]) => {
    if (lista.length === 0) return;
    algumProduto = true;
    const sec = document.createElement('section');
    sec.className = 'categoria-produto';
    sec.innerHTML = `<h2>${cat}</h2>`;
    lista.forEach(produto => {
      const div = document.createElement('div');
      div.className = 'produto';
      const imgSrc = imagens[produto.nome] || 'img/hot-dog-classico-capa-730x480.jpeg';
      div.innerHTML = `
        <img class="produto-img" src="${produto.imagem || imagens[produto.nome] || 'img/hot-dog-classico-capa-730x480.jpeg'}" alt="${produto.nome}" onerror="this.src='img/hot-dog-classico-capa-730x480.jpeg'">
        <div class="produto-info">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao || ''}</p>
          <p>Preço: R$ ${parseFloat(produto.preco).toFixed(2)}</p>
          <button class="add-button" onclick="addToCart('${produto.nome}', ${parseFloat(produto.preco)})">Adicionar ao carrinho</button>
        </div>
      `;
      sec.appendChild(div);
    });
    produtosContainer.appendChild(sec);
  });
  if (!algumProduto) {
    produtosContainer.innerHTML = '<p style="text-align:center;color:#c40000;font-size:1.2em;">Nenhum produto disponível.</p>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Indicação visual ao chegar no cardápio
  const lanche = sessionStorage.getItem('lancheDestacado');
  if (lanche) {
    // Procura pelo h3 do produto correspondente
    const h3s = Array.from(document.querySelectorAll('.produto h3'));
    const h3 = h3s.find(h => h.textContent.trim().toLowerCase() === lanche.trim().toLowerCase());
    if (h3 && h3.parentElement) {
      h3.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      h3.parentElement.style.boxShadow = '0 0 0 4px #ffe58f, 0 0 16px #c40000';
      h3.parentElement.style.transition = 'box-shadow 0.6s';
      // Efeito arco-íris no nome
      h3.classList.add('rainbow-text-effect');
      setTimeout(() => {
        h3.parentElement.style.boxShadow = '';
        h3.classList.remove('rainbow-text-effect');
      }, 10000);
    }
    sessionStorage.removeItem('lancheDestacado');
  }
});