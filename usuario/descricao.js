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

      // depuração
      console.log("Dados da vaga:", vaga);

      // Preenche os campos na página com os dados da vaga
      const titleElem = document.getElementById("job-title");
      if (titleElem) {
        titleElem.textContent = vaga.Titulo;
      } else {
        console.error("Elemento 'job-title' não encontrado");
      }

      const descriptionElem = document.getElementById("job-description");
      if (descriptionElem) {
        descriptionElem.textContent = vaga.Descricao || "Descrição não disponível";
      } else {
        console.error("Elemento 'job-description' não encontrado");
      }

      const locationElem = document.getElementById("job-location");
      if (locationElem) {
        locationElem.textContent = vaga.Localizacao || "Localização não disponível";
      } else {
        console.error("Elemento 'job-location' não encontrado");
      }

      const salaryElem = document.getElementById("job-salary");
      if (salaryElem) {
        salaryElem.textContent = `R$ ${vaga.Salario || '0,00'}`;
      } else {
        console.error("Elemento 'job-salary' não encontrado");
      }

      const formElem = document.getElementById("job-form");
      if (formElem) {
        formElem.textContent = vaga.Forma_Trabalho || "Forma de trabalho não especificada";
      } else {
        console.error("Elemento 'job-form' não encontrado");
      }

      const requirementsElem = document.getElementById("job-requirements");
      if (requirementsElem) {
        requirementsElem.textContent = vaga.Exigencias ? vaga.Exigencias.join(', ') : "Exigências não disponíveis";
      } else {
        console.error("Elemento 'job-requirements' não encontrado");
      }

      const benefitsElem = document.getElementById("job-benefits");
      if (benefitsElem) {
        benefitsElem.textContent = vaga.Beneficios ? vaga.Beneficios.join(', ') : "Benefícios não disponíveis";
      } else {
        console.error("Elemento 'job-benefits' não encontrado");
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
