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



// Função para alternar o menu hamburguer
function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  const menuBtn = document.getElementById("menu");

  navMenu.classList.toggle("active");
  const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", !isExpanded);
}

// Fechar o menu ao clicar em um link (em dispositivos móveis)
document.addEventListener("DOMContentLoaded", () => {
  const menuLinks = document.querySelectorAll("#nav-menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        const navMenu = document.getElementById("nav-menu");
        const menuBtn = document.getElementById("menu");

        navMenu.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });
});
