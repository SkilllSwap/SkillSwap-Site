import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { doc, getDoc, updateDoc } from '../usuario/firebaseConfig'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';

const auth = getAuth();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId'); // Obtém o userId da URL

  // Verifica se o userId existe na URL
  if (!userId) {
    alert("ID do usuário não encontrado.");
    window.location.href = "./perfil.html"; // Redireciona para a página de perfil se não encontrar o userId
    return;
  }

  console.log("User ID da URL:", userId); // Depuração

  // Verifica se o usuário está logado
  onAuthStateChanged(auth, async (user) => {
    if (!user || user.uid !== userId) {
      alert("Você precisa estar logado para editar o perfil.");
      window.location.href = "../login.html"; // Redireciona para o login se o usuário não estiver logado
      return;
    }

    console.log("Usuário logado:", user.uid); // Depuração
    loadProfileData(user.uid); // Carrega os dados do perfil

    // Submissão do formulário para salvar alterações
    document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
      event.preventDefault(); // Previne o envio normal do formulário
      await updateProfile(user.uid); // Atualiza os dados do perfil
    });
  });
});

// Função para carregar os dados do perfil do usuário
async function loadProfileData(userId) {
  try {
    const userDoc = await getDoc(doc(db, "Usuário", userId)); // Obtém os dados do usuário

    // Verifica se o documento do usuário existe no Firestore
    if (userDoc.exists()) {
      const userData = userDoc.data(); // Extrai os dados do usuário do Firestore

      console.log("Dados do usuário carregados:", userData); // Depuração

      // Atualiza os campos do formulário com os dados do usuário
      document.getElementById("editName").value = userData.nome || ""; // Se não houver nome, o campo fica vazio
      document.getElementById("editEmail").value = userData.email || ""; // Se não houver email, o campo fica vazio
      document.getElementById("editAreaAtuacao").value = userData.areaAtuacao || ""; // Se não houver área de atuação, o campo fica vazio
      document.getElementById("editLocalizacao").value = userData.localizacao || ""; // Se não houver localização, o campo fica vazio

      // Atualiza a imagem do perfil, caso exista uma foto armazenada no Firestore
      document.getElementById("profileImage").src = userData.foto || "../img/perfil.png"; // Foto padrão se não houver foto
    } else {
      alert("Usuário não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);
    alert("Erro ao carregar os dados do perfil. Tente novamente.");
  }
}

// Função para atualizar os dados do perfil no Firestore
async function updateProfile(userId) {
  const updatedData = {
    nome: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    areaAtuacao: document.getElementById("editAreaAtuacao").value,
    localizacao: document.getElementById("editLocalizacao").value,
  };

  // Verifica se os campos obrigatórios foram preenchidos
  if (!updatedData.nome || !updatedData.email) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Verifica se foi escolhida uma nova foto de perfil
  const fileInput = document.getElementById("editProfilePicture");
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storageRef = ref(storage, `perfil/${userId}/foto.jpg`); // Referência para o arquivo no Firebase Storage

    try {
      // Faz upload da nova foto de perfil
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef); // Obtém o link da foto carregada
      updatedData.foto = photoURL; // Atualiza a URL da foto no objeto de dados
    } catch (uploadError) {
      console.error("Erro ao fazer upload da foto:", uploadError);
      alert("Erro ao carregar a foto. Tente novamente.");
      return;
    }
  }

  try {
    // Atualiza os dados do usuário no Firestore
    await updateDoc(doc(db, "Usuário", userId), updatedData);
    alert("Perfil atualizado com sucesso!");
    window.location.href = `./perfil.html?userId=${userId}`; // Redireciona para a página de perfil após a atualização
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    alert("Erro ao atualizar o perfil. Tente novamente.");
  }
}
