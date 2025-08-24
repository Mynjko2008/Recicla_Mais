document.addEventListener("DOMContentLoaded", () => {
  const rankingTableBody = document.querySelector("#rankingTable tbody");
  const userHighlight = document.getElementById("userHighlight");

  // 🔹 Mock de dados (simulação). Depois vem do banco.
  const usuarios = [
    { id: 1, nome: "Arthur", total: 120 },
    { id: 2, nome: "Mariana", total: 95 },
    { id: 3, nome: "Reinaldo", total: 80 },
    { id: 4, nome: "Camila", total: 65 },
    { id: 5, nome: "Lucas", total: 50 }
  ];

  // Usuário logado (simulação)
  const usuarioLogadoId = 1;

  // Ordena por total reciclado
  usuarios.sort((a, b) => b.total - a.total);

  // Preenche tabela
  usuarios.forEach((user, index) => {
    const tr = document.createElement("tr");

    // Medalhas
    let medalha = "";
    if (index === 0) medalha = "🥇 Ouro";
    else if (index === 1) medalha = "🥈 Prata";
    else if (index === 2) medalha = "🥉 Bronze";

    tr.innerHTML = `
      <td>${index + 1}º</td>
      <td>${user.nome}</td>
      <td>${user.total} kg</td>
      <td>${medalha}</td>
    `;

    // Destaca usuário logado
    if (user.id === usuarioLogadoId) {
      tr.classList.add("highlight");
      userHighlight.innerHTML = `
        <h2>Sua Posição</h2>
        <p>Você está em <b>${index + 1}º lugar</b> com <b>${user.total}kg</b> reciclados!</p>
      `;
    }

    rankingTableBody.appendChild(tr);
  });
});