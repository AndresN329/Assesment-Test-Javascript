import { getSession, clearSession } from '../utils/storage.js';

export const loadHeader = () => {
    const headerContainer = document.getElementById('main-header');
    if (!headerContainer) return;

    const user = getSession();

    if (user) {
        headerContainer.innerHTML = `
            <div class="header-content">
                <p>Welcome, <strong>${user.name}</strong> (${user.role})</p>
                <button id="logout-button">Cerrar Sesión</button>
            </div>
        `;

        document.getElementById('logout-button').addEventListener('click', () => {
            clearSession();
            window.location.hash = '/login';
        });
    }
}; 