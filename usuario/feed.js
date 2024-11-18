import { db, collection, getDocs } from './firebaseConfig.js';

// Exibir as vagas na tela
async function exibirVagas() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ''; // Limpa os cards existentes

  try {
    // Acessando a coleção
    const vagasSnapshot = await getDocs(collection(db, "Vagas"));
    
    // Verifica se a coleção está vazia
    if (vagasSnapshot.empty) {
      cardContainer.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
      return;
    }

    // Criando os cards
    vagasSnapshot.forEach(doc => {
      const vaga = doc.data(); // Obtendo os dados da vaga 

      const card = document.createElement("div");
      card.classList.add("card");

      const link = document.createElement("a");
      link.href = `DescricaoVaga.html?id=${doc.id}`; // Passa o ID da vaga na URL
      link.classList.add("card-link");

      // Adicionando conteúdo ao card
      card.innerHTML = `
        <h3>${vaga.Titulo}</h3>
        <p>${formatDescricao(vaga.Descricao)}</p>
      `;

      link.appendChild(card);
      cardContainer.appendChild(link);
    });
  } catch (error) {
    console.error('Erro ao obter vagas do Firestore:', error);
    cardContainer.innerHTML = "<p>Erro ao carregar vagas. Tente novamente mais tarde.</p>";
  }
}

// Função para formatar a descrição da vaga 
function formatDescricao(descricao) {
  if (typeof descricao !== "string") {
    return "Descrição não disponível"; // Caso o campo 'Descricao' não seja uma string
  }
  if (descricao.length > 95) {
    return descricao.substring(0, 95) + "...mais";
  }
  return descricao;
}

// Inicializa a exibição com todas as vagas 
document.addEventListener("DOMContentLoaded", function () {
  exibirVagas(); // Exibe as vagas
});
