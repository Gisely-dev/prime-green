import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Registra a conclusão de um treino
async function saveWorkoutLog(log) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    if (!log.workoutId) {
        throw new Error("Treino não informado.");
    }

    const duration = Number(log.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
        throw new Error("Informe uma duração válida.");
    }

    const logData = {
        workoutId: log.workoutId,
        workoutTitle: log.workoutTitle || "",
        duration: duration,
        notes: log.notes?.trim() || "",
        completedAt: serverTimestamp()
    };

    const logsRef = collection(
        db,
        "users",
        user.uid,
        "workoutLogs"
    );

    const document = await addDoc(logsRef, logData);

    return document.id;
}

// Consulta o histórico de treinos concluídos
async function getWorkoutLogs() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const logsRef = collection(
        db,
        "users",
        user.uid,
        "workoutLogs"
    );

    const logsQuery = query(
        logsRef,
        orderBy("completedAt", "desc")
    );

    const snapshot = await getDocs(logsQuery);

    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}

export {
    saveWorkoutLog,
    getWorkoutLogs
};