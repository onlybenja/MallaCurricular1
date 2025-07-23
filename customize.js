// Colores predefinidos para el modo fácil
const predefinedColors = [
    { primary: '#FFB6DF', secondary: '#FF69B4' }, // Rosa (default)
    { primary: '#B6E3FF', secondary: '#4DA9FF' }, // Azul
    { primary: '#B8F4B8', secondary: '#4CAF50' }, // Verde
    { primary: '#FFD1B6', secondary: '#FF8C42' }, // Naranja
    { primary: '#E1B6FF', secondary: '#9C27B0' }, // Púrpura
    { primary: '#FFB6B6', secondary: '#FF4242' }, // Rojo
    { primary: '#F4F4B8', secondary: '#FFD700' }, // Amarillo
    { primary: '#B6FFE4', secondary: '#00BFA5' }, // Turquesa
    { primary: '#C7B6FF', secondary: '#6200EA' }, // Violeta
    { primary: '#FFE0B6', secondary: '#FF6D00' }, // Mandarina
    { primary: '#B6FFD9', secondary: '#00C853' }, // Esmeralda
    { primary: '#FFB6E8', secondary: '#D500F9' }, // Magenta
    { primary: '#B6FFFF', secondary: '#00B8D4' }, // Aguamarina
    { primary: '#FFB6C1', secondary: '#FF1744' }  // Coral
];

// Lista de fuentes disponibles
const availableFonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Raleway', 'Ubuntu', 'Playfair Display', 'Merriweather',
    'Source Sans Pro', 'Nunito', 'Quicksand', 'Josefin Sans',
    'Work Sans', 'Mulish', 'Inter', 'Rubik', 'DM Sans',
    'Manrope', 'Space Grotesk'
];

// Variables para el estado actual
let currentColorMode = 'easy';
let currentTab = 'colors';

// Elementos DOM
const colorModal = document.getElementById('colorModal');
const closeColorModal = document.getElementById('closeColorModal');
const customizeButton = document.getElementById('customizeButton');
const easyModeBtn = document.getElementById('easyModeBtn');
const advancedModeBtn = document.getElementById('advancedModeBtn');
const easyMode = document.getElementById('easyMode');
const advancedMode = document.getElementById('advancedMode');
const colorPalette = document.getElementById('colorPalette');
const secondaryColorAdv = document.getElementById('secondaryColorAdv');
const primaryColorAdv = document.getElementById('primaryColorAdv');
const colorsTabBtn = document.getElementById('colorsTabBtn');
const fontTabBtn = document.getElementById('fontTabBtn');
const colorsSection = document.getElementById('colorsSection');
const fontSection = document.getElementById('fontSection');
const fontGrid = document.getElementById('fontGrid');

// Función para inicializar la paleta de colores
function initializeColorPalette() {
    colorPalette.innerHTML = '';
    const easyModeText = document.querySelector('#easyMode p');
    if (easyModeText) {
        easyModeText.textContent = 'Elige un color principal:';
    }

    // Actualizar textos en modo avanzado
    const advancedLabels = document.querySelectorAll('#advancedMode .color-option label');
    if (advancedLabels.length >= 2) {
        advancedLabels[0].textContent = 'Color principal:';
        advancedLabels[1].textContent = 'Color secundario:';
    }

    predefinedColors.forEach((color, index) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'palette-color';
        colorButton.style.backgroundColor = color.secondary;
        colorButton.setAttribute('data-primary', color.primary);
        colorButton.setAttribute('data-secondary', color.secondary);
        
        // Marcar el color por defecto
        if (index === 0) {
            colorButton.classList.add('selected');
        }
        
        colorButton.addEventListener('click', () => {
            document.querySelectorAll('.palette-color').forEach(btn => btn.classList.remove('selected'));
            colorButton.classList.add('selected');
            updateColors(color.primary, color.secondary);
        });
        
        colorPalette.appendChild(colorButton);
    });
}

// Función para inicializar la grid de fuentes
function initializeFontGrid() {
    fontGrid.innerHTML = '';
    availableFonts.forEach(font => {
        const fontOption = document.createElement('div');
        fontOption.className = 'font-option';
        if (font === 'Poppins') {
            fontOption.classList.add('active');
        }
        
        fontOption.innerHTML = `
            <div class="font-preview" style="font-family: '${font}'">
                Aa Bb Cc
            </div>
            <div class="font-name">${font}</div>
        `;
        
        fontOption.addEventListener('click', () => {
            document.querySelectorAll('.font-option').forEach(opt => opt.classList.remove('active'));
            fontOption.classList.add('active');
            updateFont(font);
        });
        
        fontGrid.appendChild(fontOption);
    });
}

// Función para actualizar los colores
function updateColors(primary, secondary) {
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-dark', secondary);
    
    // Convertir el color primario a RGB para usar en transparencias
    const rgb = hexToRgb(primary);
    if (rgb) {
        document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
    // Guardar preferencias para el usuario actual
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser);
        
        if (userIndex !== -1) {
            users[userIndex].colors = {
                primary,
                secondary
            };
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Función para actualizar la fuente
function updateFont(fontFamily) {
    document.documentElement.style.setProperty('--font-family', `'${fontFamily}', sans-serif`);
    
    // Guardar preferencia de fuente para el usuario actual
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser);
        
        if (userIndex !== -1) {
            users[userIndex].font = fontFamily;
            localStorage.setItem('users', JSON.stringify(users));
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

// Event Listeners
customizeButton.addEventListener('click', () => {
    colorModal.style.display = 'flex';
});

closeColorModal.addEventListener('click', () => {
    colorModal.style.display = 'none';
});

easyModeBtn.addEventListener('click', () => {
    currentColorMode = 'easy';
    easyModeBtn.classList.add('active');
    advancedModeBtn.classList.remove('active');
    easyMode.style.display = 'block';
    advancedMode.style.display = 'none';
});

advancedModeBtn.addEventListener('click', () => {
    currentColorMode = 'advanced';
    advancedModeBtn.classList.add('active');
    easyModeBtn.classList.remove('active');
    advancedMode.style.display = 'block';
    easyMode.style.display = 'none';
});

colorsTabBtn.addEventListener('click', () => {
    currentTab = 'colors';
    colorsTabBtn.classList.add('active');
    fontTabBtn.classList.remove('active');
    colorsSection.style.display = 'block';
    fontSection.style.display = 'none';
});

fontTabBtn.addEventListener('click', () => {
    currentTab = 'fonts';
    fontTabBtn.classList.add('active');
    colorsTabBtn.classList.remove('active');
    fontSection.style.display = 'block';
    colorsSection.style.display = 'none';
});

// Event listeners para el modo avanzado
secondaryColorAdv.addEventListener('input', (e) => {
    const primary = primaryColorAdv.value;
    const secondary = e.target.value;
    updateColors(primary, secondary);
});

primaryColorAdv.addEventListener('input', (e) => {
    const primary = e.target.value;
    const secondary = secondaryColorAdv.value;
    updateColors(primary, secondary);
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === colorModal) {
        colorModal.style.display = 'none';
    }
});

// Cargar preferencias guardadas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initializeColorPalette();
    initializeFontGrid();
    
    // Cargar preferencias del usuario actual
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === currentUser);
        
        if (user) {
            // Cargar colores guardados
            if (user.colors) {
                updateColors(user.colors.primary, user.colors.secondary);
                primaryColorAdv.value = user.colors.primary;
                secondaryColorAdv.value = user.colors.secondary;
                
                // Actualizar selección en la paleta de colores
                const colorButtons = document.querySelectorAll('.palette-color');
                colorButtons.forEach(button => {
                    const buttonPrimary = button.getAttribute('data-primary');
                    const buttonSecondary = button.getAttribute('data-secondary');
                    if (buttonPrimary === user.colors.primary && buttonSecondary === user.colors.secondary) {
                        button.classList.add('selected');
                    } else {
                        button.classList.remove('selected');
                    }
                });
            }
            
            // Cargar fuente guardada
            if (user.font) {
                updateFont(user.font);
                const fontOptions = document.querySelectorAll('.font-option');
                fontOptions.forEach(option => {
                    if (option.querySelector('.font-name').textContent === user.font) {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
            }
        }
    }
}); 