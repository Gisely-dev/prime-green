
import { getMeasurements } from "./measurements.js";
import { getWorkoutLogs } from "./workoutLogs.js";

// Organiza os dados de evolução do aluno
async function getProgressSummary() {
    const measurements = await getMeasurements();
    const workoutLogs = await getWorkoutLogs();

    // Organiza as medidas da mais antiga para a mais recente
    const orderedMeasurements = [...measurements].sort((a, b) => {
        const dateA = a.recordedAt?.toDate?.() || new Date(0);
        const dateB = b.recordedAt?.toDate?.() || new Date(0);

        return dateA - dateB;
    });

    const firstMeasurement = orderedMeasurements[0] || null;
    const latestMeasurement =
        orderedMeasurements[orderedMeasurements.length - 1] || null;

    // Calcula a variação de peso entre o primeiro e o último registro
    let weightChange = null;

    if (firstMeasurement && latestMeasurement) {
        weightChange =
            Number(latestMeasurement.weight) -
            Number(firstMeasurement.weight);
    }

    // Calcula a duração média dos treinos concluídos
    let averageDuration = 0;

    if (workoutLogs.length > 0) {
        const totalDuration = workoutLogs.reduce((total, log) => {
            return total + Number(log.duration || 0);
        }, 0);

        averageDuration = totalDuration / workoutLogs.length;
    }

    // Identifica o último treino realizado
    const orderedLogs = [...workoutLogs].sort((a, b) => {
        const dateA = a.completedAt?.toDate?.() || new Date(0);
        const dateB = b.completedAt?.toDate?.() || new Date(0);

        return dateB - dateA;
    });

    const latestWorkout = orderedLogs[0] || null;

    return {
        firstMeasurement,
        latestMeasurement,
        weightChange,
        totalMeasurements: measurements.length,
        totalWorkouts: workoutLogs.length,
        averageDuration: Math.round(averageDuration),
        latestWorkout
    };
}

export { getProgressSummary };
