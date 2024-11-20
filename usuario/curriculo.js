import { db, doc, setDoc, collection, addDoc } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("curriculumForm");

  // Função para que o usuário esteja autenticado
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Você precisa estar logado para se candidatar!");
      return;
    }

    // enviar os dados do formulário para o Firebase
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Previne o envio padrão do formulário

      // Coleta os dados do formulário
      const nome = document.getElementById("nome").value.trim();
      const endereco = document.getElementById("endereco").value.trim();
      const dataNascimento = document.getElementById("dataNascimento").value.trim();
      const estadoCivil = document.getElementById("estadoCivil").value.trim();
      const sexo = document.getElementById("sexo").value.trim();
      const nivelEscolaridade = document.getElementById("nivelEscolaridade").value.trim();
      const instituicao = document.getElementById("instituicao").value.trim();
      const curso = document.getElementById("curso").value.trim();
      const inicio = document.getElementById("inicio").value.trim();
      const termino = document.getElementById("termino").value.trim();
      const horarioLetivo = document.querySelector('input[name="horario"]:checked')?.value;
      const portfolio = document.getElementById("portfolio").value.trim();  // Corrigido: "portfolio" e "getElementById"
      const experiencia = document.getElementById("experiencia").value.trim();  // Corrigido: "experiencia" e "getElementById"

      // Valida se os campos obrigatórios foram preenchidos
      if (!nome || !endereco || !dataNascimento || !estadoCivil || !sexo || !nivelEscolaridade || !instituicao || !curso || !inicio || !termino) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      // Pega o ID da vaga da URL
      const urlParams = new URLSearchParams(window.location.search);
      const vagaId = urlParams.get('id');
      if (!vagaId) {
        alert("ID da vaga não encontrado.");
        return;
      }

      try {
        // 1. Envia os dados do currículo para a coleção "Curriculo"
        const curriculumData = {
          Data_Atualizacao: new Date().toISOString(),
          Experiencia: experiencia, // Adicionando o campo de experiência
          Formacao: [nivelEscolaridade, instituicao, curso, inicio, termino],
          Id_Usuario: doc(db, "Usuário", user.uid),  // Referência ao usuário
          DataNascimento: dataNascimento,
          Endereco: endereco,
          EstadoCivil: estadoCivil,
          HorarioLetivo: horarioLetivo,
          Nome: nome,
          PdfLink: portfolio,  // Link do portfólio ou PDF
          Sexo: sexo
        };

        // Adiciona na coleção "Curriculo"
        await setDoc(doc(db, "Curriculo", user.uid), curriculumData);
        console.log("Currículo enviado com sucesso.");

        // 2. Adiciona a candidatura na coleção "Candidatura"
        const candidaturaData = {
          Id_Usuario: user.uid,
          Id_Vaga: vagaId,
          DataCandidatura: new Date().toISOString()  // Data da candidatura
        };

        // Adiciona na coleção "Candidatura"
        await addDoc(collection(db, "Candidatura"), candidaturaData);
        console.log("Candidatura enviada com sucesso.");

        // Exibe animação de check
        const checkContainer = document.getElementById("check-container");
        checkContainer.style.display = "block"; // Exibe a animação

        // Redireciona após 2 segundos para a página de FeedVagas.html
        setTimeout(() => {
          window.location.href = './FeedVagas.html'; // Redireciona para o feed de vagas
        }, 2000); // Aguarda 2 segundos para o efeito da animação

        form.reset(); // Limpa o formulário após o envio
      } catch (error) {
        console.error("Erro ao enviar currículo e candidatura:", error);
        alert("Erro ao enviar os dados. Tente novamente.");
      }
    });
  });
});
