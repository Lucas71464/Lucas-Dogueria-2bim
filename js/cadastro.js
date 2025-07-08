// MultipleFiles/js/cadastro.js

import AuthService from './services/AuthService.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        const result = await AuthService.register(username, password, confirmPassword);
        if (result.success) {
            registerMessage.textContent = result.message;
            registerMessage.style.color = '#28a745'; // Verde para sucesso
            registerForm.reset(); // Limpa o formulário
        } else {
            registerMessage.textContent = result.message;
            registerMessage.style.color = '#dc3545'; // Vermelho para erro
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