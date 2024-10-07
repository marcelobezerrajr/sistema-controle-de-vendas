import api from './api';

const loginService = {
    login: async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await api.post('/login/token', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const result = response.data;

            localStorage.setItem('access_token', result.access_token);

            const userResponse = await api.get('/login/me', {
                headers: {
                    Authorization: `Bearer ${result.access_token}`,
                },
            });

            const userData = userResponse.data;

            localStorage.setItem('user_name', userData.name);
            localStorage.setItem('user_email', userData.email);
            localStorage.setItem('user_username', userData.username);
            localStorage.setItem('user_permission', userData.permission);

            return userData;
        } catch (error) {
            console.error('Erro no login:', error);
            throw new Error('Email ou senha inválidos');
        }
    },
};

export default loginService;
