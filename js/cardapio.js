function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = { name: productName, price: productPrice };
  
    let existingProductIndex = cart.findIndex(item => item.name === productName);
    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`${productName} adicionado ao carrinho!`, "added");
  }
  
  function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
  
    localStorage.setItem('cart', JSON.stringify(cart));
  }