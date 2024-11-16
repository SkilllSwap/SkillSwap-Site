import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function() {
    // Função para mostrar o formulário de Usuário
    function showUserForm() {
        document.getElementById('userTab').classList.add('active');
        document.getElementById('companyTab').classList.remove('active');
        document.getElementById('userForm').classList.add('active');
        document.getElementById('companyForm').classList.remove('active');
    }

    // Função para mostrar o formulário de Empresa
    function showCompanyForm() {
        document.getElementById('companyTab').classList.add('active');
        document.getElementById('userTab').classList.remove('active');
        document.getElementById('companyForm').classList.add('active');
        document.getElementById('userForm').classList.remove('active');
    }

    // Inicialização: Exibe o formulário de Usuário por padrão
    showUserForm();

    // Função de validação de formulário de Usuário
    function validateUserForm() {
        const username = document.getElementById('userUsername').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        if (!username || !email || !password) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }

        // Validação de email simples
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert('Email inválido.');
            return false;
        }

        return true;
    }

    // Função de validação de formulário de Empresa
    function validateCompanyForm() {
        const name = document.getElementById('companyName').value;
        const email = document.getElementById('companyEmail').value;
        const password = document.getElementById('companyPassword').value;
        const cnpj = document.getElementById('companyCNPJ').value;

        if (!name || !email || !password || !cnpj) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }

        // Validação de email simples
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert('Email inválido.');
            return false;
        }

        return true;
    }

    // Função para enviar o formulário de Usuário
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateUserForm()) {
            registerUser();
        }
    });

    // Função para enviar o formulário de Empresa
    document.getElementById('companyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCompanyForm()) {
            registerCompany();
        }
    });

    // Função de registro no Firebase para Usuário
    async function registerUser() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const username = document.getElementById('userUsername').value;

        try {
            // Utilizando Firebase Auth para criar o usuário
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Salvando informações adicionais no Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                username: username,
                email: email,
            });

            alert('Usuário cadastrado com sucesso!');
            // Resetando o formulário
            document.getElementById('userForm').reset();

            // Redirecionando para a página de feed de vagas
            window.location.href = "./usuario/FeedVagas.html";  
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert(error.message);
        }
    }

    // Função de registro no Firebase para Empresa
    async function registerCompany() {
        const email = document.getElementById('companyEmail').value;
        const password = document.getElementById('companyPassword').value;
        const companyName = document.getElementById('companyName').value;
        const cnpj = document.getElementById('companyCNPJ').value;

        try {
            // Utilizando Firebase Auth para criar a empresa
            const companyCredential = await createUserWithEmailAndPassword(auth, email, password);
            const company = companyCredential.user;

            // Salvando informações adicionais no Firestore
            const companyRef = doc(db, 'companies', company.uid);
            await setDoc(companyRef, {
                companyName: companyName,
                cnpj: cnpj,
                email: email,
            });

            alert('Empresa cadastrada com sucesso!');
            // Resetando o formulário
            document.getElementById('companyForm').reset();

            // Redirecionando para a página de feed de empresas
            window.location.href = "pagina2.html";  
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error);
            alert(error.message);
        }
    }

    // Adicionar eventos de clique aos tabs
    const userTab = document.getElementById('userTab');
    const companyTab = document.getElementById('companyTab');

    if (userTab && companyTab) {
        userTab.addEventListener('click', showUserForm);
        companyTab.addEventListener('click', showCompanyForm);
    }
});
