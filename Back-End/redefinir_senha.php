<?php
include("conexao.php");

$email = $_POST['input-email'] ?? '';
$senhaNova = $_POST['input-senha'] ?? '';

if (empty($email) || empty($senhaNova)) {
    echo "faltando_dados";
    exit;
}

$hash = password_hash($senhaNova, PASSWORD_DEFAULT);

// Verifica se o usuário existe
$sqlCheck = "SELECT * FROM usuarios WHERE email = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows === 1) {
    // Atualiza a senha
    $sqlUpdate = "UPDATE usuarios SET senha = ? WHERE email = ?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->bind_param("ss", $hash, $email);
    $stmtUpdate->execute();

    if ($stmtUpdate->affected_rows > 0) {
        echo "success";
    } else {
        echo "nenhuma_alteracao";
    }

    $stmtUpdate->close();
} else {
    echo "usuario_nao_encontrado";
}

$stmtCheck->close();
$conn->close();
