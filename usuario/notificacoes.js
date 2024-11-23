import { db, doc, getDoc, setDoc, arrayUnion, Timestamp, onSnapshot, collection, query, where } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Você precisa estar logado para acessar as notificações.");
      window.location.href = "../login.html"; 
      return;
    }

    // Carrega e monitora as candidaturas do usuário
    monitorarCandidaturas(user.uid);
    carregarNotificacoes(user.uid);
  });
});

//monitora mudanças no status da candidatura
async function monitorarCandidaturas(userId) {
  const candidaturaRef = collection(db, "Candidatura"); 

  // Escuta as mudanças no status da candidatura
  const q = query(candidaturaRef, where("Id_Usuario", "==", userId));  // Filtra pelas candidaturas do usuário
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach(docSnapshot => {
      const candidaturaData = docSnapshot.data();
      const status = candidaturaData.status;
      const vagaId = candidaturaData.Id_Vaga;

      // Quando a candidatura for aceita, gera a notificação
      if (status === "Aceito") {
        adicionarNotificacao(userId, vagaId);
      }
    });
  });
}

// Função para adicionar a notificação ao Firestore
async function adicionarNotificacao(usuarioId, vagaId) {
  try {
    // Busca a vaga para obter o nome da empresa
    const vagaRef = doc(db, "Vagas", vagaId);
    const vagaDoc = await getDoc(vagaRef);

    // Verifica se a vaga foi encontrada
    if (vagaDoc.exists()) {
      const vagaData = vagaDoc.data();
      const empresaId = vagaData.EmpresaID;

      console.log("EmpresaID encontrado na vaga:", empresaId); 

      if (!empresaId) {
        throw new Error("EmpresaID não encontrado na vaga.");
      }

      const empresaRef = doc(db, "Empresa", empresaId);
      const empresaDoc = await getDoc(empresaRef);

      // Verifica se a empresa foi encontrada
      if (empresaDoc.exists()) {
        const empresaNome = empresaDoc.data().nome;

        if (!empresaNome) {
          throw new Error("Nome da empresa não encontrado.");
        }

        // Adiciona a notificação ao usuário
        const notificacoesRef = doc(db, "Notificacoes", usuarioId);

        //setDoc para criar o documento de notificações, caso não exista
        await setDoc(notificacoesRef, {
          notificacoes: arrayUnion({
            mensagem: `Sua candidatura para a vaga foi aceita pela empresa ${empresaNome}!`,
            data: Timestamp.now(),
            lida: false
          })
        }, { merge: true });  // atualizar ou criar o documento

        console.log("Notificação enviada com sucesso!");
      } else {
        throw new Error("Empresa não encontrada com o ID fornecido.");
      }
    } else {
      throw new Error("Vaga não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao adicionar notificação:", error);
    alert(`Erro: ${error.message}`);
  }
}

// Função para carregar e exibir as notificações do usuário
async function carregarNotificacoes(userId) {
  const notificacoesRef = doc(db, "Notificacoes", userId);

  // ewscuta as notificações em tempo real
  onSnapshot(notificacoesRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const notificacoes = data.notificacoes || [];

      exibirNotificacoes(notificacoes);
    } else {
      exibirNotificacoes([]);
    }
  });
}

// Carregar notificações e exibir na interface
function exibirNotificacoes(notificacoes) {
  const notificationsList = document.getElementById("notificationsList");

  if (!notificationsList) {
    console.error("Elemento 'notificationsList' não encontrado.");
    return;
  }

  notificationsList.innerHTML = ""; // Limpa as notificações

  if (notificacoes.length === 0) {
    notificationsList.innerHTML = "<li>Nenhuma notificação encontrada.</li>";
    return;
  }

  notificacoes.forEach((notification, index) => {
    const notificationCard = document.createElement("li");
    notificationCard.classList.add("notification-card", notification.lida ? "read" : "unread");

    // Criar o conteúdo do card
    notificationCard.innerHTML = `
      <p>${notification.mensagem}</p>
      <small>${new Date(notification.data.seconds * 1000).toLocaleString("pt-BR")}</small>
      <button class="mark-as-read">Marcar como lida</button>
    `;

    // Adicionar o evento de clique ao botão
    const button = notificationCard.querySelector(".mark-as-read");
    button.addEventListener("click", () => marcarNotificacaoComoLida(notification.mensagem, index));

    notificationsList.appendChild(notificationCard);
  });
}

// Marcar a notificação como lida
async function marcarNotificacaoComoLida(mensagem, notificationIndex) {
  try {
    const usuarioId = "seu_usuario_id_aqui";  // Certifique-se de passar o ID correto do usuário
    const notificacoesRef = doc(db, "Notificacoes", usuarioId);
    const notificacoesDoc = await getDoc(notificacoesRef);

    if (notificacoesDoc.exists()) {
      const notifications = notificacoesDoc.data().notificacoes;
      const notification = notifications[notificationIndex];

      // Marca a notificação como lida
      notification.lida = true;

      // Atualiza as notificações
      await setDoc(notificacoesRef, {
        notificacoes: notifications
      }, { merge: true });

      console.log("Notificação marcada como lida.");
      
      // Atualiza as notificações na interface
      carregarNotificacoes(usuarioId);
    }
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
  }
}

