// Lógica para gestionar usuarios (CRUD) 

const API_URL = 'http://localhost:3000/users';

export const getUsers = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de usuarios.');
    }
    return await response.json();
};

export const getUserById = async (userId) => {
    const response = await fetch(`${API_URL}/${userId}`);
    if (!response.ok) {
        throw new Error('No se pudo obtener el usuario.');
    }
    return await response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error('No se pudo registrar el usuario.');
    }

    return await response.json();
};

export const updateUser = async (userId, userData) => {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar el usuario.');
    }
    return await response.json();
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar el usuario.');
    }
    return await response.json();
}; 