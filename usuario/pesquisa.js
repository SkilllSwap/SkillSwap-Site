import { db } from './firebaseConfig.js'; 
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function pesquisarVagas() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const vagasRef = collection(db, "Vagas");

  // Query para buscar vagas com base no input
  const q = query(
    vagasRef,
    where("nome", ">=", input),
    where("nome", "<=", input + '\uf8ff') // Combina com o texto do input
  );

  try {
    const querySnapshot = await getDocs(q); // Executa a consulta
    const resultados = [];
    querySnapshot.forEach(doc => {
      resultados.push(doc.data());
    });
    mostrarResultados(resultados);
  } catch (error) {
    console.error("Erro ao buscar vagas:", error);
    mostrarResultados([]); 
  }
}

//mostra os resultados da pesquisa
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
        <h3>${vaga.nome}</h3>
        <p><strong>Empresa:</strong> ${vaga.empresa}</p>
        <p><strong>Local:</strong> ${vaga.local}</p>
      `;
      container.appendChild(card);
    });
  }
}

// Função para o evento de pesquisa
document.getElementById("searchInput").addEventListener("input", pesquisarVagas);
