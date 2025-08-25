document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard carregado 🚀");

  // Função para criar gráfico
  const criarGrafico = (ctx, tipo, dados, opcoes = {}) => {
    if (ctx) {
      new Chart(ctx, {
        type: tipo,
        data: dados,
        options: opcoes,
      });
    }
  };

  // Buscar dados do servidor
  fetch("../Back-End/dashboard.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do servidor");
      }
      return response.json();
    })
    .then((dados) => {
      console.log("Dados recebidos ✅", dados);

      // === Atualizar Cards ===
      if (dados.cards) {
        const totalRecicladoElem = document.getElementById("total-reciclado");
        const co2EvitadoElem = document.getElementById("co2-evitado");
        const posicaoRankingElem = document.getElementById("posicao-ranking");

        if (totalRecicladoElem) {
          totalRecicladoElem.textContent = `${dados.cards.total_reciclado} kg`;
        }

        if (co2EvitadoElem) {
          co2EvitadoElem.textContent = `${dados.cards.co2_evitado.toFixed(2)} kg`;
        }

        if (posicaoRankingElem) {
          posicaoRankingElem.textContent = dados.cards.posicao
            ? `${dados.cards.posicao}º lugar`
            : "--";
        }
      }

      // === Gráfico de Pizza ===
      const dadosPizza = {
        labels: dados.pizza.labels,
        datasets: [
          {
            data: dados.pizza.data,
            backgroundColor: [
              "#4CAF50",
              "#FFC107",
              "#03A9F4",
              "#9C27B0",
              "#FF5722",
              "#607D8B",
            ],
          },
        ],
      };
      const ctxPizza = document.getElementById("graficoPizza");
      criarGrafico(ctxPizza, "pie", dadosPizza);

      // === Gráfico de Barra ===
      const dadosBarra = {
        labels: dados.barra.labels,
        datasets: [
          {
            label: "Kg reciclados",
            data: dados.barra.data,
            backgroundColor: "#4CAF50",
          },
        ],
      };
      const ctxBarra = document.getElementById("graficoBarra");
      const opcoesBarra = {
        scales: {
          y: { beginAtZero: true },
        },
      };
      criarGrafico(ctxBarra, "bar", dadosBarra, opcoesBarra);
    })
    .catch((error) => {
      console.error("Erro:", error);
    });

  // Função para alternar o menu hamburguer
  const toggleMenu = () => {
    const navMenu = document.getElementById("nav-menu");
    const menuBtn = document.getElementById("menu");

    if (navMenu) {
      navMenu.classList.toggle("active");
    }
    if (menuBtn) {
      const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", !isExpanded);
    }
  };

  // Fechar o menu ao clicar em um link (em dispositivos móveis)
  const menuLinks = document.querySelectorAll("#nav-menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        const navMenu = document.getElementById("nav-menu");
        const menuBtn = document.getElementById("menu");

        if (navMenu) {
          navMenu.classList.remove("active");
        }
        if (menuBtn) {
          menuBtn.setAttribute("aria-expanded", "false");
        }
      }
    });
  });
});
