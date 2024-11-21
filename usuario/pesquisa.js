/*import { db } from './firebaseConfig.js'; 
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function pesquisarVagas() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase(); // Converte para minúsculas para comparação
  console.log("Valor da pesquisa:", input);

  // Se o input estiver vazio, não faça a pesquisa
  if (input === "") {
    mostrarResultados([]);
    return;
  }

  const vagasRef = collection(db, "Vagas");

  // Consulta para buscar por Titulo ou Localizacao
  const qTitulo = query(
    vagasRef,
    where("Titulo", ">=", input),
    where("Titulo", "<=", input + '\uf8ff') // Pesquisa por prefixo no título
  );

  const qLocalizacao = query(
    vagasRef,
    where("Localizacao", ">=", input),
    where("Localizacao", "<=", input + '\uf8ff') // Pesquisa por prefixo na localização
  );

  try {
    const resultadosTitulo = await getDocs(qTitulo); // Executa a consulta para título
    const resultadosLocalizacao = await getDocs(qLocalizacao); // Executa a consulta para localização

    const resultados = [];

    // Adiciona os resultados encontrados por Titulo
    resultadosTitulo.forEach(doc => {
      resultados.push(doc.data());
    });

    // Adiciona os resultados encontrados por Localizacao (evita duplicatas)
    resultadosLocalizacao.forEach(doc => {
      const vaga = doc.data();
      // Só adiciona se ainda não tiver sido adicionada pela consulta de Titulo
      if (!resultados.some(r => r.Titulo === vaga.Titulo)) {
        resultados.push(vaga);
      }
    });

    mostrarResultados(resultados);
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    mostrarResultados([]);
  }
}

// Mostra os resultados da pesquisa
function mostrarResultados(resultados) {
  const container = document.getElementById("card-container");
  container.innerHTML = ''; // Limpa resultados anteriores

  if (resultados.length === 0) {
    container.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
  } else {
    resultados.forEach(vaga => {
      const card = document.createElement("div");
      card.classList.add("vaga-card");
      card.innerHTML = `
        <h3>${vaga.Titulo}</h3>
        <p><strong>Local:</strong> ${vaga.Localizacao}</p>
        <p><strong>Salário:</strong> ${vaga.Salario}</p>
      `;
      container.appendChild(card);
    });
  }
}

// Função para o evento de pesquisa
document.getElementById("searchInput").addEventListener("input", pesquisarVagas);*/
