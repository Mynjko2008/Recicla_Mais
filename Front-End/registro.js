document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const tabela = document.querySelector("#tabelaRegistros tbody");
  const localInput = document.getElementById("local");

  // Inicializar mapa Leaflet
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

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

    form.reset();
    localInput.value = "";
    if (marker) {
      map.removeLayer(marker);
    }
  });
});
