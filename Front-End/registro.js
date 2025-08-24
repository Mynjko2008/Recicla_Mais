document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const tabela = document.querySelector("#tabelaRegistros tbody");
  const localInput = document.getElementById("local");

  // Inicializar mapa Leaflet
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 🔹 Pontos de coleta (do arquivo mapa.js)
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

  // Adiciona os marcadores fixos no mapa
  pontos.forEach(p => {
    L.marker(p.coords)
      .bindPopup(`<b>${p.nome}</b><br>Categoria: ${p.categoria}`)
      .addTo(map);
  });

  // 🔹 Marcador temporário para quando o usuário clica
  let marker;
  map.on("click", function(e) {
    const { lat, lng } = e.latlng;
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
    localInput.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  });

  // Submeter formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const categoria = document.getElementById("categoria").selectedOptions[0].text;
    const quantidade = document.getElementById("quantidade").value;
    const unidade = document.getElementById("unidade").value;
    const local = localInput.value;
    const data = document.getElementById("data").value;

    // Adicionar na tabela
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${categoria}</td>
      <td>${quantidade}</td>
      <td>${unidade}</td>
      <td>${local}</td>
      <td>${data}</td>
    `;
    tabela.appendChild(row);

    // Resetar formulário
    form.reset();
    localInput.value = "";
    if (marker) {
      map.removeLayer(marker);
    }
  });
});
