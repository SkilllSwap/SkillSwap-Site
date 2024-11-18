import { db, collection, getDocs } from './firebaseConfig.js'; 

//exibi as vagas na tela
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

    //criando os cards
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

// formatar a descrição
function formatDescricao(descricao) {
  // Verifica se a descrição existe e se é uma string
  if (typeof descricao !== "string") {
    return "Descrição não disponível"; // Caso o campo 'Descricao' não seja uma string
  }

  // Limitar a descrição para 95 caracteres 
  if (descricao.length > 95) {
    return descricao.substring(0, 95) + "...mais";
  }
  return descricao; // Se a descrição for menor ou igual a 95 caracteres, retorna a descrição inteira
}

// Função de pesquisa
function pesquisarVagas() {
  const pesquisa = document.getElementById("searchInput").value.toLowerCase();

  // Filtra as vagas com base no título
  const vagasFiltradas = vagas.filter(vaga => 
    vaga.Titulo.toLowerCase().includes(pesquisa) // Assume que o campo correto é "Titulo"
  );

  // Exibe as vagas filtradas
  exibirVagasFiltradas(vagasFiltradas);
}

// Função para exibir as vagas filtradas
function exibirVagasFiltradas(vagasFiltradas) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ''; // Limpa os cards existentes

  if (vagasFiltradas.length > 0) {
    vagasFiltradas.forEach(vaga => {
      const card = document.createElement("div");
      card.classList.add("card");

      const link = document.createElement("a");
      link.href = `DescricaoVaga.html?id=${vaga.Titulo}`; // Passa o título da vaga na URL
      link.classList.add("card-link");

      // Adicionando conteúdo ao card
      card.innerHTML = `
        <h3>${vaga.Titulo}</h3>
        <p>${formatDescricao(vaga.Descricao)}</p>
      `;

      link.appendChild(card);
      cardContainer.appendChild(link);
    });
  } else {
    cardContainer.innerHTML = "<p>Nenhuma vaga encontrada com esse título.</p>";
  }
}

// Inicializa a exibição com todas as vagas 
document.addEventListener("DOMContentLoaded", function () {
  exibirVagas(); // Exibe as vagas
});
