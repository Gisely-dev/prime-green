
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

import { auth, db } from "./firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Cadastro de novos usuários
const registerForm = document.querySelector("#register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirm-password").value;
        const message = document.querySelector("#form-message");

        message.textContent = "";

        if (password !== confirmPassword) {
            message.textContent = "As senhas não são iguais.";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                role: "aluno",
                createdAt: serverTimestamp()
            });

            window.location.href = "login.html";

        } catch (error) {
            message.textContent = getAuthErrorMessage(error.code);
        }
    });
}

// Login de usuários cadastrados
const loginForm = document.querySelector("#login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const message = document.querySelector("#form-message");

        message.textContent = "";

        try {
            await signInWithEmailAndPassword(auth, email, password);

            window.location.href = "dashboard.html";

        } catch (error) {
            message.textContent = getAuthErrorMessage(error.code);
        }
    });
}

// Mensagens de erro
function getAuthErrorMessage(errorCode) {
    const errors = {
        "auth/email-already-in-use": "Este e-mail já está cadastrado.",
        "auth/invalid-email": "Digite um e-mail válido.",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde."
    };

    return errors[errorCode] || "Não foi possível concluir a operação. Tente novamente.";
}
