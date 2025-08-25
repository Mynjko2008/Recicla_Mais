document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registroForm");
  const tabela = document.querySelector("#tabelaRegistros tbody");
  const localInput = document.getElementById("local");

  // Inicializar mapa Leaflet
  const map = L.map("map").setView([-23.5505, -46.6333], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Pontos de coleta fixos
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

  pontos.forEach(p => {
    L.marker(p.coords)
      .bindPopup(`<b>${p.nome}</b><br>Categoria: ${p.categoria}`)
      .addTo(map);
  });

  // Marcador temporário ao clicar no mapa
  let marker;
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);
    localInput.value = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  });

  // Função para formatar data YYYY-MM-DD → DD/MM/YYYY
  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para popular a tabela
  const carregarHistorico = () => {
    fetch("../Back-End/registro.php?acao=buscar")
      .then(res => res.json())
      .then(data => {
        if (data.sucesso && data.registros) {
          tabela.innerHTML = "";
          // Ordena decrescente pela data
          data.registros.sort((a, b) => new Date(b.data) - new Date(a.data));
          data.registros.forEach(r => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${r.categoria}</td>
              <td>${r.quantidade}</td>
              <td>${r.unidade}</td>
              <td>${r.local}</td>
              <td>${formatarData(r.data)}</td>
            `;
            tabela.appendChild(row);
          });
        } else {
          console.warn("Nenhum registro encontrado.");
        }
      })
      .catch(err => console.error("Erro ao carregar histórico:", err));
  };

  // Submeter formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!formData.get('categoria') || !formData.get('quantidade') || !formData.get('unidade') || !formData.get('local') || !formData.get('data')) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    fetch("../Back-End/registro.php", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        if (data.sucesso) {
          // Insere registro no topo da tabela
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${data.registro.categoria}</td>
            <td>${data.registro.quantidade}</td>
            <td>${data.registro.unidade}</td>
            <td>${data.registro.local}</td>
            <td>${formatarData(data.registro.data)}</td>
          `;
          tabela.prepend(row);

          // Resetar formulário e mapa
          form.reset();
          localInput.value = "";
          if (marker) map.removeLayer(marker);
        } else {
          alert("Erro: " + data.mensagem);
        }
      })
      .catch(err => console.error("Erro no registro:", err));
  });

  // Carregar histórico ao abrir a página
  carregarHistorico();
});
