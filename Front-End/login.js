/**
 * login.js - Script para a página de login do Recicla+
 * Responsável pela validação do formulário, exibição de erros e interações
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do formulário
    const form = document.getElementById('login-form');
    const email = document.getElementById('input-email');
    const senha = document.getElementById('input-password');

    // Elementos de erro
    const emailError = document.getElementById('email-error');
    const senhaError = document.getElementById('senha-error');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const target = document.getElementById(targetId);

            // Alterna o tipo de input entre password e text
            target.type = target.type === 'password' ? 'text' : 'password';

            // Alterna o ícone entre olho e olho riscado
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Validação do email em tempo real
    email.addEventListener('input', function () {
        if (!validarEmail(email.value)) {
            emailError.textContent = 'Por favor, insira um e-mail válido';
        } else {
            emailError.textContent = '';
        }
    });

    // Validação e envio do formulário
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        // Limpar mensagens de erro
        emailError.textContent = '';
        senhaError.textContent = '';

        // Validar email
        if (!validarEmail(email.value)) {
            emailError.textContent = 'Por favor, insira um e-mail válido';
            isValid = false;
        }

        // Validar senha
        if (senha.value.trim() === '') {
            senhaError.textContent = 'Por favor, insira sua senha';
            isValid = false;
        }

        // Se o formulário não for válido, não prosseguir
        if (!isValid) return;

        // Preparar dados do formulário
        const formData = new FormData(form);

        // Mostrar estado de "Entrando..."
        const btnForm = document.querySelector('.btn-form');
        const btnText = btnForm.textContent;
        btnForm.textContent = 'Entrando...';
        btnForm.disabled = true;

        // Requisição para o servidor
        fetch('../Back-End/login.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                // Restaurar botão
                btnForm.textContent = btnText;
                btnForm.disabled = false;

                // Tratar resposta do servidor
                switch (data.trim()) {
                    case 'success':
                        // Criar elemento para mensagem de sucesso
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.textContent = '✅ Login realizado com sucesso! Redirecionando...';
                        
                        // Inserir antes do botão
                        form.insertBefore(successMessage, btnForm.parentNode);

                        // Redirecionar após delay
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }, 2000);
                        break;

                    case 'senha_incorreta':
                        senhaError.textContent = 'Senha incorreta';
                        break;

                    case 'usuario_nao_encontrado':
                        emailError.textContent = 'Usuário não encontrado';
                        break;

                    default:
                        exibirMensagemErro('Erro inesperado: ' + data);
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                btnForm.textContent = btnText;
                btnForm.disabled = false;
                exibirMensagemErro('Erro de conexão com o servidor. Tente novamente mais tarde.');
            });
    });

    // Função para validar formato de email
    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Função para exibir mensagens de erro
    function exibirMensagemErro(mensagem) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-server';
        errorMessage.textContent = mensagem;

        // Inserir antes do botão
        form.insertBefore(errorMessage, document.querySelector('.btn-form').parentNode);

        // Remover após 5 segundos
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
});
