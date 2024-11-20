import { db, doc, getDoc } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const user = auth.currentUser;

  // Checa se o usuário está logado
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Você precisa estar logado para acessar o perfil.");
      window.location.href = "./login.html";  // Redirecionar para a página de login, se não estiver logado.
      return;
    }

    // carregar as informações do perfil
    loadProfileData(user.uid);

    // carregar o currículo
    document.querySelector(".curriculo-btn").addEventListener("click", async () => {
      await showCurriculum(user.uid);
    });

  });
});

//carregar os dados do perfil
async function loadProfileData(userId) {
  try {
    // Recuperar os dados do usuário da coleção
    const userDoc = await getDoc(doc(db, "Usuário", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Atualizar as informações no perfil
      document.getElementById("profileImage").src = userData.foto || "../img/perfil.png";  //foto padrão
      document.getElementById("userName").textContent = userData.nome || "Nome do Usuário";
      document.getElementById("userEmail").textContent = userData.email || "Email não informado";
      document.getElementById("areaAtuacao").textContent = userData.areaAtuacao || "Área de atuação não definida";
      document.getElementById("localizacao").textContent = userData.localizacao || "Localização não informada";
    } else {
      alert("Dados do usuário não encontrados.");
    }
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);
    alert("Erro ao carregar os dados do perfil. Tente novamente.");
  }
}

// exibir o currículo
async function showCurriculum(userId) {
  try {
    const curriculumDoc = await getDoc(doc(db, "Curriculo", userId));
    if (curriculumDoc.exists()) {
      const curriculum = curriculumDoc.data();

      const dataNascimento = new Date(curriculum.DataNascimento).toLocaleDateString("pt-BR") || "Data não informada";
      const dataAtualizacao = new Date(curriculum.Data_Atualizacao).toLocaleString("pt-BR") || "Data não informada";

      // currículo
      document.getElementById('curriculoContent').style.display = 'block';  
      document.getElementById('curriculoInfo').innerHTML = `
        <p><strong>Nome:</strong> ${curriculum.Nome}</p>
        <p><strong>Data de Nascimento:</strong> ${dataNascimento}</p>
        <p><strong>Sexo:</strong> ${curriculum.Sexo || "Não informado"}</p>
        <p><strong>Estado Civil:</strong> ${curriculum.EstadoCivil || "Não informado"}</p>
        <p><strong>Endereço:</strong> ${curriculum.Endereco || "Não informado"}</p>
        <p><strong>Área de Atuação:</strong> ${curriculum.areaAtuacao || "Não informada"}</p>
        <p><strong>Formação Acadêmica:</strong> ${curriculum.Formacao.join(", ") || "Não informada"}</p>
        <p><strong>Experiência Profissional:</strong> ${curriculum.Experiencia || "Não informada"}</p>
        <p><strong>Horário Letivo:</strong> ${curriculum.HorarioLetivo || "Não informado"}</p>
        <p><strong>Última Atualização:</strong> ${dataAtualizacao}</p>
        <p><strong>Portfolio:</strong> <a href="${curriculum.PdfLink}" target="_blank"></a></p>
      `;
    } else {
      alert("Currículo não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar o currículo:", error);
    alert("Erro ao carregar o currículo. Tente novamente.");
  }
}

