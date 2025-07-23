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

// Verificar autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = checkCurrentSession();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Verificar si es administrador
    const users = getUsers();
    const user = users.find(u => u.username === currentUser);
    if (!user || !user.isAdmin) {
        window.location.href = 'index.html';
        return;
    }

    // Mostrar el nombre del administrador
    const adminNameElement = document.createElement('div');
    adminNameElement.className = 'admin-name';
    adminNameElement.textContent = `Administrador: ${currentUser}`;
    document.querySelector('.admin-header').appendChild(adminNameElement);

    // Añadir botón de cerrar sesión
    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-button';
    logoutButton.textContent = 'Cerrar Sesión';
    logoutButton.onclick = logout;
    document.querySelector('.admin-header').appendChild(logoutButton);

    // Cargar la lista de usuarios
    loadAccounts();
});

// Función para cargar las cuentas existentes
async function loadAccounts() {
    const accountsList = document.getElementById('accountsList');
    accountsList.innerHTML = '';

    const users = getUsers();
    users.forEach(userData => {
        const accountCard = document.createElement('div');
        accountCard.className = 'account-card';
        accountCard.innerHTML = `
            <h3>${userData.username}</h3>
            <span class="role ${userData.isAdmin ? 'admin' : 'user'}">${userData.isAdmin ? 'Administrador' : 'Usuario'}</span>
            <div class="progress-info">Materias completadas: ${Object.values(userData.progress || {}).filter(Boolean).length}</div>
            ${userData.username !== localStorage.getItem('currentUser') ? 
                `<button class="delete-account" data-username="${userData.username}">Eliminar</button>` : 
                '<span class="current-user">(Usuario actual)</span>'}
        `;
        accountsList.appendChild(accountCard);

        // Añadir evento para eliminar cuenta
        const deleteButton = accountCard.querySelector('.delete-account');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
                    const username = deleteButton.dataset.username;
                    const users = getUsers();
                    const updatedUsers = users.filter(u => u.username !== username);
                    saveUsers(updatedUsers);
                    loadAccounts();
                    alert('Cuenta eliminada exitosamente');
                }
            });
        }
    });
}

// Manejar el formulario de creación de cuenta
document.getElementById('createAccountForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('newUserName').value.trim();
    const password = document.getElementById('newUserPassword').value;

    const users = getUsers();
    if (users.some(user => user.username === username)) {
        alert('Este nombre de usuario ya existe');
        return;
    }

    users.push({
        username: username,
        password: password,
        isAdmin: false,
        progress: {}
    });

    saveUsers(users);
    document.getElementById('createAccountForm').reset();
    loadAccounts();
    alert('Cuenta creada exitosamente');
}); 