document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard carregado 🚀");

  // Dados fictícios para exemplo
  const dadosPizza = {
    labels: ["Plástico", "Papel", "Vidro", "Metal", "Orgânico", "Eletrônicos"],
    datasets: [{
      data: [40, 25, 15, 10, 5, 5],
      backgroundColor: [
        "#4CAF50", // Plástico
        "#FFC107", // Papel
        "#03A9F4", // Vidro
        "#9C27B0", // Metal
        "#FF5722", // Orgânico
        "#607D8B"  // Eletrônicos
      ],
    }]
  };

  const dadosBarra = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    datasets: [{
      label: "Kg reciclados",
      data: [10, 20, 15, 30, 25, 40, 35],
      backgroundColor: "#4CAF50"
    }]
  };

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

  // Gráfico de Pizza
  const ctxPizza = document.getElementById("graficoPizza");
  criarGrafico(ctxPizza, "pie", dadosPizza);

  // Gráfico de Barra
  const ctxBarra = document.getElementById("graficoBarra");
  const opcoesBarra = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  criarGrafico(ctxBarra, "bar", dadosBarra, opcoesBarra);
});