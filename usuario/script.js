const vagas = [
  {
    titulo: "Desenvolvedor de Software",
    empresa: "TCS",
    descricao: "Estamos em busca de desenvolvedores de software habilidosos para se unirem à nossa equipe dinâmica...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Engenharia de Dados",
    empresa: "DataEX",
    descricao: "Estamos em busca de engenheiros de dados habilidosos para se unirem à nossa equipe dinâmica...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Analista de Sistemas",
    empresa: "TechCorp",
    descricao: "Buscamos analistas de sistemas com experiência em desenvolvimento e integração...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Desenvolvedor Web",
    empresa: "WebSoft",
    descricao: "Oportunidade para desenvolvedores web com foco em front-end e experiência em React...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Designer UX/UI",
    empresa: "Creatify",
    descricao: "Buscamos designers UX/UI para criar interfaces incríveis...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Gerente de Projetos",
    empresa: "ProManage",
    descricao: "Procuramos gerentes de projetos com experiência em gestão ágil...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "DevOps Engineer",
    empresa: "CloudSoft",
    descricao: "Oportunidade para engenheiros DevOps com experiência em Kubernetes e Docker...",
    logo: "https://via.placeholder.com/50"
  },
  {
    titulo: "Product Manager",
    empresa: "TechInnovation",
    descricao: "Buscamos Product Managers com visão estratégica e habilidades de liderança...",
    logo: "https://via.placeholder.com/50"
  }
];

//exibir as vagas na tela
function exibirVagas(vagasFiltradas) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ''; // Limpa os cards existentes

  if (vagasFiltradas.length > 0) {
    vagasFiltradas.forEach(vaga => {
      const card = document.createElement("div");
      card.classList.add("card");

      const link = document.createElement("a");
      link.href = `DescricaoVaga.html?id=${vaga.titulo}`; // Passa o título da vaga na URL
      link.classList.add("card-link");

      card.innerHTML = `
        <img src="${vaga.logo}" alt="Logo Empresa">
        <h3>${vaga.titulo}</h3>
        <p><strong>${vaga.empresa}</strong></p>
        <p>${vaga.descricao} <span>Mais sobre</span></p>
      `;

      link.appendChild(card);
      cardContainer.appendChild(link);
    });
  } else {
    cardContainer.innerHTML = "<p>Nenhuma vaga encontrada.</p>";
  }
}

// Função de pesquisa
function pesquisarVagas() {
  const pesquisa = document.getElementById("searchInput").value.toLowerCase();

  // Filtra as vagas com base no título
  const vagasFiltradas = vagas.filter(vaga => vaga.titulo.toLowerCase().includes(pesquisa));

  // Exibe as vagas filtradas
  exibirVagas(vagasFiltradas);
}

// Inicializa a exibição com todas as vagas ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  exibirVagas(vagas);
});
