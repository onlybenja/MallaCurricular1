// Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "tu-messaging-id",
    appId: "tu-app-id"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variable para controlar si ya se está redirigiendo
let isRedirecting = false;

// Función para verificar si hay una sesión activa
function checkCurrentSession() {
    const currentUser = localStorage.getItem('currentUser');
    const sessionStartTime = localStorage.getItem('sessionStartTime');
    const currentTime = new Date().getTime();
    
    if (currentUser && sessionStartTime && (currentTime - sessionStartTime) < 3600000) {
        return currentUser;
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStartTime');
    return null;
}

// Función para obtener usuarios
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Función para guardar usuarios
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStartTime');
    window.location.href = 'index.html';
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // Inicializar la tabla de usuarios
    loadUsers();
    setupEventListeners();
});

// Variables globales
let selectedUserId = null;

// Función para cargar usuarios
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.getElementById('usersTableBody');
    const currentUser = localStorage.getItem('currentUser');
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><span class="role ${user.isAdmin ? 'admin' : 'user'}">${user.isAdmin ? 'Administrador' : 'Usuario'}</span></td>
            <td>${calculateProgress(user.progress)}%</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" onclick="editUser('${user.username}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.username !== currentUser ? `
                        <button class="delete-button" onclick="showDeleteConfirmation('${user.username}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Calcular progreso del usuario
function calculateProgress(progress) {
    if (!progress) return 0;
    const completed = Object.values(progress).filter(value => value).length;
    const total = Object.keys(progress).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de volver
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Botón de añadir usuario
    document.getElementById('addUserBtn').addEventListener('click', () => {
        showUserModal();
    });

    // Formulario de usuario
    document.getElementById('userForm').addEventListener('submit', handleUserFormSubmit);

    // Botones de cancelar
    document.getElementById('cancelBtn').addEventListener('click', hideUserModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', hideDeleteConfirmation);

    // Botón de confirmar eliminación
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteSelectedUser);

    // Búsqueda de usuarios
    document.getElementById('userSearch').addEventListener('input', handleSearch);
}

// Mostrar modal de usuario
function showUserModal(username = '') {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const modalTitle = document.getElementById('modalTitle');
    const passwordInput = document.getElementById('password');

    selectedUserId = username;
    modalTitle.textContent = username ? 'Editar Usuario' : 'Añadir Usuario';
    
    if (username) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username);
        if (user) {
            document.getElementById('username').value = user.username;
            document.getElementById('isAdmin').checked = user.isAdmin;
            passwordInput.required = false;
            passwordInput.placeholder = 'Dejar en blanco para mantener la contraseña actual';
        }
    } else {
        form.reset();
        passwordInput.required = true;
        passwordInput.placeholder = 'Contraseña';
    }

    modal.style.display = 'flex';
}

// Ocultar modal de usuario
function hideUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
    selectedUserId = null;
}

// Manejar envío del formulario de usuario
function handleUserFormSubmit(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const isAdmin = document.getElementById('isAdmin').checked;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (selectedUserId) {
        // Editar usuario existente
        const userIndex = users.findIndex(u => u.username === selectedUserId);
        if (userIndex !== -1) {
            const updatedUser = {
                ...users[userIndex],
                username,
                isAdmin
            };
            if (password) {
                updatedUser.password = password;
            }
            users[userIndex] = updatedUser;
        }
    } else {
        // Crear nuevo usuario
        if (users.some(u => u.username === username)) {
            alert('Este nombre de usuario ya existe');
            return;
        }
        users.push({
            username,
            password,
            isAdmin,
            progress: {}
        });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    hideUserModal();
    loadUsers();
}

// Mostrar confirmación de eliminación
function showDeleteConfirmation(username) {
    selectedUserId = username;
    document.getElementById('confirmModal').style.display = 'flex';
}

// Ocultar confirmación de eliminación
function hideDeleteConfirmation() {
    document.getElementById('confirmModal').style.display = 'none';
    selectedUserId = null;
}

// Eliminar usuario seleccionado
function deleteSelectedUser() {
    if (!selectedUserId) return;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(user => user.username !== selectedUserId);
    localStorage.setItem('users', JSON.stringify(users));
    
    hideDeleteConfirmation();
    loadUsers();
}

// Editar usuario
function editUser(username) {
    showUserModal(username);
}

// Manejar búsqueda de usuarios
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const username = row.querySelector('td').textContent.toLowerCase();
        row.style.display = username.includes(searchTerm) ? '' : 'none';
    });
} 