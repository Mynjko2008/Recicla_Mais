document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const nome = document.getElementById('input-nome');
    const email = document.getElementById('input-email');
    const estado = document.getElementById('estado');
    const senha = document.getElementById('input-senha');
    const confirmarSenha = document.getElementById('input-confirmar-senha');
    const loginLink = document.querySelector('.login-link');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const target = document.getElementById(this.dataset.target);
            const isPassword = target.type === 'password';
            target.type = isPassword ? 'text' : 'password';
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Validação e envio
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (nome.value.trim() === '') {
            alert('Por favor, preencha o nome completo.');
            return;
        }

        if (!validarEmail(email.value)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        if (estado.value === '') {
            alert('Por favor, selecione um estado.');
            return;
        }

        const senhaValor = senha.value;

        if (senhaValor.length < 8 || senhaValor.length > 15) {
            alert('A senha deve ter entre 8 e 15 caracteres.');
            return;
        }
        if (!/[A-Z]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos uma letra MAIÚSCULA.');
            return;
        }
        if (!/[a-z]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos uma letra minúscula.');
            return;
        }
        if (!/[0-9]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos um número.');
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos um caractere especial.');
            return;
        }
        if (senhaValor !== confirmarSenha.value) {
            alert('As senhas não coincidem.');
            return;
        }

        const formData = new FormData(form);

        fetch('../Back-end/cadastro.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.trim() === 'success') {
                alert('✅ Cadastro realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                alert('Erro: ' + data);
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        });
    });

    function validarEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    loginLink.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = 'login.html';
    });
});
