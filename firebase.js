import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function() {

    //validação de formulário Usuário
    function validateUserForm() {
        const cpf = document.getElementById('userCpf').value;
        const dataNascimento = document.getElementById('userDataNascimento').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const nome = document.getElementById('userNome').value;
        const telefone = document.getElementById('userTelefone').value;

        if (!cpf || !dataNascimento || !email || !password || !nome || !telefone) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert('Email inválido.');
            return false;
        }

        return true;
    }

    //registro no Firebase Usuário
    async function registerUser() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const nome = document.getElementById('userNome').value;
        const cpf = document.getElementById('userCpf').value;
        const dataNascimento = document.getElementById('userDataNascimento').value;
        const telefone = document.getElementById('userTelefone').value;

        try {
            console.log('Tentando registrar usuário com e-mail:', email);

            // Criar usuário 
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Usuário criado com sucesso:', user.uid); 

            // Verificar se os dados estão corretos 
            console.log('Dados do usuário a serem salvos:', {
                cpf: cpf,
                data_nascimento: dataNascimento,
                email: email,
                nome: nome,
                telefone: telefone,
            });

            const userRef = doc(db, 'Usuário', user.uid); 
            console.log('Salvando dados do usuário na coleção "Usuário"...');
            await setDoc(userRef, {
                cpf: cpf,
                data_nascimento: dataNascimento,
                email: email,
                nome: nome,
                telefone: telefone,
            });

            alert('Usuário cadastrado com sucesso!');
            document.getElementById('userForm').reset();
            window.location.href = "./usuario/FeedVagas.html";  
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert(error.message);
        }
    }

    //enviar dados do Usuário
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateUserForm()) {
            registerUser();
        }
    });

    //registro no Firebase Empresa
    async function registerCompany() {
        const email = document.getElementById('companyEmail').value;
        const password = document.getElementById('companyPassword').value;
        const nome = document.getElementById('companyNome').value;
        const cnpj = document.getElementById('companyCNPJ').value;
        const dataFundacao = document.getElementById('companyDataFundacao').value;
        const telefone = document.getElementById('companyTelefone').value;

        try {
            const companyCredential = await createUserWithEmailAndPassword(auth, email, password);
            const company = companyCredential.user;

            const companyRef = doc(db, 'Empresa', company.uid);
            await setDoc(companyRef, {
                cnpj: cnpj,
                data_fundacao: dataFundacao,
                email: email,
                nome: nome,
                telefone: telefone,
            });

            alert('Empresa cadastrada com sucesso!');
            document.getElementById('companyForm').reset();
            window.location.href = "pagina2.html";  
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error);
            alert(error.message);
        }
    }

    // alternar entre os formulários
    function showUserForm() {
        document.getElementById('userTab').classList.add('active');
        document.getElementById('companyTab').classList.remove('active');
        document.getElementById('userForm').classList.add('active');
        document.getElementById('companyForm').classList.remove('active');
    }

    function showCompanyForm() {
        document.getElementById('companyTab').classList.add('active');
        document.getElementById('userTab').classList.remove('active');
        document.getElementById('companyForm').classList.add('active');
        document.getElementById('userForm').classList.remove('active');
    }

    //eventos de clique no tabs
    const userTab = document.getElementById('userTab');
    const companyTab = document.getElementById('companyTab');

    if (userTab && companyTab) {
        userTab.addEventListener('click', showUserForm);
        companyTab.addEventListener('click', showCompanyForm);
    }

    //começar com o formulário de Usuário
    showUserForm();
});
