import { db, doc, getDoc, updateDoc } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const auth = getAuth();
const storage = getStorage();

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId'); 

  if (!userId) {
    alert("ID do usuário não encontrado.");
    window.location.href = "./perfil.html";
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (!user || user.uid !== userId) {
      alert("Você precisa estar logado para editar o perfil.");
      window.location.href = "../login.html";
      return;
    }

    loadProfileData(user.uid); // Carrega os dados do perfil 

    //edição
    document.getElementById("editProfileForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      await updateProfile(user.uid); // Atualiza os dados do perfil
    });
  });
});

// Carrega dados do perfil do usuário
async function loadProfileData(userId) {
  try {
    const userDoc = await getDoc(doc(db, "Usuário", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Atualiza os campos do formulário com os dados do usuário
      document.getElementById("editName").value = userData.nome || "";
      document.getElementById("editEmail").value = userData.email || "";
      document.getElementById("editAreaAtuacao").value = userData.areaAtuacao || "";
      document.getElementById("editLocalizacao").value = userData.localizacao || "";
      document.getElementById("profileImage").src = userData.foto || "../img/perfil.png";
    } else {
      alert("Usuário não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);
    alert("Erro ao carregar os dados do perfil. Tente novamente.");
  }
}

// Atualiza os dados do perfil do usuário
async function updateProfile(userId) {
  const updatedData = {
    nome: document.getElementById("editName").value,
    email: document.getElementById("editEmail").value,
    areaAtuacao: document.getElementById("editAreaAtuacao").value,
    localizacao: document.getElementById("editLocalizacao").value,
  };

  if (!updatedData.nome || !updatedData.email) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  const fileInput = document.getElementById("editProfilePicture");
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const storageRef = ref(storage, `perfil/${userId}/foto.jpg`);

    try {
      // Upload da nova foto e obtenção do link
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      updatedData.foto = photoURL;
    } catch (uploadError) {
      console.error("Erro ao fazer upload da foto:", uploadError);
      alert("Erro ao carregar a foto. Tente novamente.");
      return;
    }
  }

  try {
    // Atualizar os dados do usuário no Firestore
    await updateDoc(doc(db, "Usuário", userId), updatedData);
    alert("Perfil atualizado com sucesso!");
    window.location.href = `./perfil.html?userId=${userId}`; 
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    alert("Erro ao atualizar o perfil. Tente novamente.");
  }
}
