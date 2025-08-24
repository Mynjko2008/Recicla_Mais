<?php
include("conexao.php");


// Mensagens de erro
const CAMPO_VAZIO = "campos_vazios";
const SENHA_INVALIDA = "senha_invalida";
const SUCESSO = "success";
const EMAIL_EXISTENTE = "email_existente";
const ERRO_PREPARACAO = "erro_preparacao";
const ERRO_GENERICO = "erro";

// Função para validar a senha
function validarSenha($senha) {
    return (
        strlen($senha) >= 8 && strlen($senha) <= 15 &&
        preg_match('/[A-Z]/', $senha) &&
        preg_match('/[a-z]/', $senha) &&
        preg_match('/[0-9]/', $senha) &&
        preg_match('/[!@#$%^&*(),.?":{}|<>_\-+=\/\\[\]]/', $senha)
    );
}

// Função para capturar dados do formulário
function capturarDados() {
    return [
        'nome' => isset($_POST['input-nome']) ? trim($_POST['input-nome']) : '',
        'email' => isset($_POST['input-email']) ? trim($_POST['input-email']) : '',
        'estado' => isset($_POST['estado']) ? trim($_POST['estado']) : '',
        'senha' => isset($_POST['input-senha']) ? $_POST['input-senha'] : ''
    ];
}

// Captura os dados
$dados = capturarDados();
$nome = $dados['nome'];
$email = $dados['email'];
$estado = $dados['estado'];
$senha = $dados['senha'];

// Verificação básica de campos vazios
if (empty($nome) || empty($email) || empty($estado) || empty($senha)) {
    echo CAMPO_VAZIO;
    exit;
}

// Validação de senha no back-end
if (!validarSenha($senha)) {
    echo SENHA_INVALIDA;
    exit;
}

// Hash da senha
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// Inserção segura com prepared statement
$sql = "INSERT INTO usuarios (nome, email, estado, senha) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo ERRO_PREPARACAO . ": " . $conn->error;
    exit;
}

$stmt->bind_param("ssss", $nome, $email, $estado, $senhaHash);

if ($stmt->execute()) {
    echo SUCESSO;
} else {
    if ($conn->errno == 1062) { // erro de duplicação (email único)
        echo EMAIL_EXISTENTE;
    } else {
        echo ERRO_GENERICO . ": " . $conn->error;
    }
}

$stmt->close();
$conn->close();
?>
