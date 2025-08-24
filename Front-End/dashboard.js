document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard carregado 🚀");

  // Função para criar gráfico
  const criarGrafico = (ctx, tipo, dados, opcoes = {}) => {
    if (ctx) {
      new Chart(ctx, {
        type: tipo,
        data: dados,
        options: opcoes
      });
    }
  };

  // Buscar dados do servidor
  fetch("../Back-End/dashboard.php")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do servidor");
      }
      return response.json();
    })
    .then(dados => {
      console.log("Dados recebidos ✅", dados);

      // === Atualizar Cards ===
      if (dados.cards) {
        document.getElementById("total-reciclado").textContent =
          `${dados.cards.total_reciclado} kg`;

        document.getElementById("co2-evitado").textContent =
          `${dados.cards.co2_evitado.toFixed(2)} kg`;

        document.getElementById("posicao-ranking").textContent =
          dados.cards.posicao ? `${dados.cards.posicao}º lugar` : "--";
      }

      // === Gráfico de Pizza ===
      const dadosPizza = {
        labels: dados.pizza.labels,
        datasets: [{
          data: dados.pizza.data,
          backgroundColor: [
            "#4CAF50", "#FFC107", "#03A9F4",
            "#9C27B0", "#FF5722", "#607D8B"
          ]
        }]
      };
      const ctxPizza = document.getElementById("graficoPizza");
      criarGrafico(ctxPizza, "pie", dadosPizza);

      // === Gráfico de Barra ===
      const dadosBarra = {
        labels: dados.barra.labels,
        datasets: [{
          label: "Kg reciclados",
          data: dados.barra.data,
          backgroundColor: "#4CAF50"
        }]
      };
      const ctxBarra = document.getElementById("graficoBarra");
      const opcoesBarra = {
        scales: {
          y: { beginAtZero: true }
        }
      };
      criarGrafico(ctxBarra, "bar", dadosBarra, opcoesBarra);
    })
    .catch(error => {
      console.error("Erro:", error);
    });
});
