<?php
$host = "localhost";   // Servidor
$db   = "recicla_plus"; // Nome do banco de dados
$user = "root";        // Usuário do MySQL
$pass = "";            // Senha do MySQL (no XAMPP geralmente é vazio)

// Habilitar relatórios de erro
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Criar conexão
    $conn = new mysqli($host, $user, $pass, $db);
    echo "✅ Conexão bem-sucedida!";
} catch (mysqli_sql_exception $e) {
    // Tratar erro de conexão
    echo "❌ Conexão falhou: " . $e->getMessage();
    exit; // Encerra o script em caso de erro
}



// Fechar a conexão
$conn->close();
?>
