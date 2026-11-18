
import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Verifica o estado da autenticação
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const welcomeTitle = document.querySelector(".dashboard-welcome h1");

    if (welcomeTitle) {
        const name = user.displayName || "Aluno";

        welcomeTitle.textContent = `Bem-vindo ao Prime Clube, ${name}!`;
    }
});

// Encerra a sessão do usuário
const logoutButton = document.querySelector("#logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);

            window.location.href = "login.html";

        } catch (error) {
            console.error("Erro ao encerrar a sessão:", error);

            alert("Não foi possível sair da conta. Tente novamente.");
        }
    });
}
