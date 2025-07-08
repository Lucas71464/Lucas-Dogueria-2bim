// MultipleFiles/js/login.js

import AuthService from './services/AuthService.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await AuthService.login(username, password);
        if (result.success) {
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            window.location.href = 'cardapio.html'; // Redireciona para o cardápio
        } else {
            loginMessage.textContent = result.message;
            loginMessage.style.color = '#dc3545'; // Vermelho para erro
        }
    });
});

// Função para alternar visibilidade da senha
function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleSpan = passwordInput.nextElementSibling;
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleSpan.textContent = '🙈'; // Ícone de olho fechado
    } else {
        passwordInput.type = 'password';
        toggleSpan.textContent = '👁️'; // Ícone de olho aberto
    }
}