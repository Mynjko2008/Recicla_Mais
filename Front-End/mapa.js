document.addEventListener("DOMContentLoaded", () => {
  // Inicializa mapa
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Pontos fictícios de coleta (expandido)
  const pontos = [
    { nome: "Ponto de Coleta Central", categoria: "Plástico", coords: [-23.5505, -46.6333] },
    { nome: "Ecoponto Norte", categoria: "Vidro", coords: [-23.5405, -46.6233] },
    { nome: "Ecoponto Sul", categoria: "Metal", coords: [-23.5605, -46.6433] },
    { nome: "Ponto Verde Leste", categoria: "Orgânico", coords: [-23.5455, -46.6533] },
    { nome: "Ponto Eletrônicos Oeste", categoria: "Eletrônico", coords: [-23.5555, -46.6633] },
    { nome: "Ecoponto Zona Oeste", categoria: "Plástico", coords: [-23.5655, -46.6733] },
    { nome: "Recicla+ Norte", categoria: "Papel", coords: [-23.5355, -46.6133] },
    { nome: "Ecoponto Jardim Sul", categoria: "Vidro", coords: [-23.5705, -46.6533] },
    { nome: "Coleta Parque Leste", categoria: "Metal", coords: [-23.5555, -46.6233] },
    { nome: "Central Orgânicos", categoria: "Orgânico", coords: [-23.5400, -46.6400] },
    { nome: "Recicla Tech", categoria: "Eletrônico", coords: [-23.5600, -46.6200] }
  ];

  // Adiciona marcadores
  let marcadores = [];
  pontos.forEach(p => {
    const marker = L.marker(p.coords).bindPopup(`<b>${p.nome}</b><br>Categoria: ${p.categoria}`);
    marker.addTo(map);
    marcadores.push({ marker, ...p });
  });

  // Filtros
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroNome = document.getElementById("filtroNome");

  function aplicarFiltros() {
    const categoria = filtroCategoria.value.toLowerCase();
    const nomeBusca = filtroNome.value.toLowerCase();

    marcadores.forEach(({ marker, categoria: cat, nome }) => {
      const matchCategoria = (categoria === "todos" || cat.toLowerCase() === categoria);
      const matchNome = nome.toLowerCase().includes(nomeBusca);

      if (matchCategoria && matchNome) {
        map.addLayer(marker);
      } else {
        map.removeLayer(marker);
      }
    });
  }

  filtroCategoria.addEventListener("change", aplicarFiltros);
  filtroNome.addEventListener("input", aplicarFiltros);
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