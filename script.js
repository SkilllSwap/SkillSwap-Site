document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada! Aguardando 5 segundos...");
    
    // Redireciona após 5 segundos
    setTimeout(function() {
      window.location.href = "login.html";
    }, 3000); // a cada 1000 milissegundos = 1 segundo
  });
  