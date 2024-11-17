import { auth, db, signInWithEmailAndPassword, doc, getDoc } from './firebaseConfig.js';

//alertas
function showAlert(message) {
  alert(message);
}

// verificar se o usuário existe nas coleções 
async function checkUserType(uid) {
  try {
    // Verificar no Usuário
    const userDocRef = doc(db, 'Usuário', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log('Usuário encontrado na coleção "Usuário"');
      return 'user'; // Se encontrado o usuário
    }

    // Verificar na Empresa 
    const companyDocRef = doc(db, 'Empresa', uid);
    const companyDoc = await getDoc(companyDocRef);

    if (companyDoc.exists()) {
      console.log('Usuário encontrado na coleção "Empresa"');
      return 'company'; // Se encontrado a empresa
    }

    // Caso o usuário não seja encontrado 
    console.log('Usuário não encontrado em nenhuma coleção');
    return null;
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    showAlert("Erro ao verificar usuário no banco de dados");
    return null;
  }
}

// carregamento do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir o envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showAlert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Realizando o login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // usuário autenticado

      // Verificando o tipo de usuário 
      const userType = await checkUserType(user.uid);

      if (userType === 'user') {
        showAlert('Login feito com sucesso! Redirecionando para a página de usuário...');
        window.location.href = './usuario/FeedVaga.html';
      } else if (userType === 'company') {
        showAlert('Login feito com sucesso! Redirecionando para a página de empresa...');
        window.location.href = './pagina1.html';
      } else {
        showAlert('Usuário não encontrado em nenhuma coleção.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      showAlert('Erro ao fazer login: ' + error.message);
    }
  });
});
