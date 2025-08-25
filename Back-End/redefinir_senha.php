<?php
include("conexao.php");

// Captura os dados do formulário
$email = $_POST['input-email'] ?? '';
$senhaNova = $_POST['input-senha'] ?? '';

// Verificação básica de campos vazios
if (empty($email) || empty($senhaNova)) {
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

// Verifica se o usuário existe
$sqlCheck = "SELECT * FROM usuarios WHERE email = ?";
$stmtCheck = $conn->prepare($sqlCheck);

if (!$stmtCheck) {
    echo "erro_preparacao: " . $conn->error;
    exit;
}

$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows === 1) {
    // Atualiza a senha
    $hash = password_hash($senhaNova, PASSWORD_DEFAULT);
    $sqlUpdate = "UPDATE usuarios SET senha = ? WHERE email = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);

    if (!$stmtUpdate) {
        echo "erro_preparacao_update: " . $conn->error;
        exit;
    }

    $stmtUpdate->bind_param("ss", $hash, $email);
    $stmtUpdate->execute();

    if ($stmtUpdate->affected_rows > 0) {
        echo "success";
    } else {
        echo "erro_atualizar_senha";
    }

    $stmtUpdate->close();
} else {
    echo "usuario_nao_encontrado";
}

$stmtCheck->close();
$conn->close();
?>
