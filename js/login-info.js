// login-info.js
// Substitui o botão Login do menu pelo usuário logado e esconde/exibe o botão de cadastro
function exibirUsuarioLogado() {
  const userStr = sessionStorage.getItem('currentUser');
  const loginBtn = document.getElementById('login-btn');
  const cadastroBtn = document.getElementById('cadastro-btn');
  if (cadastroBtn) {
    if (userStr) {
      cadastroBtn.style.display = 'none';
    } else {
      cadastroBtn.style.display = '';
    }
  }
  if (!loginBtn) return;
  let btn = document.createElement('button');
  btn.className = loginBtn.className;
  btn.style = loginBtn.style.cssText;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      btn.innerHTML = `👤 ${user.username} (${user.role})`;
      btn.onclick = function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      };
      btn.title = 'Clique para sair';
    } catch {
      btn.textContent = 'Login';
      btn.onclick = function() { window.location.href = 'login.html'; };
    }
  } else {
    btn.textContent = 'Login';
    btn.onclick = function() { window.location.href = 'login.html'; };
  }
  loginBtn.parentNode.replaceChild(btn, loginBtn);

  // Botões extras para gerente
  const nav = document.getElementById('main-nav');
  let btnCrudProdutos = document.getElementById('crud-produtos-btn');
  let btnCrudUsuarios = document.getElementById('crud-usuarios-btn');
  if (btnCrudProdutos) btnCrudProdutos.remove();
  if (btnCrudUsuarios) btnCrudUsuarios.remove();
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'gerente') {
        btnCrudProdutos = document.createElement('button');
        btnCrudProdutos.id = 'crud-produtos-btn';
        btnCrudProdutos.textContent = 'Gerenciar Produtos';
        btnCrudProdutos.onclick = function() { window.location.href = 'crud-produtos.html'; };
        nav.appendChild(btnCrudProdutos);
        btnCrudUsuarios = document.createElement('button');
        btnCrudUsuarios.id = 'crud-usuarios-btn';
        btnCrudUsuarios.textContent = 'Gerenciar Usuários';
        btnCrudUsuarios.onclick = function() { window.location.href = 'crud-usuarios.html'; };
        nav.appendChild(btnCrudUsuarios);
      }
    } catch {}
  }
}
document.addEventListener('DOMContentLoaded', exibirUsuarioLogado);
