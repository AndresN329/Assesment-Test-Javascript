const API_URL = 'http://localhost:3000/users';

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}?email=${email}&password=${password}`);
    
    if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
    }

    const users = await response.json();
    
    if (users.length === 0) {
        throw new Error('Email o contraseña incorrectos.');
    }

    return users[0];
}; 