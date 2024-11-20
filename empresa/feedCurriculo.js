import { db, collection, getDocs, query, where } from './firebaseConfig.js';
import { auth } from './firebaseConfig.js';  // Importar a autenticação

// Função para carregar as vagas da empresa logada
document.addEventListener("DOMContentLoaded", () => {

  auth.onAuthStateChanged(user => {
    if (user) {
      loadVagas(user.uid);  // Passa o ID do usuário logado
    } else {
      alert('Você precisa estar logado para ver suas vagas.');
    }
  });
});

// carrega as vagas da empresa 
async function loadVagas(EmpresaID) {
  try {
    // Verifica se o usuário está logado
    if (!EmpresaID) {
      alert('Você precisa estar logado para ver suas vagas.');
      return;
    }

    const vagasRef = collection(db, "Vagas");

    // Cria uma query para buscar apenas as vagas da empresa logada
    const q = query(vagasRef, where("EmpresaID", "==", EmpresaID));

    // Busca as vagas da empresa
    const querySnapshot = await getDocs(q);

    // Verifica se existem vagas
    if (querySnapshot.empty) {
      document.getElementById("feedContainer").innerHTML = "<p>Você ainda não criou nenhuma vaga.</p>";
      return;
    }

    // Adiciona as vagas ao feed
    querySnapshot.forEach((vagaDoc) => {
      const vagaData = vagaDoc.data();
      const vagaId = vagaDoc.id;

      // Cria os elementos do feed para cada vaga
      const feedItem = document.createElement("a");
      feedItem.href = `Curriculos.html?vagaId=${vagaId}`; 
      feedItem.classList.add("feed-item");

      // Cria os elementos do feed
      feedItem.innerHTML = `
        <div class="item-content">
          <p class="item-text">${vagaData.Titulo}</p> <!-- Exibe o título da vaga -->
        </div>
      `;

      // Adiciona o item ao feed
      document.getElementById("feedContainer").appendChild(feedItem);
    });
  } catch (error) {
    console.error("Erro ao carregar as vagas:", error);
    alert("Erro ao carregar as vagas. Tente novamente.");
  }
}
