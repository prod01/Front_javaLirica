let paginaAtual = 1; // Controla a página atual
const emprestimosPorPagina = 5; // Limite de empréstimos por página

// Função para buscar todos os empréstimos ativos com autenticação
async function fetchAllLocacoes() {
    console.log("Iniciando fetchAllLocacoes...");
    try {
        const token = localStorage.getItem("authToken");
        console.log("Token de autenticação:", token);

        if (!token) {
            alert("Token de autenticação não encontrado. Faça login novamente.");
            console.error("Token de autenticação não encontrado.");
            return;
        }

        const response = await fetch("http://3.141.87.82:8080/emprestimo/todos", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
            const emprestimos = await response.json();
            console.log("Lista de todos os empréstimos:", emprestimos);

            // Aplica paginação
            const emprestimosPaginados = emprestimos.slice(
                (paginaAtual - 1) * emprestimosPorPagina,
                paginaAtual * emprestimosPorPagina
            );

            exibirEmprestimos(emprestimosPaginados);
        } else if (response.status === 401) {
            alert("Não autorizado. Faça login novamente.");
            console.error("Erro 401: Não autorizado. Status de resposta:", response.status);
        } else if (response.status === 500) {
            alert("Erro interno no servidor. Tente novamente mais tarde.");
            console.error("Erro 500: Erro interno no servidor. Status de resposta:", response.status);
        } else {
            alert(`Erro ao buscar empréstimos: ${response.statusText}`);
            console.error(`Erro: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao buscar todos os empréstimos:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}

// Função para exibir os empréstimos no DOM
function exibirEmprestimos(emprestimos) {
    console.log("Exibindo empréstimos:", emprestimos);
    const listaEmprestimosDiv = document.getElementById("lista-locacoes-tabela");
    const botaoProximo = document.getElementById("botao-proximo");
    listaEmprestimosDiv.innerHTML = ""; // Limpa conteúdo anterior

    if (emprestimos.length === 0) {
        listaEmprestimosDiv.innerHTML = "<p>Nenhuma locação encontrada.</p>";
        botaoProximo.style.display = "none"; // Oculta o botão se não houver empréstimos
        return;
    }

    const tabela = document.createElement("table");
    tabela.classList.add("tabela-emprestimo");

    // Cabeçalho da tabela
    tabela.innerHTML = ` 
        <thead> 
            <tr> 
                <th>ID Empréstimo</th> 
                <th>Nome do Livro</th> 
                <th>Código do Livro</th> 
                <th>Nome do Leitor</th> 
                <th>CPF</th> 
                <th>Data Limite de Entrega</th> 
            </tr> 
        </thead> 
        <tbody></tbody> 
        `; 
    const tbody = tabela.querySelector('tbody');

    // Preenchendo os dados
    emprestimos.forEach((emprestimo) => {
        const tr = document.createElement("tr");

        tr.innerHTML = ` 
            <td>${emprestimo.id}</td> 
            <td>${emprestimo.livro.nome}</td> 
            <td>${emprestimo.livro.codigoLivro}</td> 
            <td>${emprestimo.leitor.nome}</td> 
            <td>${emprestimo.leitor.cpf}</td> 
            <td>${emprestimo.dataLimiteEntrega.join('-')}</td> 
            `; 
            
            tbody.appendChild(tr);
    });

    listaEmprestimosDiv.appendChild(tabela);

    // Oculta o botão "Próximo" se houver menos de 5 empréstimos
    if (emprestimos.length < emprestimosPorPagina) {
        botaoProximo.style.display = "none";
    } else {
        botaoProximo.style.display = "inline-block"; // Mostra o botão se houver mais páginas
    }
}

// Função para avançar a página
function proximaPagina() {
    paginaAtual++;
    fetchAllLocacoes();

    // Mostra o botão de voltar
    document.getElementById("botao-voltar").style.display = "inline-block";
}

// Função para voltar à página anterior
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        fetchAllLocacoes();
    }

    // Oculta o botão de voltar se estiver na primeira página
    if (paginaAtual === 1) {
        document.getElementById("botao-voltar").style.display = "none";
    }
}

// Chamando a função ao carregar a página
document.addEventListener("DOMContentLoaded", fetchAllLocacoes);


async function buscaLocacaoPorCPF() {
    console.log("Iniciando busca de locações por CPF...");

   
    const token = localStorage.getItem("authToken"); // Recupera o token do localStorage

    if (!token) {
        alert("Você precisa estar autenticado para acessar esta funcionalidade.");
        return;
    }

    try {
        const cpf = document.getElementById("cpfLeitor").value; // Recupera o CPF inserido pelo usuário
        if (!cpf) {
            alert("Por favor, insira o CPF do leitor.");
            return;
        }

        const response = await fetch(`http://3.141.87.82:8080/emprestimo/${cpf}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Passa o token no cabeçalho de autorização
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const locacoes = await response.json();
            console.log("Locações encontradas:", locacoes);
            exibirEmprestimos(locacoes); // Função para exibir as locações no DOM
        } else if (response.status === 404) {
            alert("Nenhuma locação encontrada para este CPF.");
        } else {
            alert(`Erro ao buscar locações: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao buscar locações por CPF:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}