const API_URL = 'http://localhost:3000/courses';

export const getCourses = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('No se pudo obtener la lista de cursos.');
    }
    return await response.json();
};

export const getCourseById = async (courseId) => {
    const response = await fetch(`${API_URL}/${courseId}`);
    if (!response.ok) {
        throw new Error('No se pudo obtener el curso.');
    }
    return await response.json();
};

export const createCourse = async (courseData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    });
    if (!response.ok) {
        throw new Error('No se pudo crear el curso.');
    }
    return await response.json();
};

export const updateCourse = async (courseId, courseData) => {
    const response = await fetch(`${API_URL}/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
    });
    if (!response.ok) {
        throw new Error('No se pudo actualizar el curso.');
    }
    return await response.json();
};

export const deleteCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/${courseId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('No se pudo eliminar el curso.');
    }
    return await response.json();
}; 