import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Cadastra um novo treino
async function saveWorkout(workout) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    if (!workout.title || !workout.title.trim()) {
        throw new Error("O treino precisa de um nome.");
    }

    const workoutData = {
        title: workout.title.trim(),
        description: workout.description?.trim() || "",
        exercises: Array.isArray(workout.exercises)
            ? workout.exercises
            : [],
        createdAt: serverTimestamp()
    };

    const workoutsRef = collection(
        db,
        "users",
        user.uid,
        "workouts"
    );

    const document = await addDoc(workoutsRef, workoutData);

    return document.id;
}

// Busca os treinos cadastrados
async function getWorkouts() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const workoutsRef = collection(
        db,
        "users",
        user.uid,
        "workouts"
    );

    const workoutsQuery = query(
        workoutsRef,
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(workoutsQuery);

    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}

// Exclui um treino
async function deleteWorkout(workoutId) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    if (!workoutId) {
        throw new Error("Identificador do treino não informado.");
    }

    const workoutRef = doc(
        db,
        "users",
        user.uid,
        "workouts",
        workoutId
    );

    await deleteDoc(workoutRef);
}

export {
    saveWorkout,
    getWorkouts,
    deleteWorkout
};