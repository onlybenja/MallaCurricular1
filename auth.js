// Función para cargar las preferencias del usuario
function loadUserPreferences(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username);
    
    if (user && user.colors) {
        document.documentElement.style.setProperty('--color-primary', user.colors.primary);
        document.documentElement.style.setProperty('--color-primary-dark', user.colors.secondary);
        
        const rgb = hexToRgb(user.colors.primary);
        if (rgb) {
            document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
    }
    
    if (user && user.font) {
        document.documentElement.style.setProperty('--font-family', `'${user.font}', sans-serif`);
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
    
    const userDisplay = document.getElementById('userDisplay');
    const accountName = document.getElementById('accountName');
    
    if (userDisplay) userDisplay.textContent = displayName;
    if (accountName) accountName.textContent = displayName;
}

// Función para manejar el inicio de sesión
function handleLogin(username, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return false;

    localStorage.setItem('currentUser', username);
    
    // Si el usuario no es admin y está en la página de admin, redirigir a index
    if (!user.isAdmin && window.location.pathname.includes('admin.html')) {
        window.location.replace('index.html');
        return true;
    }

    // Actualizar la interfaz
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // Mostrar/ocultar botón de admin
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        adminButton.style.display = user.isAdmin ? 'flex' : 'none';
    }

    updateUserDisplay(username);
    loadUserPreferences(username);

    if (typeof updateMallaDisplay === 'function') {
        updateMallaDisplay();
        loadSavedProgress();
    }

    return true;
}

// Función para verificar si hay un usuario logueado
function checkLoggedInUser() {
    const currentUser = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);

    // Redirigir si es necesario
    if (window.location.pathname.includes('admin.html') && (!user || !user.isAdmin)) {
        window.location.replace('index.html');
        return false;
    }

    // Actualizar interfaz
    const loginModal = document.getElementById('loginModal');
    const mainContent = document.getElementById('mainContent');
    
    if (loginModal) loginModal.style.display = currentUser ? 'none' : 'flex';
    if (mainContent) mainContent.style.display = currentUser ? 'block' : 'none';

    if (!currentUser) return false;

    // Configurar interfaz para usuario logueado
    loadUserPreferences(currentUser);
    updateUserDisplay(currentUser);

    if (typeof updateMallaDisplay === 'function') {
        updateMallaDisplay();
    }

    return true;
}

// Función para cerrar sesión
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Inicializar usuario admin por defecto
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
    checkLoggedInUser();

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

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target)) {
                profileMenu.classList.remove('active');
            }
        });
    }

    // Botón de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

// Exportar funciones necesarias
window.handleLogin = handleLogin;
window.handleLogout = handleLogout; 