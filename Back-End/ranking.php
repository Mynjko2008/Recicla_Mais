<?php

include("conexao.php");

// ranking.php
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

    // Buscar top 10 do ranking
    $sqlTop10 = "
        SELECT usuario_id, nome, COALESCE(SUM(quantidade), 0) AS total_reciclado
        FROM usuarios u
        LEFT JOIN registros_descarte r ON u.id = r.usuario_id
        GROUP BY u.id, u.nome
        ORDER BY total_reciclado DESC
        LIMIT 10
    ";
    $stmt = $pdo->query($sqlTop10);
    $top10 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Buscar posição do usuário logado
    $sqlPosicao = "
        SELECT posicao, usuario_id, nome, total_reciclado FROM (
            SELECT u.id AS usuario_id, u.nome, COALESCE(SUM(r.quantidade), 0) AS total_reciclado,
                   RANK() OVER (ORDER BY COALESCE(SUM(r.quantidade),0) DESC) AS posicao
            FROM usuarios u
            LEFT JOIN registros_descarte r ON u.id = r.usuario_id
            GROUP BY u.id, u.nome
        ) ranking
        WHERE usuario_id = :usuario_id
    ";
    $stmt = $pdo->prepare($sqlPosicao);
    $stmt->execute(["usuario_id" => $usuario_id]);
    $usuarioPosicao = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "sucesso" => true,
        "top10" => $top10,
        "usuario" => $usuarioPosicao
    ]);

} catch (PDOException $e) {
    echo json_encode(["sucesso" => false, "mensagem" => "Erro no banco: " . $e->getMessage()]);
}
