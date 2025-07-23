// Función para crear la malla curricular
function createMalla() {
    const mallaContainer = document.getElementById('mallaContainer');
    mallaContainer.innerHTML = '';

    mallaData.semesters.forEach(semester => {
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
                <div class="course-status">✓</div>
            `;

            courseDiv.addEventListener('click', () => toggleCourse(courseDiv, course));
            coursesDiv.appendChild(courseDiv);
        });

        semesterDiv.appendChild(coursesDiv);
        mallaContainer.appendChild(semesterDiv);
    });

    // Cargar el progreso guardado
    loadProgress();
}

// Función para alternar el estado de un curso
function toggleCourse(courseDiv, course) {
    if (courseDiv.classList.contains('disabled')) {
        showToast('Debes completar los prerrequisitos primero');
        return;
    }

    courseDiv.classList.toggle('completed');
    saveProgress();
    updateProgress();
    updateDependentCourses(course.id);
}

// Función para actualizar los cursos dependientes
function updateDependentCourses(courseId) {
    mallaData.semesters.forEach(semester => {
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
    const progress = {};
    document.querySelectorAll('.course').forEach(course => {
        progress[course.id] = course.classList.contains('completed');
    });

    // Guardar en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userIndex = users.findIndex(u => u.username === currentUser);
        if (userIndex !== -1) {
            users[userIndex].progress = progress;
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Progreso guardado para:', currentUser, progress);
        }
    }
}

// Función para cargar el progreso
function loadProgress() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === currentUser);
    
    if (user && user.progress) {
        console.log('Cargando progreso para:', currentUser, user.progress);
        
        // Primero, resetear todos los cursos
        document.querySelectorAll('.course').forEach(course => {
            course.classList.remove('completed', 'disabled');
        });

        // Luego, aplicar el progreso guardado
        Object.entries(user.progress).forEach(([courseId, completed]) => {
            const courseDiv = document.getElementById(courseId);
            if (courseDiv && completed) {
                courseDiv.classList.add('completed');
            }
        });

        // Finalmente, actualizar el estado de los prerrequisitos
        mallaData.semesters.forEach(semester => {
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

        // Actualizar la barra de progreso
        updateProgress();
    }
}

// Función para actualizar el progreso
function updateProgress() {
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

    if (percentage === 100) {
        showToast('¡Felicitaciones! Has completado todas las materias.');
    }
}

// Función para mostrar mensajes
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    createMalla();
}); 