
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Elementos do formulário
const profileForm = document.querySelector("#profile-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const birthDateInput = document.querySelector("#birth-date");
const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");
const profileMessage = document.querySelector("#profile-message");

// Carrega os dados do usuário autenticado
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    emailInput.value = user.email || "";

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
            const profileData = userSnapshot.data();

            nameInput.value = profileData.name || user.displayName || "";
            birthDateInput.value = profileData.birthDate || "";
            heightInput.value = profileData.height ?? "";
            weightInput.value = profileData.weight ?? "";
        } else {
            nameInput.value = user.displayName || "";
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);

        profileMessage.textContent =
            "Não foi possível carregar suas informações.";
    }
});

// Salva as alterações do perfil
if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = auth.currentUser;

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        const name = nameInput.value.trim();
        const birthDate = birthDateInput.value;
        const height = heightInput.value;
        const weight = weightInput.value;

        profileMessage.textContent = "";

        if (!name) {
            profileMessage.textContent = "Informe seu nome completo.";
            return;
        }

        try {
            const userRef = doc(db, "users", user.uid);

            await setDoc(userRef, {
                name: name,
                email: user.email,
                birthDate: birthDate || null,
                height: height ? Number(height) : null,
                weight: weight ? Number(weight) : null,
                updatedAt: serverTimestamp()
            }, { merge: true });

            profileMessage.textContent =
                "Perfil atualizado com sucesso.";

        } catch (error) {
            console.error("Erro ao salvar perfil:", error);

            profileMessage.textContent =
                "Não foi possível salvar as alterações.";
        }
    });
}
