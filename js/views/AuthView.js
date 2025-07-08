// MultipleFiles/js/views/AuthView.js

class AuthView {
    constructor() {
        // Elementos do formulário de Login
        this.loginForm = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginMessage = document.getElementById('loginMessage');

        // Elementos do formulário de Registro
        this.registerForm = document.getElementById('registerForm');
        this.registerUsernameInput = document.getElementById('registerUsername');
        this.registerPasswordInput = document.getElementById('registerPassword');
        this.registerConfirmPasswordInput = document.getElementById('registerConfirmPassword');
        this.registerMessage = document.getElementById('registerMessage');
    }

    bindLogin(handler) {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = this.usernameInput.value;
                const password = this.passwordInput.value;
                handler(username, password);
            });
        }
    }

    bindRegister(handler) {
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = this.registerUsernameInput.value;
                const password = this.registerPasswordInput.value;
                const confirmPassword = this.registerConfirmPasswordInput.value;
                handler(username, password, confirmPassword);
            });
        }
    }

    displayLoginMessage(message) {
        if (this.loginMessage) {
            this.loginMessage.textContent = message;
        }
    }

    displayRegisterMessage(message, isSuccess = false) {
        if (this.registerMessage) {
            this.registerMessage.textContent = message;
            this.registerMessage.style.color = isSuccess ? '#28a745' : '#dc3545'; // Verde para sucesso, vermelho para erro
        }
    }
}

export default AuthView;