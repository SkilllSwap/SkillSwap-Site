document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário
  
    // Aqui você pode adicionar validações de usuário e senha se necessário
    const usuario = document.getElementById("username").value;
    const senha = document.getElementById("password").value;
  
    if (usuario && senha) {
      // Redireciona para a página do feed de vagas após login bem-sucedido
      window.location.href = "./usuario/FeedVagas.html";
    } else {
      alert("Por favor, preencha usuário e senha.");
    }
  });
  