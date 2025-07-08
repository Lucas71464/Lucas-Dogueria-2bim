// MultipleFiles/js/controllers/AuthController.js

import AuthService from '../services/AuthService.js';

class AuthController {
    constructor(authView) {
        this.authView = authView;

        // Vincular formulário de Login
        if (this.authView && this.authView.loginForm) {
            this.authView.bindLogin(this.handleLogin);
        }

        // Vincular formulário de Registro
        if (this.authView && this.authView.registerForm) {
            this.authView.bindRegister(this.handleRegister);
        }
    }

    handleLogin = async (username, password) => {
        const result = await AuthService.login(username, password);
        if (result.success) {
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            this.authView.displayLoginMessage(''); // Limpa mensagem de erro
            this.redirectToDashboard(result.user.role);
        } else {
            this.authView.displayLoginMessage(result.message);
        }
    };

    handleRegister = async (username, password, confirmPassword) => {
        const result = await AuthService.register(username, password, confirmPassword);
        if (result.success) {
            this.authView.displayRegisterMessage(result.message, true); // Mensagem de sucesso
            // Opcional: Redirecionar para login ou fazer login automático
            // sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            // this.redirectToDashboard(result.user.role);
            // Limpar campos do formulário
            this.authView.registerUsernameInput.value = '';
            this.authView.registerPasswordInput.value = '';
            this.authView.registerConfirmPasswordInput.value = '';
        } else {
            this.authView.displayRegisterMessage(result.message, false); // Mensagem de erro
        }
    };

    redirectToDashboard(role) {
        if (role === 'cliente') {
            window.location.href = 'cardapio.html';
        } else if (role === 'gerente') {
            window.location.href = 'gerente.html'; // Página do gerente
        }
    }

    checkAuthAndRedirectIfLoggedIn() {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            this.redirectToDashboard(currentUser.role);
        }
    }
}

export default AuthController;