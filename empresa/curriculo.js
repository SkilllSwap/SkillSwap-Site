import { db, doc, getDoc, deleteDoc, updateDoc, collection, addDoc, query, where, getDocs } from './firebaseConfig.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Captura o usuarioId e o vagaId da URL
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioId = urlParams.get('usuarioId');
  const vagaId = urlParams.get('vagaId'); 

  if (!usuarioId || !vagaId) {
    alert("Candidato ou Vaga não encontrados.");
    return;
  }

  try {
    const curriculoRef = doc(db, "Curriculo", usuarioId);
    const curriculoDoc = await getDoc(curriculoRef);

    if (curriculoDoc.exists()) {
      const curriculoData = curriculoDoc.data();

      // Atualizando os campos do HTML com os dados do Firebase
      document.getElementById("nome").textContent = curriculoData.Nome || "Não disponível";
      document.getElementById("endereco").textContent = curriculoData.Endereco || "Não disponível";
      document.getElementById("dataNascimento").textContent = curriculoData.DataNascimento || "Não disponível";
      document.getElementById("estadoCivil").textContent = curriculoData.EstadoCivil || "Não disponível";
      document.getElementById("sexo").textContent = curriculoData.Sexo || "Não disponível";
      document.getElementById("experiencia").textContent = curriculoData.Experiencia || "Não disponível";
      document.getElementById("nivelEscolaridade").textContent = curriculoData.Formacao[0] || "Não disponível";
      document.getElementById("instituicao").textContent = curriculoData.Formacao[1] || "Não disponível";
      document.getElementById("curso").textContent = curriculoData.Formacao[2] || "Não disponível";
      document.getElementById("inicio").textContent = curriculoData.Formacao[3] || "Não disponível";
      document.getElementById("termino").textContent = curriculoData.Formacao[4] || "Não disponível";
      document.getElementById("horarioLetivo").textContent = curriculoData.HorarioLetivo || "Não disponível";
      const portfolioLink = document.getElementById("portfolio");
      if (portfolioLink) portfolioLink.href = curriculoData.PdfLink || "#";

    
      document.getElementById("aceitarBtn").addEventListener("click", () => aceitarCurriculo(usuarioId, vagaId));
      document.getElementById("guardarBtn").addEventListener("click", () => guardarCurriculo(usuarioId, vagaId));
      document.getElementById("excluirBtn").addEventListener("click", () => excluirCurriculo(usuarioId, vagaId));
    } else {
      alert("Currículo não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar currículo:", error);
    alert("Erro ao carregar o currículo. Tente novamente.");
  }
});

// Funções para os botões de ação
async function aceitarCurriculo(usuarioId, vagaId) {
  try {
    const candidaturaRef = collection(db, "Candidatura");
    const q = query(candidaturaRef, where("Id_Usuario", "==", usuarioId), where("Id_Vaga", "==", vagaId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const candidaturaDocRef = querySnapshot.docs[0].ref;
      await updateDoc(candidaturaDocRef, {
        status: 'Aceito', // Atualiza o status para "Aceito"
        dataAceitacao: new Date().toISOString() // Adiciona a data da aceitação
      });
      alert("Currículo aceito com sucesso!");
    } else {
      alert("Candidatura não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao aceitar currículo:", error);
    alert("Erro ao aceitar o currículo. Tente novamente.");
  }
}

async function guardarCurriculo(usuarioId, vagaId) {
  try {
    await addDoc(collection(db, "CurriculosSalvos"), {
      usuarioId: usuarioId,
      vagaId: vagaId
      
    });
    alert("Currículo guardado com sucesso!");
  } catch (error) {
    console.error("Erro ao guardar currículo:", error);
    alert("Erro ao guardar o currículo. Tente novamente.");
  }
}

async function excluirCurriculo(usuarioId, vagaId) {
  try {
    const candidaturaRef = collection(db, "Candidatura");
    const q = query(candidaturaRef, where("Id_Usuario", "==", usuarioId), where("Id_Vaga", "==", vagaId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const candidaturaDocRef = querySnapshot.docs[0].ref;
      await deleteDoc(candidaturaDocRef); // Exclui o currículo da candidatura
      alert("Currículo excluído com sucesso!");
      window.location.href = "./NomeCandidatos.html"; 
    } else {
      alert("Candidatura não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao excluir currículo:", error);
    alert("Erro ao excluir o currículo. Tente novamente.");
  }
}
