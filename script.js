// Variable global para la malla actual
let currentMallaData;

// Función para obtener la malla según la carrera
function getMallaData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return mallaData; // Malla por defecto

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);
    
    if (!user) return mallaData; // Malla por defecto

    switch (user.career) {
        case 'veterinaria':
            return mallaData;
        case 'derecho':
            return mallaDataDerecho;
        case 'medicina':
            return mallaDataMedicina; // Pendiente de crear
        default:
            return mallaData;
    }
}

// Función para actualizar la malla completa
function updateMallaDisplay() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);
    if (!user) return;

    // Actualizar la malla
    currentMallaData = getMallaData();

    // Limpiar y recrear la malla
    const mallaContainer = document.getElementById('mallaContainer');
    if (mallaContainer) {
        mallaContainer.innerHTML = '';
        createMalla();
    }

    // Actualizar el título con la carrera
    const careerNames = {
        'veterinaria': 'Medicina Veterinaria',
        'derecho': 'Derecho',
        'medicina': 'Medicina'
    };
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = `Malla Curricular - ${careerNames[user.career] || 'Medicina Veterinaria'} - ${user.username}`;
    }
}

// Función para crear la malla curricular
function createMalla() {
    const mallaContainer = document.getElementById('mallaContainer');
    if (!mallaContainer) return;

    // Asegurarse de que tenemos datos de malla
    currentMallaData = currentMallaData || getMallaData();
    if (!currentMallaData) return;

    mallaContainer.innerHTML = '';

    currentMallaData.semesters.forEach(semester => {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'semester-title';
        titleDiv.textContent = `Semestre ${semester.number}`;
        semesterDiv.appendChild(titleDiv);

        const coursesDiv = document.createElement('div');
        coursesDiv.className = 'courses-grid';

        semester.courses.forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.className = 'course';
            courseDiv.id = course.id;
            courseDiv.innerHTML = `
                <div class="course-name">${course.name}</div>
                <div class="course-status"></div>
            `;

            courseDiv.addEventListener('click', () => toggleCourse(courseDiv, course));
            coursesDiv.appendChild(courseDiv);
        });

        semesterDiv.appendChild(coursesDiv);
        mallaContainer.appendChild(semesterDiv);
    });

    // Cargar el progreso guardado
    loadSavedProgress();
}

// Función para alternar el estado de un curso
function toggleCourse(courseDiv, course) {
    if (!courseDiv || !course) return;

    if (courseDiv.classList.contains('disabled')) {
        // Obtener los nombres de los prerrequisitos faltantes
        const prerequisitesNames = course.prerequisites.map(prereqId => {
            const prereqElement = document.getElementById(prereqId);
            if (prereqElement && !prereqElement.classList.contains('completed')) {
                return prereqElement.querySelector('.course-name').textContent;
            }
            return null;
        }).filter(name => name !== null);

        if (prerequisitesNames.length > 0) {
            const message = `No se puede cursar porque aún no has aprobado: ${prerequisitesNames.join(', ')}`;
            showToast(message);
        }
        return;
    }

    courseDiv.classList.toggle('completed');
    const statusDiv = courseDiv.querySelector('.course-status');
    if (statusDiv) {
        statusDiv.textContent = courseDiv.classList.contains('completed') ? '✓' : '';
    }
    updateDependentCourses(course.id);
    saveProgress();
}

// Función para actualizar los cursos dependientes
function updateDependentCourses(courseId) {
    currentMallaData.semesters.forEach(semester => {
        semester.courses.forEach(course => {
            if (course.prerequisites.includes(courseId)) {
                const courseDiv = document.getElementById(course.id);
                if (courseDiv) {
                    const hasPrerequisites = course.prerequisites.every(prereq => {
                        const prereqElement = document.getElementById(prereq);
                        return prereqElement && prereqElement.classList.contains('completed');
                    });
                    courseDiv.classList.toggle('disabled', !hasPrerequisites);
                }
            }
        });
    });
}

// Función para guardar el progreso
function saveProgress() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const progress = {};
    document.querySelectorAll('.course').forEach(course => {
        progress[course.id] = course.classList.contains('completed');
    });

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser);
    
    if (userIndex !== -1) {
        users[userIndex].progress = progress;
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Progreso guardado para:', currentUser, progress);
    }

    updateProgressBar();
}

// Función para cargar el progreso guardado
function loadSavedProgress() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);

    if (user && user.progress) {
        console.log('Cargando progreso para:', currentUser, user.progress);

        // Resetear todos los cursos
        document.querySelectorAll('.course').forEach(course => {
            course.classList.remove('completed', 'disabled');
            course.querySelector('.course-status').textContent = '';
        });

        // Aplicar el progreso guardado
        Object.entries(user.progress).forEach(([courseId, completed]) => {
            const courseDiv = document.getElementById(courseId);
            if (courseDiv && completed) {
                courseDiv.classList.add('completed');
                courseDiv.querySelector('.course-status').textContent = '✓';
            }
        });

        // Actualizar prerrequisitos
        currentMallaData.semesters.forEach(semester => {
            semester.courses.forEach(course => {
                if (course.prerequisites.length > 0) {
                    const courseDiv = document.getElementById(course.id);
                    if (courseDiv) {
                        const hasPrerequisites = course.prerequisites.every(prereq => {
                            const prereqElement = document.getElementById(prereq);
                            return prereqElement && prereqElement.classList.contains('completed');
                        });
                        courseDiv.classList.toggle('disabled', !hasPrerequisites);
                    }
                }
            });
        });

        updateProgressBar();
    }
}

// Función para actualizar la barra de progreso
function updateProgressBar() {
    const total = document.querySelectorAll('.course').length;
    const completed = document.querySelectorAll('.course.completed').length;
    const percentage = Math.round((completed / total) * 100);

    const progressBar = document.getElementById('totalProgress');
    const progressText = document.getElementById('progressPercentage');
    
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${percentage}%`;
    }
}

// Función para mostrar mensajes
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.error('Elemento toast no encontrado');
        return;
    }

    // Limpiar cualquier temporizador existente
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }

    // Asegurarse de que el mensaje esté visible
    toast.textContent = message;
    toast.classList.add('show');

    // Configurar el temporizador para ocultar
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando malla...');
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        console.log('Usuario encontrado:', currentUser);
        updateMallaDisplay();
    } else {
        console.log('No hay usuario logueado');
        createMalla(); // Mostrar malla por defecto
    }
}); 