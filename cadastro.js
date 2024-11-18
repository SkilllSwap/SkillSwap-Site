import { auth, db, createUserWithEmailAndPassword, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', function() {

    // Alternar entre os formulários
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

    // Eventos de clique nos tabs
    const userTab = document.getElementById('userTab');
    const companyTab = document.getElementById('companyTab');

    if (userTab && companyTab) {
        userTab.addEventListener('click', showUserForm);
        companyTab.addEventListener('click', showCompanyForm);
    }

    // Começar com o formulário de Usuário
    showUserForm();

    // Validação de formulário Usuário
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

    // Validação de formulário Empresa
    function validateCompanyForm() {
        const cnpj = document.getElementById('companyCNPJ').value;
        const dataFundacao = document.getElementById('companyDataFundacao').value;
        const email = document.getElementById('companyEmail').value;
        const password = document.getElementById('companyPassword').value;
        const nome = document.getElementById('companyNome').value;
        const telefone = document.getElementById('companyTelefone').value;

        if (!cnpj || !dataFundacao || !email || !password || !nome || !telefone) {
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

    // Registro no Firebase Usuário
    async function registerUser() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const nome = document.getElementById('userNome').value;
        const cpf = document.getElementById('userCpf').value;
        const dataNascimento = document.getElementById('userDataNascimento').value;
        const telefone = document.getElementById('userTelefone').value;

        try {
            console.log('Tentando registrar usuário com e-mail:', email);

            // Criar usuário no Firebase
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

            // Salvar dados no Firestore
            const userRef = doc(db, 'Usuário', user.uid); 
            await setDoc(userRef, {
                cpf: cpf,
                data_nascimento: dataNascimento,
                email: email,
                nome: nome,
                telefone: telefone,
            });

            alert('Usuário cadastrado com sucesso!');
            document.getElementById('userForm').reset();
            window.location.href = "./usuario/FeedVagas.html";  // Redirecionamento após sucesso
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert(error.message);
        }
    }

    // Enviar dados do Usuário
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateUserForm()) {
            registerUser();
        }
    });

    // Registro no Firebase Empresa
    async function registerCompany() {
        const email = document.getElementById('companyEmail').value;
        const password = document.getElementById('companyPassword').value;
        const nome = document.getElementById('companyNome').value;
        const cnpj = document.getElementById('companyCNPJ').value;
        const dataFundacao = document.getElementById('companyDataFundacao').value;
        const telefone = document.getElementById('companyTelefone').value;

        try {
            console.log('Tentando registrar empresa com e-mail:', email);

            // Criar empresa no Firebase
            const companyCredential = await createUserWithEmailAndPassword(auth, email, password);
            const company = companyCredential.user;

            console.log('Empresa criada com sucesso:', company.uid); 

            // Salvar dados no Firestore
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
            window.location.href = "./empresa/FeedCurriculo.html";  // Redirecionamento após sucesso
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error);
            alert(error.message);
        }
    }

    // Enviar dados da Empresa
    document.getElementById('companyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateCompanyForm()) {
            registerCompany();
        }
    });
});
