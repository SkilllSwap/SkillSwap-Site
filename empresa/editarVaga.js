import { db, doc, getDoc, updateDoc } from './firebaseConfig.js';

async function carregarVagaParaEdicao() {
  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get('vagaId'); 

  if (!vagaId) {
    alert("ID da vaga não especificado na URL.");
    return;
  }

  try {
    // Verifica o documento da vaga 
    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaDoc = await getDoc(vagaRef);

    if (vagaDoc.exists()) {
      const vaga = vagaDoc.data();

      // Atualiza o título da página com o título da vaga
      document.title = `Editar Vaga: ${vaga.Titulo}`;
      document.querySelector(".title").textContent = `Editar Vaga: ${vaga.Titulo}`;

      // Preenche os campos do formulário com os dados da vaga
      document.getElementById("job-title").value = vaga.Titulo;
      document.getElementById("job-description").value = vaga.Descricao;
      document.getElementById("job-location").value = vaga.Localizacao;
      document.getElementById("job-salary").value = vaga.Salario;
      document.getElementById("job-form").value = vaga.Forma_Trabalho;
      document.getElementById("job-benefits").value = vaga.Beneficios.join(", ");
      document.getElementById("job-requirements").value = vaga.Exigencias.join(", ");

    } else {
      console.log("Vaga não encontrada no Firestore.");
      alert("Vaga não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao carregar vaga para edição:", error);
    alert("Erro ao carregar a vaga.");
  }
}

async function atualizarVaga(event) {
  event.preventDefault(); // Impede o envio do formulário

  const urlParams = new URLSearchParams(window.location.search);
  const vagaId = urlParams.get('vagaId'); 

  const updatedData = {
    Titulo: document.getElementById("job-title").value,
    Descricao: document.getElementById("job-description").value,
    Localizacao: document.getElementById("job-location").value,
    Salario: document.getElementById("job-salary").value,
    Forma_Trabalho: document.getElementById("job-form").value,
    Beneficios: document.getElementById("job-benefits").value.split(",").map(b => b.trim()),
    Exigencias: document.getElementById("job-requirements").value.split(",").map(e => e.trim())
  };

  try {
    const vagaRef = doc(db, "Vagas", vagaId);
    await updateDoc(vagaRef, updatedData); // Atualiza os dados no Firestore
    alert("Vaga atualizada com sucesso!");
    window.location.href = `./Vaga`; 
  } catch (error) {
    console.error("Erro ao atualizar a vaga:", error);
    alert("Erro ao atualizar a vaga.");
  }
}

document.addEventListener("DOMContentLoaded", carregarVagaParaEdicao);

document.getElementById("vaga-form").addEventListener("submit", atualizarVaga);
