<?php
include("conexao.php");

// dashboard.php
header("Content-Type: application/json");
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["erro" => "Usuário não autenticado"]);
    exit;
}

$usuario_id = $_SESSION['usuario_id'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=recicla_plus;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // --- Total reciclado do usuário ---
    $sqlTotal = "SELECT COALESCE(SUM(quantidade), 0) AS total 
                 FROM registros_descarte 
                 WHERE usuario_id = :usuario_id";
    $stmt = $pdo->prepare($sqlTotal);
    $stmt->execute(["usuario_id" => $usuario_id]);
    $totalReciclado = (float)$stmt->fetchColumn();

    // --- Cálculo de CO2 evitado (ex: 1kg = 0.3kg CO2) ---
    $co2Evitado = round($totalReciclado * 0.3, 2);

    // --- Posição no ranking ---
    $sqlRanking = "
        SELECT usuario_id, nome, RANK() OVER (ORDER BY total_reciclado DESC) AS posicao
        FROM ranking
    ";
    $stmt = $pdo->query($sqlRanking);
    $posicao = null;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if ($row["usuario_id"] == $usuario_id) {
            $posicao = $row["posicao"];
            break;
        }
    }

    // --- Gráfico de pizza (categorias) ---
    $sqlPizza = "
        SELECT c.nome AS categoria, SUM(r.quantidade) AS total
        FROM registros_descarte r
        JOIN categorias c ON r.categoria_id = c.id
        WHERE r.usuario_id = :usuario_id
        GROUP BY c.nome
        ORDER BY c.nome
    ";
    $stmt = $pdo->prepare($sqlPizza);
    $stmt->execute(["usuario_id" => $usuario_id]);
    $pizzaLabels = [];
    $pizzaData = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $pizzaLabels[] = $row["categoria"];
        $pizzaData[] = (float)$row["total"];
    }

    // --- Gráfico de barra (quantidade por mês) ---
    $sqlBarra = "
        SELECT DATE_FORMAT(r.data_descarte, '%b') AS mes,
               SUM(r.quantidade) AS total
        FROM registros_descarte r
        WHERE r.usuario_id = :usuario_id
        GROUP BY MONTH(r.data_descarte), mes
        ORDER BY MONTH(r.data_descarte)
    ";
    $stmt = $pdo->prepare($sqlBarra);
    $stmt->execute(["usuario_id" => $usuario_id]);
    $barraLabels = [];
    $barraData = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $barraLabels[] = $row["mes"];
        $barraData[] = (float)$row["total"];
    }

    // --- Retorno JSON ---
    echo json_encode([
        "cards" => [
            "total_reciclado" => round($totalReciclado, 2),
            "co2_evitado" => $co2Evitado,
            "posicao" => $posicao
        ],
        "pizza" => [
            "labels" => $pizzaLabels,
            "data"   => $pizzaData
        ],
        "barra" => [
            "labels" => $barraLabels,
            "data"   => $barraData
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["erro" => "Erro no banco: " . $e->getMessage()]);
}
