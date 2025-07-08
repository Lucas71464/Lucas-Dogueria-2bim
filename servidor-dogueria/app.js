// MultipleFiles/js/app.js

import AuthController from './Controllers/AuthController.js';
import AuthView from './views/AuthView.js';
import AuthService from './services/AuthService.js';

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para a página de login (login.html) OU cadastro (cadastro.html)
    if (document.body.id === 'login-page' || document.body.id === 'cadastro-page') {
        const authView = new AuthView();
        const authController = new AuthController(authView);
        // A verificação de login só faz sentido na página de login, não na de cadastro
        if (document.body.id === 'login-page') {
            authController.checkAuthAndRedirectIfLoggedIn();
        }
    }

    // Lógica para adicionar o botão "Sair" em todas as páginas com cabeçalho
    const headerNav = document.querySelector('header nav');
    const currentUser = AuthService.getCurrentUser();

    if (currentUser && headerNav) {
        // Remove o botão "Login" se ele existir
        const loginButton = headerNav.querySelector('button[onclick*="login.html"]');
        if (loginButton) {
            loginButton.remove();
        }
        // Remove o botão "Cadastro" se ele existir
        const registerButton = headerNav.querySelector('button[onclick*="cadastro.html"]');
        if (registerButton) {
            registerButton.remove();
        }

        // Cria e adiciona o botão "Sair"
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Sair';
        logoutButton.onclick = () => {
            AuthService.logout();
            window.location.href = 'index.html'; // Redireciona para a página inicial após logout
        };
        headerNav.appendChild(logoutButton);
    } else if (!currentUser && headerNav) {
        // Se não houver usuário logado, garante que os botões Login e Cadastro existam
        // e adiciona se não estiverem presentes
        let loginButton = headerNav.querySelector('button[onclick*="login.html"]');
        if (!loginButton) {
            loginButton = document.createElement('button');
            loginButton.textContent = 'Login';
            loginButton.onclick = () => { window.location.href = 'login.html'; };
            headerNav.appendChild(loginButton);
        }

        let registerButton = headerNav.querySelector('button[onclick*="cadastro.html"]');
        if (!registerButton) {
            registerButton = document.createElement('button');
            registerButton.textContent = 'Cadastro';
            registerButton.onclick = () => { window.location.href = 'cadastro.html'; };
            headerNav.appendChild(registerButton);
        }
    }
});
