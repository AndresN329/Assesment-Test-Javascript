// Funciones para interactuar con localStorage

export const saveSession = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getSession = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
    localStorage.removeItem('currentUser');
}; 