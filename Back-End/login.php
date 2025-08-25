<?php
include("conexao.php");

// Captura os dados do formulário
$email = $_POST['input-email'] ?? '';
$senha = $_POST['input-password'] ?? '';

// Verificação básica de campos vazios
if (empty($email) || empty($senha)) {
    echo "faltando_dados";
    exit;
}

// Sanitização do email
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Verificação se o email é válido
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "email_invalido";
    exit;
}

// Preparar e executar a consulta
$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "erro_preparacao: " . $conn->error;
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Verificar se o usuário existe
if ($result->num_rows === 1) {
    $usuario = $result->fetch_assoc();
    // Verificar a senha
    if (password_verify($senha, $usuario['senha'])) {
        echo "success";
    } else {
        echo "senha_incorreta";
    }
} else {
    echo "usuario_nao_encontrado";
}

// Fechar a declaração e a conexão
$stmt->close();
$conn->close();
?>
