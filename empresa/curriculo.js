import { db, doc, getDoc, updateDoc, arrayUnion, Timestamp, collection, query, where, getDocs, deleteDoc, addDoc, setDoc } from './firebaseConfig.js';

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

      // Ações dos botões
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

// Função para aceitar o currículo e adicionar uma notificação ao usuário
async function aceitarCurriculo(usuarioId, vagaId) {
  try {
    const candidaturaRef = collection(db, "Candidatura");
    const q = query(candidaturaRef, where("Id_Usuario", "==", usuarioId), where("Id_Vaga", "==", vagaId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const candidaturaDocRef = querySnapshot.docs[0].ref;
      await updateDoc(candidaturaDocRef, {
        status: 'Aceito',
        dataAceitacao: new Date().toISOString() 
      });

      await adicionarNotificacao(usuarioId, vagaId); 

      alert("Currículo aceito com sucesso!");
    } else {
      alert("Candidatura não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao aceitar currículo:", error);
    alert("Erro ao aceitar o currículo. Tente novamente.");
  }
}

async function adicionarNotificacao(usuarioId, vagaId) {
  try {
    // Buscar a vaga para obter o nome da empresa
    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaDoc = await getDoc(vagaRef);

    if (vagaDoc.exists()) {
      const vagaData = vagaDoc.data();
      const empresaId = vagaData.EmpresaID;

      if (!empresaId) {
        throw new Error("EmpresaID não encontrado na vaga.");
      }

      // Buscar a empresa para pegar o nome da empresa
      const empresaRef = doc(db, "Empresa", empresaId);
      const empresaDoc = await getDoc(empresaRef);

      if (empresaDoc.exists()) {
        const empresaNome = empresaDoc.data().nome;

        if (!empresaNome) {
          throw new Error("Nome da empresa não encontrado.");
        }

        // Verifica se o documento de notificações do usuário existe
        const notificacoesRef = doc(db, "Notificacoes", usuarioId);
        const notificacoesDoc = await getDoc(notificacoesRef);

        if (notificacoesDoc.exists()) {
          // Se o documento de notificações existe, usamos updateDoc para adicionar a notificação
          await updateDoc(notificacoesRef, {
            notificacoes: arrayUnion({
              mensagem: `Sua candidatura para a vaga foi aceita pela empresa ${empresaNome}!`,
              vagaId: vagaId, 
              data: Timestamp.now(), 
              lida: false 
            })
          });
        } else {
          // Se o documento de notificações não existe, criamos o documento com a nova notificação
          await setDoc(notificacoesRef, {
            notificacoes: [
              {
                mensagem: `Sua candidatura para a vaga foi aceita pela empresa ${empresaNome}!`,
                vagaId: vagaId,
                data: Timestamp.now(),
                lida: false
              }
            ]
          });
        }

        console.log("Notificação enviada com sucesso!");
      } else {
        throw new Error("Empresa não encontrada com o ID fornecido.");
      }
    } else {
      throw new Error("Vaga não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao adicionar notificação:", error);
    alert(`Erro ao adicionar notificação: ${error.message}`);
  }
}

//guarda o currículo
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

//exclui o currículo
async function excluirCurriculo(usuarioId, vagaId) {
  try {
    const candidaturaRef = collection(db, "Candidatura");
    const q = query(candidaturaRef, where("Id_Usuario", "==", usuarioId), where("Id_Vaga", "==", vagaId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const candidaturaDocRef = querySnapshot.docs[0].ref;
      await deleteDoc(candidaturaDocRef); 
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
