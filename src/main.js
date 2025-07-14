import { registerUser, getUsers, getUserById, updateUser, deleteUser } from './services/users.js';
import { getCourses, createCourse, getCourseById, updateCourse, deleteCourse } from './services/courses.js';
import { createEnrollment, checkEnrollment } from './services/enrollments.js';
import { login } from './services/auth.js';
import { saveSession, getSession, clearSession } from './utils/storage.js';
import { loadHeader } from './components/header.js';
import { loadSidebar } from './components/sidebar.js';
import { loadSidebarUsers } from './components/sidebar.js';
import { showModal } from './components/modal.js';

const routes = {
    '/': 'public.html',
    '/login': 'login.html',
    '/register': 'register.html',
    '/dashboard': 'dashboard.html',
    '/dashUsers' : 'dashUsers.html'
};

const app = document.getElementById('app');

const renderUsersTable = async () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    try {
        const users = await getUsers();
        const table = `
            <h2>Users Management</h2>
            <button id="add-user-btn">add user</button>
            <table id="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr data-user-id="${user.id}">
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>
                                <button class="edit-btn">Editar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        mainContent.innerHTML = table;
        attachUserTableListeners();
    } catch (error) {
        mainContent.innerHTML = `<p>${error.message}</p>`;
    }
};

const attachUserTableListeners = () => {
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;

    usersTable.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const row = e.target.closest('tr');
            const userId = row.dataset.userId;
            
            if (confirm(`¿Estás seguro de que quieres eliminar al usuario con ID ${userId}?`)) {
                try {
                    await deleteUser(userId);
                    alert('Usuario eliminado correctamente.');
                    await renderUsersTable(); // Refresh the table
                } catch (error) {
                    alert(error.message);
                }
            }
        }

        if (e.target.classList.contains('edit-btn')) {
            const row = e.target.closest('tr');
            const userId = row.dataset.userId;
            openUserFormModal(userId);
        }
    });

    const addUserBtn = document.getElementById('add-user-btn');
    if(addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            openUserFormModal();
        });
    }
};

const openUserFormModal = async (userId) => {
    const user = userId ? await getUserById(userId) : null;
    const title = userId ? 'Editar Usuario' : 'Añadir Usuario';

    const formContent = `
        <form id="user-form">
            <input type="hidden" id="user-id" value="${user?.id || ''}">
            <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" id="name" value="${user?.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" value="${user?.email || ''}" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña (dejar en blanco para no cambiar)</label>
                <input type="password" id="password">
            </div>
            <div class="form-group">
                <label for="role">Rol</label>
                <select id="role" required>
                    <option value="visitor" ${user?.role === 'visitor' ? 'selected' : ''}>Visitante</option>
                    <option value="admin" ${user?.role === 'admin' ? 'selected' : ''}>Administrador</option>
                </select>
            </div>
            <button type="submit">${userId ? 'Actualizar' : 'Crear'}</button>
        </form>
    `;

    const modal = showModal(title, formContent);
    const form = modal.querySelector('#user-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('user-id').value;
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            role: document.getElementById('role').value,
        };
        const password = document.getElementById('password').value;
        if (password) {
            userData.password = password;
        }

        try {
            if (id) {
                // Si hay un usuario existente, completamos los datos que no están en el formulario
                const existingUser = await getUserById(id);
                const updatedData = { ...existingUser, ...userData };
                await updateUser(id, updatedData);
                alert('Usuario actualizado correctamente.');
            } else {
                await registerUser({ ...userData, password: password || 'defaultPass123' }); // Asignar pass por defecto si está vacío
                alert('Usuario creado correctamente.');
            }
            modal.querySelector('.close-modal').click();
            await renderUsersTable();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
};


const checkAuth = () => {
    const path = window.location.hash.slice(1).toLowerCase();
    const session = getSession();

    if (path === 'dashboard' && (!session || session.role !== 'admin')) {
        alert('Acceso denegado. Debes ser administrador.');
        window.location.hash = '/login';
        return false;
    }

    return true;
}

const router = async () => {
    if (!checkAuth()) return;

    const path = window.location.hash.slice(1).toLowerCase() || '/';
    const route = routes[path] || 'public.html'; // Default to public page
    
    const response = await fetch(`/src/pages/${route}`);
    const html = await response.text();
    
    app.innerHTML = html;

    // Add event listeners after content is loaded
    if (route === 'public.html') {
        loadHeader();
        await renderPublicCourses();
    } else if (route === 'register.html') {
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const Confirmation = document.getElementById('Confirmation').value;

            const newUser = {
                name,
                email,
                password,
                Confirmation,
                role: 'visitor' // By default, new users are visitors.
            };

            try {
                await registerUser(newUser);
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                window.location.hash = '/login';
            } catch (error) {
                alert(error.message);
            }
        });
    } else if (route === 'login.html') {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const user = await login(email, password);
                saveSession(user);
                alert(`Welcome, ${user.name}!`);

                if (user.role === 'admin') {
                    window.location.hash = '/dashboard';
                } else {
                    window.location.hash = '/dashUsers';
                }
            } catch (error) {
                alert(error.message);
            }
        });
    } else if (route === 'dashboard.html') {
        loadHeader();
        loadSidebar();
        await renderDashboardContent();

        // Add listeners to sidebar links
        const sidebar = document.getElementById('main-sidebar');
        if(sidebar) {
            sidebar.addEventListener('click', (e) => {
                if(e.target.matches('a')) {
                    const page = e.target.dataset.page;
                    renderDashboardContent(page);
                }
            });
        }
    }  else if (route === 'dashUsers') {
        loadHeader();
        loadSidebarUsers();
        await renderDashboardContent();

        // Add listeners to sidebar links
        const sidebar = document.getElementById('main-sidebar');
        if(sidebar) {
            sidebar.addEventListener('click', (e) => {
                if(e.target.matches('a')) {
                    const page = e.target.dataset.page;
                    renderDashboardContent(page);
                }
            });
        }
    }
};

const renderPublicCourses = async () => {
    const mainContent = document.getElementById('app'); // We render into the main app container for the public page
    if (!mainContent.querySelector('#courses-list')) {
        // If the public page structure isn't there, we inject it.
        // This handles re-renders after navigating away and back.
        const response = await fetch(`/src/pages/public.html`);
        mainContent.innerHTML = await response.text();
        loadHeader(); // Re-load header as we replaced the content
    }

    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    try {
        const courses = await getCourses();
        if (courses.length === 0) {
            coursesList.innerHTML = '<p>No hay eventos disponibles en este momento.</p>';
            return;
        }

        coursesList.innerHTML = courses.map(course => `
            <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p><strong>Capacity:</strong> ${course.capacity}</p>
                <p><strong>Inicio:</strong> ${new Date(course.Date).toLocaleDateString()}</p>
                <button class="enroll-btn" data-course-id="${course.id}">Enroll</button>
            </div>
        `).join('');

        attachCourseCardListeners();
        
    } catch (error) {
        coursesList.innerHTML = `<p>Error al cargar los eventos: ${error.message}</p>`;
    }
};

const attachCourseCardListeners = async () => {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    const user = getSession();

    if (user) {
        // Marcar los eventos en los que ya está inscrito
        const buttons = coursesList.querySelectorAll('.enroll-btn');
        for (const btn of buttons) {
            const courseId = btn.dataset.courseId;
            const isEnrolled = await checkEnrollment(user.id, courseId);
            if (isEnrolled) {
                btn.textContent = 'Enrolled';
                btn.disabled = true;
            }
        }
    }

    coursesList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('enroll-btn')) {
            if (!user) {
                alert('Debes iniciar sesión para inscribirte.');
                window.location.hash = '/login';
                return;
            }

            const btn = e.target;
            const courseId = btn.dataset.courseId;

            try {
                await createEnrollment({ userId: user.id, courseId: parseInt(courseId) });
                alert('¡Inscripción exitosa!');
                btn.textContent = 'Enrolled';
                btn.disabled = true;
                renderCoursesTable()
            } catch (error) {
                alert(`Error en la inscripción: ${error.message}`);
            }
        }
    });
};

const renderDashboardContent = async (page = 'users') => {
    if (page === 'users') {
        await renderUsersTable();
    } else if (page === 'courses') {
        await renderCoursesTable();
    }
}

const renderCoursesTable = async () => {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    try {
        const courses = await getCourses();
        const table = `
            <h2>Events Management</h2>
            <button id="add-event-btn">Add Event</button>
            <table id="courses-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Capacity</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${courses.map(course => `
                        <tr data-course-id="${course.id}">
                            <td>${course.title}</td>
                            <td>${course.description}</td>
                            <td>${course.capacity}</td>
                            <td>${course.Date}</td>
                            <td>
                                <button class="edit-btn">Editar</button>
                                <button class="delete-btn">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        mainContent.innerHTML = table;
        attachCourseTableListeners();
    } catch (error) {
        mainContent.innerHTML = `<p>${error.message}</p>`;
    }
};

const attachCourseTableListeners = () => {
    const coursesTable = document.getElementById('courses-table');
    if (!coursesTable) return;

    coursesTable.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const row = target.closest('tr');
            const courseId = row.dataset.courseId;
            if (confirm(`¿Seguro que quieres eliminar el curso ID ${courseId}?`)) {
                try {
                    await deleteCourse(courseId);
                    alert('Curso eliminado.');
                    await renderCoursesTable();
                } catch (error) {
                    alert(error.message);
                }
            }
        }

        if (target.classList.contains('edit-btn')) {
            const row = target.closest('tr');
            const courseId = row.dataset.courseId;
            openCourseFormModal(courseId);
        }
    });

    document.getElementById('add-event-btn').addEventListener('click', () => {
        openCourseFormModal();
    });
};

const openCourseFormModal = async (courseId) => {
    const course = courseId ? await getCourseById(courseId) : null;
    const title = courseId ? 'Editar Curso' : 'Add event';

    const formContent = `
        <form id="course-form">
            <input type="hidden" id="course-id" value="${course?.id || ''}">
            <div class="form-group">
                <label for="title">Name</label>
                <input type="text" id="title" value="${course?.title || ''}" required>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" required>${course?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label for=Date">Date</label>
                <input type="date" id="Date" value="${course?.Date || ''}" required>
            </div>
            <div class="form-group">
                <label for="capacity">capacity</label>
                <input type="number" id="capacity" value="${course?.capacity || ''}" required>
            </div>
            <button type="submit">${courseId ? 'Actualizar' : 'Crear'}</button>
        </form>
    `;

    const modal = showModal(title, formContent);
    const form = modal.querySelector('#course-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('course-id').value;
        const courseData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            Date: document.getElementById('Date').value,
            capacity: document.getElementById('capacity').value,
        };

        try {
            if (id) {
                await updateCourse(id, courseData);
                alert('Curso actualizado correctamente.');
            } else {
                await createCourse(courseData);
                alert('Curso creado correctamente.');
            }
            modal.querySelector('.close-modal').click();
            await renderCoursesTable();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
};


window.addEventListener('hashchange', router);
window.addEventListener('load', router); 