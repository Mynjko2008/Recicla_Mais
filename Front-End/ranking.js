document.addEventListener("DOMContentLoaded", () => {
  const rankingTableBody = document.querySelector("#rankingTable tbody");
  const userHighlight = document.getElementById("userHighlight");

  fetch("../Back-End/ranking.php")
    .then(res => res.json())
    .then(data => {
      if (data.sucesso) {
        const top10 = data.top10;
        const usuario = data.usuario;

        rankingTableBody.innerHTML = "";

        top10.forEach((user, index) => {
          const tr = document.createElement("tr");

          let medalha = "";
          if (index === 0) medalha = "🥇 Ouro";
          else if (index === 1) medalha = "🥈 Prata";
          else if (index === 2) medalha = "🥉 Bronze";

          tr.innerHTML = `
            <td>${index + 1}º</td>
            <td>${user.nome}</td>
            <td>${parseFloat(user.total_reciclado).toFixed(2)} kg</td>
            <td>${medalha}</td>
          `;

          if (usuario && user.usuario_id === usuario.usuario_id) {
            tr.classList.add("highlight");
          }

          rankingTableBody.appendChild(tr);
        });

        // Destaque do usuário logado
        if (usuario) {
          userHighlight.innerHTML = `
            <h2>Sua Posição</h2>
            <p>Você está em <b>${usuario.posicao}º lugar</b> com <b>${parseFloat(usuario.total_reciclado).toFixed(2)} kg</b> reciclados!</p>
          `;
        }

      } else {
        console.error("Erro ao carregar ranking:", data.mensagem);
      }
    })
    .catch(err => console.error("Erro na requisição do ranking:", err));
});
