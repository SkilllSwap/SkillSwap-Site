import { auth, db, setDoc, doc } from './firebaseConfig.js';

document.addEventListener('DOMContentLoaded', () => {

    // enviar os dados da vaga
    async function submitVaga() {
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

        // Coletar os dados
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
            createdAt: new Date()  
        };

        try {
            // Cria um novo documento na coleção com um ID único 
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

    document.getElementById('submitVaga').addEventListener('click', submitVaga);

});
