// Variable global para la malla actual
let currentMallaData;

// Función para obtener el nombre de la carrera
function getCareerName(career) {
    const careers = {
        'veterinaria': 'Medicina Veterinaria',
        'derecho': 'Derecho',
        'medicina': 'Medicina'
    };
    return careers[career] || career;
}

// Función para obtener la malla según la carrera
function getMallaData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return mallaData;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);
    
    if (!user) return mallaData;

    console.log('Cargando malla para carrera:', user.career);

    // Actualizar el título con el nombre y la carrera
    const careerName = getCareerName(user.career);
    const titleElement = document.querySelector('h1');
    if (titleElement) {
        titleElement.textContent = `Malla Curricular - ${careerName} - ${user.fullName || user.username}`;
    }

    // Retornar la malla correspondiente según la carrera
    let selectedMalla;
    switch (user.career) {
        case 'veterinaria':
            selectedMalla = mallaData;
            break;
        case 'derecho':
            selectedMalla = mallaDataDerecho;
            break;
        case 'medicina':
            selectedMalla = mallaDataMedicina;
            break;
        default:
            selectedMalla = mallaData;
    }

    console.log('Malla seleccionada:', user.career, selectedMalla ? 'encontrada' : 'no encontrada');
    return selectedMalla;
}

// Función para actualizar la malla completa
function updateMallaDisplay() {
    console.log('Iniciando updateMallaDisplay');
    currentMallaData = getMallaData();
    
    if (!currentMallaData) {
        console.error('No se encontraron datos de malla');
        return;
    }

    const mallaContainer = document.getElementById('mallaContainer');
    if (!mallaContainer) {
        console.error('No se encontró el contenedor de la malla');
        return;
    }

    console.log('Limpiando y recreando malla');
    mallaContainer.innerHTML = '';
    createMalla();
}

// Función para crear la malla curricular
function createMalla() {
    const mallaContainer = document.getElementById('mallaContainer');
    if (!mallaContainer) return;

    currentMallaData = currentMallaData || getMallaData();
    if (!currentMallaData) {
        console.error('No hay datos de malla disponibles');
        return;
    }

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
            
            // Crear el contenido del curso
            const courseNameDiv = document.createElement('div');
            courseNameDiv.className = 'course-name';
            courseNameDiv.textContent = course.name;
            
            const courseStatusDiv = document.createElement('div');
            courseStatusDiv.className = 'course-status';
            
            courseDiv.appendChild(courseNameDiv);
            courseDiv.appendChild(courseStatusDiv);
            
            // Agregar tooltip solo si tiene prerrequisitos
            if (course.prerequisites && course.prerequisites.length > 0) {
                const prerequisiteNames = course.prerequisites.map(prereqId => {
                    const semester = currentMallaData.semesters.find(sem => 
                        sem.courses.some(c => c.id === prereqId)
                    );
                    const prereqCourse = semester ? semester.courses.find(c => c.id === prereqId) : null;
                    return prereqCourse ? prereqCourse.name : prereqId;
                }).filter(name => name);
                
                if (prerequisiteNames.length > 0) {
                    const tooltipDiv = document.createElement('div');
                    tooltipDiv.className = 'course-tooltip';
                    const tooltipContent = document.createTextNode('Prerrequisitos:');
                    tooltipDiv.appendChild(tooltipContent);
                    
                    prerequisiteNames.forEach((name, index) => {
                        tooltipDiv.appendChild(document.createElement('br'));
                        tooltipDiv.appendChild(document.createTextNode(name));
                    });
                    
                    courseDiv.appendChild(tooltipDiv);

                    // Verificar si los prerrequisitos están completos
                    const hasPrerequisites = course.prerequisites.every(prereq => {
                        const prereqElement = document.getElementById(prereq);
                        return prereqElement && prereqElement.classList.contains('completed');
                    });

                    if (!hasPrerequisites) {
                        courseDiv.classList.add('disabled');
                    }
                }
            }

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
        return;
    }

    const wasCompleted = courseDiv.classList.contains('completed');
    courseDiv.classList.toggle('completed');
    
    // Agregar clase temporal para la animación
    if (!wasCompleted) {
        courseDiv.classList.add('just-completed');
        setTimeout(() => courseDiv.classList.remove('just-completed'), 600);
    } else {
        courseDiv.classList.add('just-uncompleted');
        setTimeout(() => courseDiv.classList.remove('just-uncompleted'), 300);
    }

    const statusDiv = courseDiv.querySelector('.course-status');
    if (statusDiv) {
        if (!wasCompleted) {
            statusDiv.textContent = '✓';
            // Reiniciar la animación del checkmark
            statusDiv.style.animation = 'none';
            statusDiv.offsetHeight; // Forzar reflow
            statusDiv.style.animation = null;
        } else {
            statusDiv.textContent = '';
        }
    }

    // Si estamos desmarcando un curso, necesitamos desmarcar también los cursos que dependen de él
    if (wasCompleted) {
        deactivateDependentCourses(course.id);
    }

    updateDependentCourses(course.id);
    saveProgress();
}

// Función para desactivar cursos que dependen de un prerrequisito
function deactivateDependentCourses(courseId) {
    currentMallaData.semesters.forEach(semester => {
        semester.courses.forEach(course => {
            if (course.prerequisites.includes(courseId)) {
                const courseDiv = document.getElementById(course.id);
                if (courseDiv && courseDiv.classList.contains('completed')) {
                    courseDiv.classList.remove('completed');
                    const statusDiv = courseDiv.querySelector('.course-status');
                    if (statusDiv) {
                        statusDiv.textContent = '';
                    }
                    // Recursivamente desactivar los cursos que dependen de este
                    deactivateDependentCourses(course.id);
                }
            }
        });
    });
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
                    
                    const wasEnabled = !courseDiv.classList.contains('disabled');
                    courseDiv.classList.toggle('disabled', !hasPrerequisites);
                    
                    // Si el curso cambia de estado, agregar animación
                    if (wasEnabled !== hasPrerequisites) {
                        courseDiv.style.animation = 'none';
                        courseDiv.offsetHeight; // Forzar reflow
                        courseDiv.style.animation = null;
                    }
                    
                    // Si el curso está marcado como completado pero ya no tiene los prerrequisitos, desmarcarlo
                    if (!hasPrerequisites && courseDiv.classList.contains('completed')) {
                        courseDiv.classList.remove('completed');
                        courseDiv.classList.add('just-uncompleted');
                        setTimeout(() => courseDiv.classList.remove('just-uncompleted'), 300);
                        
                        const statusDiv = courseDiv.querySelector('.course-status');
                        if (statusDiv) {
                            statusDiv.textContent = '';
                        }
                        // Recursivamente actualizar los cursos que dependen de este
                        updateDependentCourses(course.id);
                    }
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
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === currentUser);
        if (user) {
            console.log('Carrera del usuario:', user.career);
        }
        updateMallaDisplay();
    } else {
        console.log('No hay usuario logueado');
        createMalla(); // Mostrar malla por defecto
    }
}); 