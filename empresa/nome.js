import { db, collection, getDocs, query, where, doc, getDoc } from './firebaseConfig.js';
import { auth } from './firebaseConfig.js'; 

// Função que carrega os ids da coleção Candidatura
document.addEventListener("DOMContentLoaded", () => {
  // Captura o `vagaId` da URL
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get('vagaId'); // vagaId da URL

  if (!vagaId) {
    alert("Vaga não encontrada.");
    return;
  }

  // Verifica se o usuário está logado
  auth.onAuthStateChanged(user => {
    if (user) {
      loadCurriculos(vagaId);
    } else {
      alert('Você precisa estar logado para ver os currículos.');
    }
  });
});

// Carrega os dados das candidaturas para a vaga 
async function loadCurriculos(vagaId) {
  try {
    // Verifica se o usuário está logado antes de continuar
    const empresaId = auth.currentUser?.uid; // Pega o ID da empresa 
    if (!empresaId) {
      alert('Você precisa estar logado para ver os currículos.');
      return;
    }

    const candidaturasRef = collection(db, "Candidatura");

    // Cria uma query para buscar apenas as candidaturas para a vaga específica
    const q = query(candidaturasRef, where("Id_Vaga", "==", vagaId));

    // Busca as candidaturas da vaga
    const querySnapshot = await getDocs(q);

    // Verifica se existem candidaturas
    if (querySnapshot.empty) {
      document.getElementById("feedContainer").innerHTML = "<p>Nenhum candidato se inscreveu nesta vaga.</p>";
      return;
    }

    // Adicionar os candidatos ao feed
    const feedContainer = document.getElementById("feedContainer");
    querySnapshot.forEach(async (candidaturaDoc) => {
      const candidaturaData = candidaturaDoc.data();
      const candidatoId = candidaturaData.Id_Usuario;

      console.log("ID do Candidato:", candidatoId);

      // Verifica se o id do usuário realmente existe
      if (!candidatoId) {
        console.error("Id_Usuario não encontrado na candidatura.");
        return;
      }

      // Busca os dados do usuário na coleção 
      const usuarioRef = doc(db, "Usuário", candidatoId);
      const usuarioDoc = await getDoc(usuarioRef);

      if (!usuarioDoc.exists()) {
        console.error("Usuário não encontrado para o candidato ID:", candidatoId);
        feedContainer.innerHTML += `
          <div class="feed-item">
            <p class="item-text">Candidato com dados incompletos (ID: ${candidatoId}).</p>
          </div>`;
        return;
      }

      // Extrai os dados do candidato
      const usuarioData = usuarioDoc.data();
      const candidatoNome = usuarioData?.nome || "Nome não disponível";

      console.log("Nome do Candidato:", candidatoNome);

      // Cria o item do feed como link
      const feedItem = document.createElement("a");
      feedItem.href = `Curriculo.html?usuarioId=${candidatoId}`;
      feedItem.classList.add("feed-item");
      feedItem.innerHTML = `
        <div class="item-content">
          <p class="item-text">${candidatoNome}</p>
        </div>
      `;

      // Adiciona o item ao feed
      feedContainer.appendChild(feedItem);
    });
  } catch (error) {
    console.error("Erro ao carregar os currículos:", error);
    alert("Erro ao carregar os currículos. Tente novamente.");
  }
}
