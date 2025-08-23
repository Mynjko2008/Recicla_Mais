/**
 * cadastro.js - Script para a página de cadastro do Recicla+
 * Responsável pela validação do formulário e interações
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elementos do formulário
    const form = document.getElementById('cadastro-form');
    const nome = document.getElementById('input-nome');
    const email = document.getElementById('input-email');
    const estado = document.getElementById('estado');
    const senha = document.getElementById('input-senha');
    const confirmarSenha = document.getElementById('input-confirmar-senha');
    
    // Elementos de erro
    const nomeError = document.getElementById('nome-error');
    const emailError = document.getElementById('email-error');
    const estadoError = document.getElementById('estado-error');
    const senhaError = document.getElementById('senha-error');
    const confirmarSenhaError = document.getElementById('confirmar-senha-error');
    
    // Elementos de requisitos de senha
    const lengthReq = document.getElementById('length');
    const uppercaseReq = document.getElementById('uppercase');
    const lowercaseReq = document.getElementById('lowercase');
    const numberReq = document.getElementById('number');
    const specialReq = document.getElementById('special');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const target = document.getElementById(targetId);
            
            // Alterna o tipo de input entre password e text
            const isPassword = target.type === 'password';
            target.type = isPassword ? 'text' : 'password';
            
            // Alterna o ícone entre olho e olho riscado
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Validação em tempo real da senha
    senha.addEventListener('input', function() {
        const senhaValor = senha.value;
        
        // Validação de comprimento
        if (senhaValor.length >= 8 && senhaValor.length <= 15) {
            lengthReq.classList.add('valid');
        } else {
            lengthReq.classList.remove('valid');
        }
        
        // Validação de letra maiúscula
        if (/[A-Z]/.test(senhaValor)) {
            uppercaseReq.classList.add('valid');
        } else {
            uppercaseReq.classList.remove('valid');
        }
        
        // Validação de letra minúscula
        if (/[a-z]/.test(senhaValor)) {
            lowercaseReq.classList.add('valid');
        } else {
            lowercaseReq.classList.remove('valid');
        }
        
        // Validação de número
        if (/[0-9]/.test(senhaValor)) {
            numberReq.classList.add('valid');
        } else {
            numberReq.classList.remove('valid');
        }
        
        // Validação de caractere especial
        if (/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor)) {
            specialReq.classList.add('valid');
        } else {
            specialReq.classList.remove('valid');
        }
        
        // Verificar correspondência das senhas
        if (confirmarSenha.value) {
            validarSenhasIguais();
        }
    });

    // Verificar se as senhas são iguais quando o usuário digita na confirmação
    confirmarSenha.addEventListener('input', validarSenhasIguais);

    function validarSenhasIguais() {
        if (senha.value !== confirmarSenha.value) {
            confirmarSenhaError.textContent = 'As senhas não coincidem';
        } else {
            confirmarSenhaError.textContent = '';
        }
    }

    // Validação do email
    email.addEventListener('blur', function() {
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
        nomeError.textContent = '';
        emailError.textContent = '';
        estadoError.textContent = '';
        senhaError.textContent = '';
        confirmarSenhaError.textContent = '';

        // Validar nome
        if (nome.value.trim() === '') {
            nomeError.textContent = 'Por favor, preencha o nome completo';
            isValid = false;
        }

        // Validar email
        if (!validarEmail(email.value)) {
            emailError.textContent = 'Por favor, insira um e-mail válido';
            isValid = false;
        }

        // Validar estado
        if (estado.value === '') {
            estadoError.textContent = 'Por favor, selecione um estado';
            isValid = false;
        }

        // Validar senha
        const senhaValor = senha.value;
        let senhaValida = true;
        
        if (senhaValor.length < 8 || senhaValor.length > 15) {
            senhaValida = false;
        }
        if (!/[A-Z]/.test(senhaValor)) {
            senhaValida = false;
        }
        if (!/[a-z]/.test(senhaValor)) {
            senhaValida = false;
        }
        if (!/[0-9]/.test(senhaValor)) {
            senhaValida = false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor)) {
            senhaValida = false;
        }
        
        if (!senhaValida) {
            senhaError.textContent = 'A senha não atende a todos os requisitos';
            isValid = false;
        }

        // Validar confirmação de senha
        if (senhaValor !== confirmarSenha.value) {
            confirmarSenhaError.textContent = 'As senhas não coincidem';
            isValid = false;
        }

        // Se tudo estiver válido, enviar o formulário
        if (isValid) {
            const formData = new FormData(form);

            // Mostrar mensagem de loading
            const btnForm = document.querySelector('.btn-form');
            const btnText = btnForm.textContent;
            btnForm.textContent = 'Cadastrando...';
            btnForm.disabled = true;

            fetch('../Back-end/cadastro.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                // Restaurar botão
                btnForm.textContent = btnText;
                btnForm.disabled = false;
                
                if (data.trim() === 'success') {
                    // Criar elemento para mensagem de sucesso
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = '✅ Cadastro realizado com sucesso! Redirecionando...';
                    
                    // Inserir antes do botão
                    form.insertBefore(successMessage, btnForm.parentNode);
                    
                    // Redirecionar após delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Tratar erros do servidor
                    if (data.includes('email')) {
                        emailError.textContent = 'Este e-mail já está cadastrado';
                    } else {
                        // Criar elemento para mensagem de erro
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-server';
                        errorMessage.textContent = 'Erro: ' + data;
                        
                        // Inserir antes do botão
                        form.insertBefore(errorMessage, btnForm.parentNode);
                        
                        // Remover após 5 segundos
                        setTimeout(() => {
                            errorMessage.remove();
                        }, 5000);
                    }
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                
                // Restaurar botão
                btnForm.textContent = btnText;
                btnForm.disabled = false;
                
                // Exibir mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-server';
                errorMessage.textContent = 'Erro de conexão com o servidor. Tente novamente mais tarde.';
                
                // Inserir antes do botão
                form.insertBefore(errorMessage, btnForm.parentNode);
                
                // Remover após 5 segundos
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            });
        }
    });

    // Função para validar formato de email
    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});