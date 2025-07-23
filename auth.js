// Función para cargar las preferencias del usuario
function loadUserPreferences(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);
    
    if (user) {
        // Cargar colores
        if (user.colors) {
            document.documentElement.style.setProperty('--color-primary', user.colors.primary);
            document.documentElement.style.setProperty('--color-primary-dark', user.colors.secondary);
            
            // Convertir el color primario a RGB
            const rgb = hexToRgb(user.colors.primary);
            if (rgb) {
                document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
            }
        }
        
        // Cargar fuente
        if (user.font) {
            document.documentElement.style.setProperty('--font-family', `'${user.font}', sans-serif`);
        }
    }
}

// Función auxiliar para convertir hex a rgb
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Función para actualizar el nombre de usuario en la interfaz
function updateUserDisplay(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);
    const displayName = user && user.fullName ? user.fullName : username;

    document.getElementById('userDisplay').textContent = displayName;
    document.getElementById('accountName').textContent = displayName;
}

// Función para manejar el inicio de sesión
function handleLogin(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', username);
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        
        // Mostrar/ocultar botón de admin
        const adminButton = document.getElementById('adminButton');
        if (adminButton) {
            adminButton.style.display = user.isAdmin ? 'flex' : 'none';
            adminButton.onclick = () => window.location.href = 'admin.html';
        }

        // Actualizar nombre en la interfaz
        updateUserDisplay(username);
        
        // Cargar preferencias del usuario
        loadUserPreferences(username);

        // Actualizar la malla según la carrera del usuario
        if (typeof updateMallaDisplay === 'function') {
            console.log('Actualizando malla para carrera:', user.career);
            updateMallaDisplay();
        }

        loadSavedProgress();
        return true;
    }
    return false;
}

// Función para verificar si hay un usuario logueado
function checkLoggedInUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
        return false;
    }

    // Cargar preferencias del usuario actual
    loadUserPreferences(currentUser);
    
    // Actualizar nombre en la interfaz
    updateUserDisplay(currentUser);

    // Actualizar la malla según la carrera del usuario
    if (typeof updateMallaDisplay === 'function') {
        console.log('Actualizando malla en checkLoggedInUser');
        updateMallaDisplay();
    }

    return true;
}

// Función para cerrar sesión
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Inicializar usuario admin por defecto si no existe ningún usuario
function initializeDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        users.push({
            username: 'admin',
            fullName: 'Administrador del Sistema',
            password: 'admin',
            isAdmin: true,
            progress: {},
            colors: {
                primary: '#FFB6DF',
                secondary: '#FF69B4'
            },
            font: 'Poppins'
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultAdmin();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            if (handleLogin(username, password)) {
                loginForm.reset();
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

    // Profile menu
    const profileButton = document.getElementById('profileButton');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (profileButton && profileMenu) {
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            profileMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        if (profileMenu && !profileMenu.contains(e.target)) {
            profileMenu.classList.remove('active');
        }
    });

    // Botón de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Botón de personalizar
    const customizeButton = document.getElementById('customizeButton');
    const colorModal = document.getElementById('colorModal');
    
    if (customizeButton && colorModal) {
        customizeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            colorModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (profileMenu) {
                profileMenu.classList.remove('active');
            }
        });
    }

    // Cerrar modal de colores
    const closeColorModal = document.getElementById('closeColorModal');
    if (closeColorModal && colorModal) {
        closeColorModal.addEventListener('click', () => {
            colorModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Botón de admin
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Verificar usuario logueado
    if (checkLoggedInUser()) {
        const currentUser = localStorage.getItem('currentUser');
        updateUserDisplay(currentUser);
        
        // Verificar si es admin y configurar botón
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === currentUser);
        const adminButton = document.getElementById('adminButton');
        if (user && user.isAdmin && adminButton) {
            adminButton.style.display = 'flex';
            adminButton.onclick = () => window.location.href = 'admin.html';
        }
    }
});

// Exportar funciones necesarias
window.handleLogin = handleLogin;
window.handleLogout = handleLogout; 