// Mostrar formulário do Usuário
function showUserForm() {
    document.getElementById('userTab').classList.add('active');
    document.getElementById('companyTab').classList.remove('active');
    document.getElementById('userForm').classList.add('active');
    document.getElementById('companyForm').classList.remove('active');
}

// Mostrar formulário da Empresa
function showCompanyForm() {
    document.getElementById('companyTab').classList.add('active');
    document.getElementById('userTab').classList.remove('active');
    document.getElementById('companyForm').classList.add('active');
    document.getElementById('userForm').classList.remove('active');
}

// Inicialização: Exibe o formulário de Usuário por padrão
showUserForm();

// Função para lidar com o cadastro do Usuário
function handleUserRegistration(event) {
    event.preventDefault();  // Impede o envio do formulário

    // Aqui você pode pegar os dados do formulário e realizar a validação ou enviar para o backend.
    
    // Redirecionar para a página 1 (Usuário)
    window.location.href = "./usuario/FeedVagas.html";  // Redirecionamento para a página de usuário
}

// Função para lidar com o cadastro da Empresa
function handleCompanyRegistration(event) {
    event.preventDefault();  // Impede o envio do formulário

    // Aqui você pode pegar os dados do formulário e realizar a validação ou enviar para o backend.

    // Redirecionar para a página 2 (Empresa)
    window.location.href = "pagina2.html";  // Redirecionamento para a página de empresa
}

// Atribuindo os eventos de submissão aos formulários
document.getElementById('userForm').addEventListener('submit', handleUserRegistration);
document.getElementById('companyForm').addEventListener('submit', handleCompanyRegistration);
