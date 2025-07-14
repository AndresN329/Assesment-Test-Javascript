// Lógica para gestionar inscripciones 
const API_URL = 'http://localhost:3000/enrollments';

export const createEnrollment = async (enrollmentData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
    });
    if (!response.ok) {
        throw new Error('No se pudo procesar la inscripción.');
    }
    return await response.json();
};

export const checkEnrollment = async (userId, courseId) => {
    const response = await fetch(`${API_URL}?userId=${userId}&courseId=${courseId}`);
    if (!response.ok) {
        throw new Error('Error al verificar la inscripción.');
    }
    const enrollments = await response.json();
    return enrollments.length > 0;
}; 