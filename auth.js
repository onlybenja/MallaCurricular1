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
    const adminButton = document.getElementById('adminButton');
    
    if (loginModal) loginModal.style.display = currentUser ? 'none' : 'flex';
    if (mainContent) mainContent.style.display = currentUser ? 'block' : 'none';
    if (adminButton && user) {
        adminButton.style.display = user.isAdmin ? 'flex' : 'none';
    }

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

// --- NUEVO SISTEMA FIRESTORE USUARIO/CONTRASEÑA ---

// REGISTRO DE USUARIO
async function registerUser(username, password, fullName, career, university) {
    try {
        // Verificar si el usuario ya existe
        const userSnap = await db.collection('users').where('username', '==', username).get();
        if (!userSnap.empty) {
            alert('El nombre de usuario ya existe');
            return null;
        }
        // Crear usuario en Firestore
        const userDoc = await db.collection('users').add({
            username,
            password, // Texto plano por simplicidad
            fullName,
            career,
            university,
            progress: {},
            isAdmin: false
        });
        return userDoc.id;
    } catch (error) {
        alert('Error al registrar usuario: ' + error.message);
        return null;
    }
}

// LOGIN DE USUARIO
async function loginUser(username, password) {
    try {
        const userSnap = await db.collection('users').where('username', '==', username).get();
        if (userSnap.empty) {
            alert('Usuario no encontrado');
            return null;
        }
        const userDoc = userSnap.docs[0];
        const userData = userDoc.data();
        if (userData.password !== password) {
            alert('Contraseña incorrecta');
            return null;
        }
        // Guardar sesión en sessionStorage
        sessionStorage.setItem('currentUserId', userDoc.id);
        return { id: userDoc.id, ...userData };
    } catch (error) {
        alert('Error al iniciar sesión: ' + error.message);
        return null;
    }
}

// CERRAR SESIÓN
function logoutUser() {
    sessionStorage.removeItem('currentUserId');
    window.location.reload();
}

// OBTENER USUARIO ACTUAL
async function getCurrentUser() {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return null;
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;
    return { id: userDoc.id, ...userDoc.data() };
}

// GUARDAR PROGRESO EN FIRESTORE
async function saveProgressToCloud(progress) {
    const userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        await db.collection('users').doc(userId).update({ progress });
    }
}

// CARGAR PROGRESO DESDE FIRESTORE
async function loadProgressFromCloud() {
    const userId = sessionStorage.getItem('currentUserId');
    if (userId) {
        const doc = await db.collection('users').doc(userId).get();
        return doc.exists ? doc.data().progress : {};
    }
    return {};
}

// --- ADAPTAR FORMULARIOS Y FLUJO ---

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDefaultAdmin();
    checkLoggedInUser();
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            const user = await loginUser(username, password);
            if (user) {
                window.location.reload();
            }
        });
    }

    // Registro (solo admin.html)
    const registerForm = document.getElementById('createAccountForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('newUserName').value.trim();
            const password = document.getElementById('newUserPassword').value;
            const university = document.getElementById('universitySelect').value;
            const career = document.getElementById('careerSelect').value;
            await registerUser(username, password, fullName, career, university);
            alert('Cuenta creada exitosamente');
            registerForm.reset();
            window.location.reload();
        });
    }

    // Botón de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logoutUser);
    }
});

// Exportar funciones necesarias para otros scripts
window.getCurrentUser = getCurrentUser;
window.saveProgressToCloud = saveProgressToCloud;
window.loadProgressFromCloud = loadProgressFromCloud;
window.logoutUser = logoutUser; 