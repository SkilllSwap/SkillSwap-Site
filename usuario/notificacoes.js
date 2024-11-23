import { db, doc, getDoc, updateDoc, arrayUnion, onSnapshot, Timestamp } from './firebaseConfig.js';
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

// Monitora mudanças no status da candidatura
async function monitorarCandidaturas(userId) {
  const candidaturaRef = doc(db, "Candidatura", userId);

  // Escutando as mudanças no status da candidatura
  onSnapshot(candidaturaRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const candidaturaData = docSnapshot.data();
      const status = candidaturaData.status;
      const empresaId = candidaturaData.empresaId;

      // Quando a candidatura for aceita, gerar a notificação
      if (status === "Aceito") {
        adicionarNotificacao(userId, `Sua candidatura foi aceita pela empresa ${empresaId}!`);
      }
    }
  });
}

// Adiciona a notificação ao Firestore
async function adicionarNotificacao(userId, mensagem) {
  try {
    const notificacoesRef = doc(db, "Notificacoes", userId);

    // Adiciona a notificação no array de notificações
    await updateDoc(notificacoesRef, {
      notificacoes: arrayUnion({
        mensagem: mensagem,
        data: Timestamp.now(),
        lida: false, // A notificação será lida mais tarde
      }),
    });

    console.log("Notificação adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar notificação:", error);
  }
}

// Carrega as notificações do usuário
async function carregarNotificacoes(userId) {
  const notificacoesRef = doc(db, "Notificacoes", userId);

  // Escutando as notificações em tempo real
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

// Exib as notificações na interface
function exibirNotificacoes(notificacoes) {
  const notificationsList = document.getElementById("notificationsList");
  notificationsList.innerHTML = "";

  if (notificacoes.length === 0) {
    notificationsList.innerHTML = "<li>Nenhuma notificação encontrada.</li>";
    return;
  }

  notificacoes.forEach((notification, index) => {
    const notificationItem = document.createElement("li");
    notificationItem.classList.add(notification.lida ? "read" : "unread");
    notificationItem.innerHTML = `
      <p>${notification.mensagem}</p>
      <small>${new Date(notification.data.seconds * 1000).toLocaleString("pt-BR")}</small>
      <button onclick="marcarNotificacaoComoLida('${notification.mensagem}', ${index})">Marcar como lida</button>
    `;
    notificationsList.appendChild(notificationItem);
  });
}

// Marca uma notificação como lida
async function marcarNotificacaoComoLida(userId, notificationIndex) {
  try {
    const notificacoesRef = doc(db, "Notificacoes", userId);
    const notificacoesDoc = await getDoc(notificacoesRef);

    if (notificacoesDoc.exists()) {
      const notifications = notificacoesDoc.data().notificacoes;
      const notification = notifications[notificationIndex];
      
      // Marca como lida
      notification.lida = true;

      // Atualiza a notificação
      await updateDoc(notificacoesRef, {
        notificacoes: notifications
      });

      console.log("Notificação marcada como lida.");
    }
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
  }
}
