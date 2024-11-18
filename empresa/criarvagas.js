import { auth, db, setDoc, doc } from './firebaseConfig.js';

// Espera o DOM ser carregado antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // Função para enviar os dados da vaga para o Firestore
    async function submitVaga() {
        // Captura os dados dos inputs
        const titulo = document.getElementById('vagaTitulo').value;
        const area = document.getElementById('vagaArea').value;  // Campo de Área
        const beneficios = document.getElementById('vagaBeneficios').value;  // Campo de Benefícios
        const dataPublicacao = new Date().toISOString();  // Data de publicação - usa a data atual
        const descricao = document.getElementById('vagaDescricao').value;  // Campo de Descrição
        const exigencias = document.getElementById('vagaExigencias').value;  // Campo de Exigências
        const formaTrabalho = document.getElementById('vagaFormaTrabalho').value;  // Campo de Forma de Trabalho
        const localizacao = document.getElementById('vagaLocalizacao').value;  // Campo de Localização
        const salario = document.getElementById('vagaSalario').value;  // Campo de Salário

        // Verificar se todos os campos estão preenchidos
        if (!titulo || !area || !beneficios || !descricao || !exigencias || !formaTrabalho || !localizacao || !salario) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Coletar os dados em um objeto
        const vagaData = {
            titulo: titulo,
            area: area,
            beneficios: beneficios,
            data_publicacao: dataPublicacao,  // Data de publicação
            descricao: descricao,
            exigencias: exigencias,
            forma_trabalho: formaTrabalho,
            localizacao: localizacao,
            salario: salario,
            createdAt: new Date()  // Adiciona a data de criação da vaga
        };

        try {
            // Criar um documento na coleção "Vagas" no Firestore
            const vagaRef = doc(db, 'Vagas', titulo + "-" + new Date().getTime());  // Usando o título e timestamp como ID único
            await setDoc(vagaRef, vagaData);

            alert('Vaga criada com sucesso!');
            
            // Limpar os campos de entrada manualmente
            document.getElementById('vagaTitulo').value = '';
            document.getElementById('vagaArea').value = '';
            document.getElementById('vagaBeneficios').value = '';
            document.getElementById('vagaDescricao').value = '';
            document.getElementById('vagaExigencias').value = '';
            document.getElementById('vagaFormaTrabalho').value = '';
            document.getElementById('vagaLocalizacao').value = '';
            document.getElementById('vagaSalario').value = '';

            // Opcional: Redirecionar para a página de Feed de Vagas ou outra página
            window.location.href = './FeedCurriculo.html';  // Redirecionamento após sucesso

        } catch (error) {
            console.error('Erro ao criar vaga:', error);
            alert('Erro ao criar vaga. Tente novamente.');
        }
    }

    // Evento de clique no botão "Enviar Vaga"
    document.getElementById('submitVaga').addEventListener('click', submitVaga);

});
