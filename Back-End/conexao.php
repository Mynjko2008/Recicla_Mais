<?php
$host = "localhost";   // Servidor
$db   = "recicla_plus"; // Nome do banco de dados
$user = "root";        // Usuário do MySQL
$pass = "";            // Senha do MySQL (no XAMPP geralmente é vazio)

// Criar conexão
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexão
if ($conn->connect_error) {
    die("❌ Conexão falhou: " . $conn->connect_error);
}
?>
