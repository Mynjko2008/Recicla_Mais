document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calcForm");
  const resultado = document.getElementById("resultado");

  // Conversões fixas (exemplo simplificado)
  const equivalencias = {
    plastico: valor => `${valor * 50} garrafas PET retiradas do meio ambiente.`,
    vidro: valor => `${valor * 4} garrafas de vidro reaproveitadas.`,
    metal: valor => `Energia suficiente para manter uma lâmpada acesa por ${valor * 20} horas.`,
    papel: valor => `${valor * 17} litros de água economizados.`,
    organico: valor => `${valor * 0.5} kg de adubo produzido.`,
    eletronico: valor => `${(valor * 0.3).toFixed(2)} g de ouro recuperados de eletrônicos.`
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const categoria = document.getElementById("categoria").value;
    const quantidade = parseFloat(document.getElementById("quantidade").value);

    if (!categoria || isNaN(quantidade) || quantidade <= 0) {
      resultado.innerHTML = "<p style='color:red;'>Por favor, preencha todos os campos corretamente.</p>";
      return;
    }

    const impacto = equivalencias[categoria](quantidade);

    resultado.innerHTML = `
      <h2>Resultado</h2>
      <p>Você informou <b>${quantidade}kg</b> de <b>${categoria}</b>.</p>
      <p><b>Impacto Ambiental:</b> ${impacto}</p>
    `;
  });
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