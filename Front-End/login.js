document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');
    const cadastroLink = document.querySelector('.cadastro-link');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetInput = document.getElementById(icon.getAttribute('data-target'));
            const isPassword = targetInput.type === 'password';
            targetInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        const passwordValue = passwordInput.value.trim();
        if (passwordValue === '') {
            alert('Por favor, insira sua senha.');
            return;
        }

        const formData = new FormData(form);

        try {
            const response = await fetch('../Back-end/login.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.text();
            handleResponse(data.trim());
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor.');
        }
    });

    // Função para lidar com a resposta do servidor
    const handleResponse = (response) => {
        switch (response) {
            case 'success':
                alert('✅ Login realizado com sucesso!');
                setTimeout(() => {
                    window.location.href = 'home.html'; // pode ir para dashboard depois
                }, 500);
                break;
            case 'senha_incorreta':
                alert('❌ Senha incorreta.');
                break;
            case 'usuario_nao_encontrado':
                alert('❌ Usuário não encontrado.');
                break;
            default:
                alert('Erro inesperado: ' + response);
        }
    };

    // Link cadastro
    cadastroLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'cadastro.html';
    });
});
