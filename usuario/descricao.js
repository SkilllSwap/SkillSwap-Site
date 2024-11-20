import { db, doc, getDoc } from './firebaseConfig.js';

async function carregarVaga() {
  // Captura o parâmetro `id` da URL
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get('id'); // Obtém o ID da vaga da URL
  
  if (!vagaId) {
    alert("Vaga não encontrada.");
    return;
  }

  try {
    // Obtém os dados da vaga
    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaDoc = await getDoc(vagaRef);

    if (vagaDoc.exists()) {
      const vaga = vagaDoc.data();

      // Depuração
      console.log("Dados da vaga:", vaga);

      // Preenche os campos na página com os dados da vaga
      const titleElem = document.getElementById("job-title");
      if (titleElem) {
        titleElem.textContent = vaga.Titulo;
      }

      const descriptionElem = document.getElementById("job-description");
      if (descriptionElem) {
        descriptionElem.textContent = vaga.Descricao || "Descrição não disponível";
      }

      const locationElem = document.getElementById("job-location");
      if (locationElem) {
        locationElem.textContent = vaga.Localizacao || "Localização não disponível";
      }

      const salaryElem = document.getElementById("job-salary");
      if (salaryElem) {
        salaryElem.textContent = `R$ ${vaga.Salario || '0,00'}`;
      }

      const formElem = document.getElementById("job-form");
      if (formElem) {
        formElem.textContent = vaga.Forma_Trabalho || "Forma de trabalho não especificada";
      }

      // Exibi cada exigência em uma nova linha
      const requirementsElem = document.getElementById("job-requirements");
      if (requirementsElem) {
        if (vaga.Exigencias && Array.isArray(vaga.Exigencias) && vaga.Exigencias.length > 0) {
          // Limpa o conteúdo anterior
          requirementsElem.innerHTML = '';
          // Adiciona cada exigência como um item de linha com travessão
          vaga.Exigencias.forEach(exigencia => {
            const p = document.createElement("p");  // Cria um <p> para cada exigência
            p.textContent = `— ${exigencia}`;  // Adiciona travessão
            requirementsElem.appendChild(p);
          });
        } else {
          requirementsElem.innerHTML = "<p>Exigências não disponíveis</p>";
        }
      }

      // Exibir cada benefício em uma nova linha com travessão
      const benefitsElem = document.getElementById("job-benefits");
      if (benefitsElem) {
        if (vaga.Beneficios && Array.isArray(vaga.Beneficios) && vaga.Beneficios.length > 0) {
          // Limpa o conteúdo anterior
          benefitsElem.innerHTML = '';
          // Adiciona cada benefício como um item de linha com travessão
          vaga.Beneficios.forEach(beneficio => {
            const p = document.createElement("p");  // Cria um elemento <p> para cada benefício
            p.textContent = `— ${beneficio}`;  //adiciona travessão
            benefitsElem.appendChild(p);
          });
        } else {
          benefitsElem.innerHTML = "<p>Benefícios não disponíveis</p>";
        }
      }

      // Atualizan o link de candidatura com o ID da vaga
      const candidatarElem = document.getElementById("candidatar-link");
      if (candidatarElem) {
        candidatarElem.setAttribute("href", `Curriculo.html?id=${vagaId}`);
      }

    } else {
      alert("Vaga não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao carregar vaga:", error);
    alert("Erro ao carregar a vaga.");
  }
}

document.addEventListener("DOMContentLoaded", carregarVaga);
