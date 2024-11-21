import { db, doc, getDoc, deleteDoc } from './firebaseConfig.js';

async function carregarVaga() {
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get('vagaId'); 

  console.log("ID da Vaga:", vagaId); 

  if (!vagaId) {
    alert("ID da vaga não especificado na URL.");
    return;
  }

  try {
    // Verifica o documento da vaga no Firestore
    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaDoc = await getDoc(vagaRef);

    if (vagaDoc.exists()) {
      const vaga = vagaDoc.data();
      console.log("Vaga encontrada:", vaga); // Exibe os dados da vaga no console

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

      const requirementsElem = document.getElementById("job-requirements");
      if (requirementsElem) {
        if (vaga.Exigencias && Array.isArray(vaga.Exigencias) && vaga.Exigencias.length > 0) {
          // Limpa o conteúdo anterior
          requirementsElem.innerHTML = '';

          vaga.Exigencias.forEach(exigencia => {
            const p = document.createElement("p");
            p.textContent = `— ${exigencia}`;
            requirementsElem.appendChild(p);
          });
        } else {
          requirementsElem.innerHTML = "<p>Exigências não disponíveis</p>";
        }
      }

      const benefitsElem = document.getElementById("job-benefits");
      if (benefitsElem) {
        if (vaga.Beneficios && Array.isArray(vaga.Beneficios) && vaga.Beneficios.length > 0) {
          benefitsElem.innerHTML = '';
          vaga.Beneficios.forEach(beneficio => {
            const p = document.createElement("p");
            p.textContent = `— ${beneficio}`;
            benefitsElem.appendChild(p);
          });
        } else {
          benefitsElem.innerHTML = "<p>Benefícios não disponíveis</p>";
        }
      }

      // Atualiza o link de edição com o ID da vaga
      const editElem = document.getElementById("edit-link");
      if (editElem) {
        editElem.setAttribute("href", `EditarVaga.html?vagaId=${vagaId}`);
      }

      // Função para excluir a vaga
      const deleteButton = document.getElementById("delete-button");
      if (deleteButton) {
        deleteButton.addEventListener("click", async () => {
          try {
            // Excluir a vaga 
            await deleteDoc(vagaRef);
            alert("Vaga excluída com sucesso!");
            window.location.href = "./MinhasVagas.html"; 
          } catch (error) {
            console.error("Erro ao excluir vaga:", error);
            alert("Erro ao excluir a vaga.");
          }
        });
      }
    } else {
      console.log("Vaga não encontrada no Firestore.");
      alert("Vaga não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao carregar vaga:", error);
    alert("Erro ao carregar a vaga.");
  }
}


document.addEventListener("DOMContentLoaded", carregarVaga);
