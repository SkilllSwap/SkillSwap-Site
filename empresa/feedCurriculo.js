import { db, collection, getDocs } from './firebaseConfig.js';

// carrega as vagas da empresa no feed
document.addEventListener("DOMContentLoaded", () => {
  loadVagas();
});

// Função para carregar as vagas
async function loadVagas() {
  try {
    // Referência para a coleção de Vagas
    const vagasRef = collection(db, "Vagas");

    // Buscar todas as vagas da coleção
    const querySnapshot = await getDocs(vagasRef);

    // Verificar se existem vagas
    if (querySnapshot.empty) {
      document.getElementById("feedContainer").innerHTML = "<p>Nenhuma vaga disponível no momento.</p>";
      return;
    }

    //adiciona as vagas ao feed
    querySnapshot.forEach((vagaDoc) => {
      const vagaData = vagaDoc.data();
      const vagaId = vagaDoc.id;

      // Cria os elementos do feed para cada vaga
      const feedItem = document.createElement("a");
      feedItem.href = `#`; 
      feedItem.classList.add("feed-item");

      // Criar os elementos
      feedItem.innerHTML = `
        <div class="item-content">
          <p class="item-text">${vagaData.titulo}</p>
        </div>
      `;

      // Adicionar o item ao feed
      document.getElementById("feedContainer").appendChild(feedItem);
    });
  } catch (error) {
    console.error("Erro ao carregar as vagas:", error);
    alert("Erro ao carregar as vagas. Tente novamente.");
  }
}
