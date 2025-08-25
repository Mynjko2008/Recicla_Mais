<?php
include("conexao.php");

// registro.php
header("Content-Type: application/json");
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["sucesso" => false, "mensagem" => "Usuário não autenticado"]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=recicla_plus;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 🔹 Caso GET com ação buscar
    if (isset($_GET['acao']) && $_GET['acao'] === "buscar") {
        $sql = "
            SELECT r.quantidade, r.unidade, r.local_descarte AS local, r.data_descarte AS data, c.nome AS categoria
            FROM registros_descarte r
            JOIN categorias c ON r.categoria_id = c.id
            WHERE r.usuario_id = :usuario_id
            ORDER BY r.data_descarte DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["usuario_id" => $usuario_id]);
        $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["sucesso" => true, "registros" => $registros]);
        exit;
    }

    // 🔹 Caso POST para adicionar novo registro
    if ($_SERVER['REQUEST_METHOD'] === "POST") {
        if (empty($_POST['categoria']) || empty($_POST['quantidade']) || empty($_POST['unidade']) || empty($_POST['local']) || empty($_POST['data'])) {
            echo json_encode(["sucesso" => false, "mensagem" => "Preencha todos os campos"]);
            exit;
        }

        $categoria = (int) $_POST['categoria'];
        $quantidade = (float) $_POST['quantidade'];
        $unidade = $_POST['unidade'];
        $local = trim($_POST['local']);
        $data = $_POST['data'];

        // Verificar se a data está no formato correto
        $dataFormatada = DateTime::createFromFormat('Y-m-d', $data);
        if (!$dataFormatada) {
            echo json_encode(["sucesso" => false, "mensagem" => "Data inválida. Use o formato YYYY-MM-DD."]);
            exit;
        }

        $sql = "INSERT INTO registros_descarte (usuario_id, categoria_id, quantidade, unidade, local_descarte, data_descarte)
                VALUES (:usuario_id, :categoria, :quantidade, :unidade, :local, :data)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            "usuario_id" => $usuario_id,
            "categoria" => $categoria,
            "quantidade" => $quantidade,
            "unidade" => $unidade,
            "local" => $local,
            "data" => $data
        ]);

        // Pegar o nome da categoria (pra devolver pro JS)
        $stmtCat = $pdo->prepare("SELECT nome FROM categorias WHERE id = :id");
        $stmtCat->execute(["id" => $categoria]);
        $nomeCategoria = $stmtCat->fetchColumn();

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Registro adicionado com sucesso!",
            "registro" => [
                "categoria" => $nomeCategoria,
                "quantidade" => $quantidade,
                "unidade" => $unidade,
                "local" => $local,
                "data" => $data
            ]
        ]);
        exit;
    }

    // Caso chegue algo inesperado
    echo json_encode(["sucesso" => false, "mensagem" => "Ação inválida"]);

} catch (PDOException $e) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco: " . $e->getMessage()]);
}
