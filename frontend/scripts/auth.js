
import { auth } from "./firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const formMessage = document.getElementById("form-message");

function showMessage(message, type = "error") {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.dataset.type = type;
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            showMessage("As senhas não coincidem.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await updateProfile(userCredential.user, {
                displayName: name
            });

            showMessage("Conta criada com sucesso!", "success");

            registerForm.reset();
        } catch (error) {
            showMessage("Não foi possível criar a conta. Verifique os dados.");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);

            window.location.href = "dashboard.html";
        } catch (error) {
            showMessage("E-mail ou senha inválidos.");
        }
    });
}
