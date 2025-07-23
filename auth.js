// Asegurar que exista el usuario admin
if (!localStorage.getItem('users')) {
    const initialUsers = [{
        username: 'admin',
        password: 'admin',
        isAdmin: true,
        progress: {}
    }];
    localStorage.setItem('users', JSON.stringify(initialUsers));
}

// Función simple para obtener usuarios
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Función simple para guardar usuarios
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Función para guardar el progreso de un usuario
function saveUserProgress(progress) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === currentUser);
    if (userIndex !== -1) {
        users[userIndex].progress = progress;
        saveUsers(users);
    }
}

// Función para obtener el progreso del usuario actual
function getCurrentUserProgress() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return {};

    const users = getUsers();
    const user = users.find(u => u.username === currentUser);
    return user ? user.progress || {} : {};
}

// Configurar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('mainContent');
    const loginModal = document.getElementById('loginModal');
    const adminButton = document.getElementById('adminButton');
    const logoutButton = document.getElementById('logoutButton');
    const userDisplay = document.getElementById('userDisplay');

    // Manejar el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            const users = getUsers();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Guardar sesión
                localStorage.setItem('currentUser', username);
                
                // Mostrar contenido principal
                loginModal.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Mostrar nombre de usuario
                userDisplay.textContent = `Usuario: ${username}`;
                
                // Mostrar botón de admin si corresponde
                if (user.isAdmin) {
                    adminButton.style.display = 'inline-block';
                } else {
                    adminButton.style.display = 'none';
                }

                // Cargar el progreso del usuario
                const userProgress = user.progress || {};
                updateProgress(userProgress);
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

    // Manejar el botón de admin
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Manejar el botón de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    // Verificar si hay sesión activa al cargar
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const users = getUsers();
        const user = users.find(u => u.username === currentUser);
        
        if (user) {
            loginModal.style.display = 'none';
            mainContent.style.display = 'block';
            userDisplay.textContent = `Usuario: ${currentUser}`;
            
            if (user.isAdmin) {
                adminButton.style.display = 'inline-block';
            } else {
                adminButton.style.display = 'none';
            }

            // Cargar el progreso del usuario
            const userProgress = user.progress || {};
            updateProgress(userProgress);
        }
    }
});

// Función para actualizar el progreso visual
function updateProgress(progress) {
    // Actualizar los checkboxes según el progreso
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const id = checkbox.id;
        checkbox.checked = progress[id] || false;
    });

    // Recalcular y actualizar el progreso total
    const total = checkboxes.length;
    const completed = Object.values(progress).filter(Boolean).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressBar = document.getElementById('totalProgress');
    const progressText = document.getElementById('progressPercentage');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

// Exponer funciones para uso externo
window.saveUserProgress = saveUserProgress;
window.getCurrentUserProgress = getCurrentUserProgress; 