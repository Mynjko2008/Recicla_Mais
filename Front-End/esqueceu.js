/**
 * esqueceu.js - Script para a página de recuperação de senha do Recicla+
 * Responsável pela validação do formulário e envio do e-mail de redefinição
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elementos do formulário
  const form = document.getElementById("esqueceu-form");
  const email = document.getElementById("input-email");
  const emailError = document.getElementById("email-error");

  // Validação do email em tempo real
  email.addEventListener("blur", function () {
    if (!validarEmail(email.value)) {
      emailError.textContent = "Por favor, insira um e-mail válido";
    } else {
      emailError.textContent = "";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    const formData = new FormData(form);

    // Botão em modo "loading"
    const btnForm = document.querySelector(".btn-form");
    btnForm.classList.add("loading");
    btnForm.disabled = true;

    fetch("../Back-end/esqueceu.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        btnForm.classList.remove("loading");
        btnForm.disabled = false;

        const resposta = data.trim();
        if (resposta === "success") {
          const successMessage = document.createElement("div");
          successMessage.className = "success-message";
          successMessage.textContent =
            "📩 Um link de redefinição foi enviado para seu e-mail!";
          form.appendChild(successMessage);

          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        } else if (resposta === "usuario_nao_encontrado") {
          const errorMessage = document.createElement("div");
          errorMessage.className = "error-server";
          errorMessage.textContent =
            "❌ Nenhum usuário encontrado com esse e-mail.";
          form.appendChild(errorMessage);

          setTimeout(() => errorMessage.remove(), 5000);
        } else {
          const errorMessage = document.createElement("div");
          errorMessage.className = "error-server";
          errorMessage.textContent = "Erro: " + resposta;
          form.appendChild(errorMessage);

          setTimeout(() => errorMessage.remove(), 5000);
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
        btnForm.classList.remove("loading");
        btnForm.disabled = false;

        const errorMessage = document.createElement("div");
        errorMessage.className = "error-server";
        errorMessage.textContent =
          "Erro de conexão com o servidor. Tente novamente mais tarde.";
        form.appendChild(errorMessage);

        setTimeout(() => errorMessage.remove(), 5000);
      });
  });

  // Função utilitária de validação
  function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
