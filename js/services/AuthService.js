// MultipleFiles/js/services/AuthService.js

class AuthService {
    static async login(username, password) {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: 'Erro de conexão com o servidor.' };
        }
    }

    static async register(username, password, confirmPassword) {
        if (password !== confirmPassword) {
            return { success: false, message: 'As senhas não coincidem.' };
        }
        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            return result;
        } catch (error) {
            return { success: false, message: 'Erro de conexão com o servidor.' };
        }
    }

    static logout() {
        sessionStorage.removeItem('currentUser');
    }

    static getCurrentUser() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
}

export default AuthService;