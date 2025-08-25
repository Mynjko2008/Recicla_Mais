/**
 * esqueceu.js - Script para a página de redefinição de senha do Recicla+
 * Responsável pela validação do formulário e interações
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elementos do formulário
  const form = document.getElementById("redefinicao-senha-form");
  const email = document.getElementById("input-email");
  const senha = document.getElementById("input-senha");
  const confirmarSenha = document.getElementById("input-confirmar-senha");

  // Elementos de erro
  const emailError = document.getElementById("email-error");
  const senhaError = document.getElementById("senha-error");
  const confirmarSenhaError = document.getElementById("confirmar-senha-error");

  // Elementos de requisitos de senha
  const lengthReq = document.getElementById("length");
  const uppercaseReq = document.getElementById("uppercase");
  const lowercaseReq = document.getElementById("lowercase");
  const numberReq = document.getElementById("number");
  const specialReq = document.getElementById("special");

  // Mostrar/ocultar senha
  document.querySelectorAll(".toggle-password").forEach(function (icon) {
    icon.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const target = document.getElementById(targetId);

      // Alterna o tipo de input entre password e text
      target.type = target.type === "password" ? "text" : "password";

      // Alterna o ícone entre olho e olho riscado
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  });

  // Validação em tempo real da senha
  senha.addEventListener("input", function () {
    const senhaValor = senha.value;
    validarRequisitosSenha(senhaValor);
    if (confirmarSenha.value) {
      validarSenhasIguais();
    }
  });

  // Verificar se as senhas são iguais quando o usuário digita na confirmação
  confirmarSenha.addEventListener("input", validarSenhasIguais);

  function validarSenhasIguais() {
    if (senha.value !== confirmarSenha.value) {
      confirmarSenhaError.textContent = "As senhas não coincidem";
    } else {
      confirmarSenhaError.textContent = "";
    }
  }

  function validarRequisitosSenha(senhaValor) {
    lengthReq.classList.toggle("valid", senhaValor.length >= 8 && senhaValor.length <= 15);
    uppercaseReq.classList.toggle("valid", /[A-Z]/.test(senhaValor));
    lowercaseReq.classList.toggle("valid", /[a-z]/.test(senhaValor));
    numberReq.classList.toggle("valid", /[0-9]/.test(senhaValor));
    specialReq.classList.toggle("valid", /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor));
  }

  // Validação do email
  email.addEventListener("blur", function () {
    if (!validarEmail(email.value)) {
      emailError.textContent = "Por favor, insira um e-mail válido";
    } else {
      emailError.textContent = "";
    }
  });

  // Validação e envio do formulário
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    // Limpar mensagens de erro
    emailError.textContent = "";
    senhaError.textContent = "";
    confirmarSenhaError.textContent = "";

    // Validar email
    if (!validarEmail(email.value)) {
      emailError.textContent = "Por favor, insira um e-mail válido";
      isValid = false;
    }

    // Validar senha
    const senhaValor = senha.value;
    if (!validarSenha(senhaValor)) {
      senhaError.textContent = "A senha não atende a todos os requisitos";
      isValid = false;
    }

    // Validar confirmação de senha
    if (senhaValor !== confirmarSenha.value) {
      confirmarSenhaError.textContent = "As senhas não coincidem";
      isValid = false;
    }

    // Se tudo estiver válido, enviar o formulário
    if (isValid) {
      const formData = new FormData(form);

      // Mostrar mensagem de loading
      const btnForm = document.querySelector(".btn-form");
      const btnText = btnForm.textContent;
      btnForm.textContent = "Redefinindo...";
      btnForm.disabled = true;

      fetch("../Back-End/redefinir_senha.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          // Restaurar botão
          btnForm.textContent = btnText;
          btnForm.disabled = false;

          if (data.trim() === "success") {
            // Criar elemento para mensagem de sucesso
            const successMessage = document.createElement("div");
            successMessage.className = "success-message";
            successMessage.textContent =
              "✅ Redefinição realizada com sucesso! Redirecionando...";

            // Inserir antes do botão
            form.insertBefore(successMessage, btnForm.parentNode);

            // Redirecionar após delay
            setTimeout(() => {
              window.location.href = "login.html"; // Verifique se o caminho está correto
            }, 2000);
          } else {
            // Tratar erros do servidor
            if (data.trim() === "usuario_nao_encontrado") {
              emailError.textContent =
                "❌ Nenhum usuário encontrado com esse e-mail.";
            } else if (data.trim() === "erro_atualizar_senha") {
              exibirMensagemErro("⚠️ Ocorreu um erro ao atualizar sua senha. Tente novamente.");
            } else {
              exibirMensagemErro("Erro inesperado: " + data);
            }
          }
        })
        .catch((error) => {
          console.error("Erro na requisição:", error);

          // Restaurar botão
          btnForm.textContent = btnText;
          btnForm.disabled = false;

          // Exibir mensagem de erro
          exibirMensagemErro("Erro de conexão com o servidor. Tente novamente mais tarde.");
        });
    }
  });

  // Função para validar formato de email
  function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Função para validar senha
  function validarSenha(senhaValor) {
    return senhaValor.length >= 8 && senhaValor.length <= 15 &&
           /[A-Z]/.test(senhaValor) &&
           /[a-z]/.test(senhaValor) &&
           /[0-9]/.test(senhaValor) &&
           /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor);
  }

  // Função para exibir mensagens de erro
  function exibirMensagemErro(mensagem) {
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-server";
    errorMessage.textContent = mensagem;

    // Inserir antes do botão
    form.insertBefore(errorMessage, document.querySelector(".btn-form").parentNode);

    // Remover após 5 segundos
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
});
