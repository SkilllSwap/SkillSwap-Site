import { auth, db, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {

    // enviar os dados da vaga
    async function submitVaga() {
        // Recuperar dados dos campos do formulário
        const titulo = document.getElementById('vagaTitulo').value;
        const area = document.getElementById('vagaArea').value;  
        const beneficios = document.getElementById('vagaBeneficios').value.split(',').map(item => item.trim()); 
        const dataPublicacao = new Date().toISOString(); 
        const descricao = document.getElementById('vagaDescricao').value; 
        const exigencias = document.getElementById('vagaExigencias').value.split(',').map(item => item.trim()); 
        const formaTrabalho = document.getElementById('vagaFormaTrabalho').value;
        const localizacao = document.getElementById('vagaLocalizacao').value; 
        const salario = document.getElementById('vagaSalario').value;  

        if (!titulo || !area || !beneficios.length || !descricao || !exigencias.length || !formaTrabalho || !localizacao || !salario) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Coletar o ID do usuário autenticado 
        const EmpresaID = auth.currentUser?.uid;  // Pode ser null se não estiver logado
        if (!EmpresaID) {
            alert('Você precisa estar logado para criar uma vaga.');
            return;
        }

        // Coletar os dados da vaga
        const vagaData = {
            Titulo: titulo, 
            Area: area, 
            Beneficios: beneficios,  
            Data_Publicacao: dataPublicacao, 
            Descricao: descricao, 
            Exigencias: exigencias, 
            Forma_Trabalho: formaTrabalho, 
            Localizacao: localizacao, 
            Salario: salario,  
            EmpresaID: EmpresaID,  
            createdAt: new Date() 
        };

        try {
            // Cria um novo documento na coleção Vagas com um ID único baseado no título e timestamp
            const vagaRef = doc(db, 'Vagas', titulo + "-" + new Date().getTime());
            await setDoc(vagaRef, vagaData);

            alert('Vaga criada com sucesso!');

            // Limpar os campos após o envio
            document.getElementById('vagaTitulo').value = '';
            document.getElementById('vagaArea').value = '';
            document.getElementById('vagaBeneficios').value = '';
            document.getElementById('vagaDescricao').value = '';
            document.getElementById('vagaExigencias').value = '';
            document.getElementById('vagaFormaTrabalho').value = '';
            document.getElementById('vagaLocalizacao').value = '';
            document.getElementById('vagaSalario').value = '';

            window.location.href = './CriarVagas.html';  

        } catch (error) {
            console.error('Erro ao criar vaga:', error);
            alert('Erro ao criar vaga. Tente novamente.');
        }
    }

    //evento de clique no botão
    document.getElementById('submitVaga').addEventListener('click', submitVaga);

});
