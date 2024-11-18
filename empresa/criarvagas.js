import { auth, db, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {

    // nviar os dados da vaga para o Firestore
    async function submitVaga() {
        const titulo = document.getElementById('vagaTitulo').value;
        const area = document.getElementById('vagaArea').value;  
        const beneficios = document.getElementById('vagaBeneficios').value; 
        const dataPublicacao = new Date().toISOString(); 
        const descricao = document.getElementById('vagaDescricao').value; 
        const exigencias = document.getElementById('vagaExigencias').value; 
        const formaTrabalho = document.getElementById('vagaFormaTrabalho').value;
        const localizacao = document.getElementById('vagaLocalizacao').value; 
        const salario = document.getElementById('vagaSalario').value;  

        // Verifica se todos os campos estão preenchidos
        if (!titulo || !area || !beneficios || !descricao || !exigencias || !formaTrabalho || !localizacao || !salario) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Coletar os dados
        const vagaData = {
            titulo: titulo,
            area: area,
            beneficios: beneficios,
            data_publicacao: dataPublicacao, 
            descricao: descricao,
            exigencias: exigencias,
            forma_trabalho: formaTrabalho,
            localizacao: localizacao,
            salario: salario,
            createdAt: new Date()  // Adiciona a data de criação da vaga
        };

        try {
            //  um documento na coleção 
            const vagaRef = doc(db, 'Vagas', titulo + "-" + new Date().getTime());  // Usando o título e timestamp como ID único
            await setDoc(vagaRef, vagaData);

            alert('Vaga criada com sucesso!');

            // Limpar os campos
            document.getElementById('vagaTitulo').value = '';
            document.getElementById('vagaArea').value = '';
            document.getElementById('vagaBeneficios').value = '';
            document.getElementById('vagaDescricao').value = '';
            document.getElementById('vagaExigencias').value = '';
            document.getElementById('vagaFormaTrabalho').value = '';
            document.getElementById('vagaLocalizacao').value = '';
            document.getElementById('vagaSalario').value = '';

            window.location.href = './FeedCurriculo.html';  

        } catch (error) {
            console.error('Erro ao criar vaga:', error);
            alert('Erro ao criar vaga. Tente novamente.');
        }
    }

    // Evento de clique no botão "Enviar Vaga"
    document.getElementById('submitVaga').addEventListener('click', submitVaga);

});
