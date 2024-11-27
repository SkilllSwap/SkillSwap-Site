import { db, doc, getDoc, setDoc, collection, addDoc } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("curriculumForm");

  // Verifica se o formulário foi encontrado
  if (!form) {
    console.error("Formulário 'curriculumForm' não encontrado.");
    return;
  }

  // Função para que o usuário esteja autenticado
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Você precisa estar logado para acessar este formulário.");
      return;
    }

    // Recupera os dados do currículo do Firebase, se existirem
    try {
      const curriculumDoc = await getDoc(doc(db, "Curriculo", user.uid));

      if (curriculumDoc.exists()) {
        // Se os dados já existem, preenche os campos com as informações
        const data = curriculumDoc.data();

        // Preenche os campos com os dados recuperados
        document.getElementById("nome").value = data.Nome || '';
        document.getElementById("endereco").value = data.Endereco || '';
        document.getElementById("dataNascimento").value = data.DataNascimento || '';
        document.getElementById("estadoCivil").value = data.EstadoCivil || '';
        document.getElementById("sexo").value = data.Sexo || '';
        document.getElementById("nivelEscolaridade").value = data.Formacao[0] || '';
        document.getElementById("instituicao").value = data.Formacao[1] || '';
        document.getElementById("curso").value = data.Formacao[2] || '';
        document.getElementById("inicio").value = data.Formacao[3] || '';
        document.getElementById("termino").value = data.Formacao[4] || '';
        document.getElementById("portfolio").value = data.PdfLink || '';
        document.getElementById("experiencia").value = data.Experiencia || '';

        // Se necessário, preencher o horário letivo com o valor armazenado
        if (data.HorarioLetivo) {
          const radios = document.querySelectorAll('input[name="horario"]');
          radios.forEach(radio => {
            if (radio.value === data.HorarioLetivo) {
              radio.checked = true;
            }
          });
        }
      } else {
        console.log("Nenhum currículo encontrado para este usuário.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do currículo:", error);
    }

    // Envia os dados do formulário para o Firebase
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); 

      // Coleta os dados do formulário
      const nomeElement = document.getElementById("nome");
      const enderecoElement = document.getElementById("endereco");
      const dataNascimentoElement = document.getElementById("dataNascimento");
      const estadoCivilElement = document.getElementById("estadoCivil");
      const sexoElement = document.getElementById("sexo");
      const nivelEscolaridadeElement = document.getElementById("nivelEscolaridade");
      const instituicaoElement = document.getElementById("instituicao");
      const cursoElement = document.getElementById("curso");
      const inicioElement = document.getElementById("inicio");
      const terminoElement = document.getElementById("termino");
      const portfolioElement = document.getElementById("portfolio");
      const experienciaElement = document.getElementById("experiencia");

      // Coleta os valores
      const nome = nomeElement.value.trim();
      const endereco = enderecoElement.value.trim();
      const dataNascimento = dataNascimentoElement.value.trim();
      const estadoCivil = estadoCivilElement.value.trim();
      const sexo = sexoElement.value.trim();
      const nivelEscolaridade = nivelEscolaridadeElement.value.trim();
      const instituicao = instituicaoElement.value.trim();
      const curso = cursoElement.value.trim();
      const inicio = inicioElement.value.trim();
      const termino = terminoElement.value.trim();
      const horarioLetivo = document.querySelector('input[name="horario"]:checked')?.value;
      const portfolio = portfolioElement.value.trim();  
      const experiencia = experienciaElement.value.trim();

      // Valida se os campos obrigatórios foram preenchidos
      if (!nome || !endereco || !dataNascimento || !estadoCivil || !sexo || !nivelEscolaridade || !instituicao || !curso || !inicio || !termino) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      try {
        // 1. Envia os dados do currículo para a coleção 
        const curriculumData = {
          Data_Atualizacao: new Date().toISOString(),
          Experiencia: experiencia,
          Formacao: [nivelEscolaridade, instituicao, curso, inicio, termino],
          Id_Usuario: doc(db, "Usuário", user.uid),
          DataNascimento: dataNascimento,
          Endereco: endereco,
          EstadoCivil: estadoCivil,
          HorarioLetivo: horarioLetivo,
          Nome: nome,
          PdfLink: portfolio,
          Sexo: sexo
        };

        // Adiciona ou atualiza na coleção
        await setDoc(doc(db, "Curriculo", user.uid), curriculumData);
        console.log("Currículo enviado com sucesso.");

        // 2. Adiciona a candidatura na coleção 
        const urlParams = new URLSearchParams(window.location.search);
        const vagaId = urlParams.get('id');
        const candidaturaData = {
          Id_Usuario: user.uid,
          Id_Vaga: vagaId,
          DataCandidatura: new Date().toISOString() 
        };

        await addDoc(collection(db, "Candidatura"), candidaturaData);
        console.log("Candidatura enviada com sucesso.");

        // Exibe animação de check
        const checkContainer = document.getElementById("check-container");
        if (checkContainer) {
          checkContainer.style.display = "block"; 
        }

        setTimeout(() => {
          window.location.href = './FeedVagas.html'; 
        }, 2000); 

        form.reset(); 
      } catch (error) {
        console.error("Erro ao enviar currículo e candidatura:", error);
        alert("Erro ao enviar os dados. Tente novamente.");
      }
    });
  });
});
