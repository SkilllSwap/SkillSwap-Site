import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const resetPasswordForm = document.getElementById("resetPasswordForm");

  resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    // garanti que o campo de email não está vazio
    if (!email) {
      alert("Por favor, insira um email válido.");
      return;
    }

    const auth = getAuth();

    try {
      // Envia o link de redefinição de senha para o e-mail do usuário
      await sendPasswordResetEmail(auth, email);
      alert("Um email de redefinição de senha foi enviado. Verifique sua caixa de entrada.");

      window.location.href = 'login.html'; 
    } catch (error) {
      console.error("Erro ao enviar o email de redefinição:", error);
      alert("Erro ao redefinir a senha. Verifique o email inserido.");
    }
  });
});
