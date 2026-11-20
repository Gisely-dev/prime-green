import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Registra as medidas corporais do usuário
async function saveMeasurement(measures) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const measurementData = {
        weight: Number(measures.weight),
        height: Number(measures.height),
        waist: Number(measures.waist) || null,
        hip: Number(measures.hip) || null,
        chest: Number(measures.chest) || null,
        arm: Number(measures.arm) || null,
        thigh: Number(measures.thigh) || null,
        recordedAt: serverTimestamp()
    };

    if (
        !Number.isFinite(measurementData.weight) ||
        measurementData.weight <= 0 ||
        !Number.isFinite(measurementData.height) ||
        measurementData.height <= 0
    ) {
        throw new Error("Informe um peso e uma altura válidos.");
    }

    const measurementsRef = collection(
        db,
        "users",
        user.uid,
        "measurements"
    );

    const document = await addDoc(
        measurementsRef,
        measurementData
    );

    return document.id;
}

// Busca os registros de medidas do usuário
async function getMeasurements() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuário não autenticado.");
    }

    const measurementsRef = collection(
        db,
        "users",
        user.uid,
        "measurements"
    );

    const measurementsQuery = query(
        measurementsRef,
        orderBy("recordedAt", "desc")
    );

    const snapshot = await getDocs(measurementsQuery);

    return snapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
    }));
}

export { saveMeasurement, getMeasurements };