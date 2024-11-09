// Simulação de dados das vagas
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
  
  let currentIndex = 0; // Controla qual grupo de vagas é exibido
  
  function updateVagas() {
    const startIndex = currentIndex * 8;
    const endIndex = startIndex + 8;
    const vagasSubset = vagas.slice(startIndex, endIndex);
  
    // Preencher os 8 cards na tela
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ''; // Limpar cards existentes
  
    vagasSubset.forEach(vaga => {
      const card = document.createElement("div");
      card.classList.add("card");
  
      card.innerHTML = `
        <img src="${vaga.logo}" alt="Logo Empresa">
        <h3>${vaga.titulo}</h3>
        <p><strong>${vaga.empresa}</strong></p>
        <p>${vaga.descricao} <span>Mais sobre</span></p>
      `;
  
      cardContainer.appendChild(card);
    });
  }
  
  function nextVaga() {
    currentIndex = (currentIndex + 1) % Math.ceil(vagas.length / 8);
    updateVagas();
  }
  
  function previousVaga() {
    currentIndex = (currentIndex - 1 + Math.ceil(vagas.length / 8)) % Math.ceil(vagas.length / 8);
    updateVagas();
  }
  
  // Inicializa com o primeiro grupo de 8 vagas
  updateVagas();
  