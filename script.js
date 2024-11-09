// Espera 5 segundos antes de redirecionar para a página de login
document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada! Aguardando 5 segundos...");
    
    // Redireciona após 5 segundos
    setTimeout(function() {
      window.location.href = "login.html"; // Substitua "login.html" pelo caminho correto da sua página de login
    }, 5000); // 5000 milissegundos = 5 segundos
  });
  