export const loadSidebar = () => {
    const sidebarContainer = document.getElementById('main-sidebar');
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = `
    <img src="../src/assets/travisscottila.png" alt="El travieso">
        <nav class="sidebar-nav">
            <ul>
                <li><a href="#/dashboard" data-page="users">Enrollments</a></li>
                <li><a href="#/dashboard" data-page="courses">Gestión de eventos</a></li>
            </ul>
        </nav>
    `;
}; 


export const loadSidebarUsers = () => {
    const sidebarContainer = document.getElementById('main-sidebar')
    if (!sidebarContainer) return;

     sidebarContainer.innerHTML = `
        <nav class="sidebar-nav">
            <ul>
                <li><a href="#/dashUsers" data-page="users">Enrollments</a></li>
                <li><a href="#/dashUsers" data-page="courses">Gestión de eventos</a></li>
            </ul>
        </nav>
    `;
};