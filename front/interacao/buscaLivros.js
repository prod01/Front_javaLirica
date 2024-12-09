let paginaAtual = 1; // Controla a página atual
const livrosPorPagina = 5; // Limite de livros por página

// Função para buscar livros por nome
async function buscaLivrosPorNome(nome) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Você precisa estar autenticado para acessar esta página.");
        return;
    }

    try {
        const response = await fetch(
            `http://3.141.87.82:8080/v1/livro/nome?nome=${encodeURIComponent(nome)}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const livros = await response.json();
            console.log("Lista de livros com o nome:", livros);

            // Aplica paginação na busca por nome
            const livrosPaginados = livros.slice(
                (paginaAtual - 1) * livrosPorPagina,
                paginaAtual * livrosPorPagina
            );

            exibirLivros(livrosPaginados);
        } else if (response.status === 500) {
            alert("Erro interno no servidor. Tente novamente mais tarde.");
        }
    } catch (error) {
        console.error("Erro ao buscar livros por nome:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}

// Função para buscar todos os livros
async function fetchAllBooks() {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            alert("Token de autenticação não encontrado. Faça login novamente.");
            return;
        }

        const response = await fetch("http://3.141.87.82:8080/v1/livro/todos", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const livros = await response.json();
            console.log("Lista de todos os livros:", livros);

            // Aplica paginação
            const livrosPaginados = livros.slice(
                (paginaAtual - 1) * livrosPorPagina,
                paginaAtual * livrosPorPagina
            );

            exibirLivros(livrosPaginados);
        } else if (response.status === 401) {
            alert("Não autorizado. Faça login novamente.");
            console.error("Erro 401: Não autorizado");
        } else if (response.status === 500) {
            alert("Erro interno no servidor. Tente novamente mais tarde.");
            console.error("Erro 500: Erro interno");
        } else {
            alert(`Erro ao buscar livros: ${response.statusText}`);
            console.error(`Erro: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao buscar todos os livros:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}

// Função para exibir os livros no DOM
function exibirLivros(livros) {
    const listaLivrosDiv = document.getElementById("lista-livros-tabela");
    const botaoProximo = document.getElementById("botao-proximo");
    listaLivrosDiv.innerHTML = ""; // Limpa conteúdo anterior

    if (livros.length === 0) {
        listaLivrosDiv.innerHTML = "<p>Nenhum livro encontrado.</p>";
        botaoProximo.style.display = "none"; // Oculta o botão se não houver livros
        return;
    }

    const tabela = document.createElement("table");
    tabela.classList.add("tabela-livros");

    // Cabeçalho da tabela
    tabela.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Autor</th>
                <th>Categoria</th>
                <th>Disponível</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabela.querySelector("tbody");

    // Preenchendo os dados
    livros.forEach((livro) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.nome}</td>
            <td>${livro.codigoLivro}</td>
            <td>${livro.autor}</td>
            <td>${livro.categoria}</td>
            <td>${livro.disponivel ? "Sim" : "Não"}</td>
        `;

        tbody.appendChild(tr);
    });

    listaLivrosDiv.appendChild(tabela);

    // Oculta o botão "Próximo" se houver menos de 5 livros
    if (livros.length < livrosPorPagina) {
        botaoProximo.style.display = "none";
    } else {
        botaoProximo.style.display = "inline-block"; // Mostra o botão se houver mais páginas
    }
}

// Função para avançar a página
// Função para avançar a página
function proximaPagina() {
    paginaAtual++;
    const nome = document.getElementById("nome").value.trim();

    if (nome) {
        buscaLivrosPorNome(nome);
    } else {
        fetchAllBooks();
    }

    // Mostra o botão de voltar
    document.getElementById("botao-voltar").style.display = "inline-block";
}

// Função para voltar à página anterior
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        const nome = document.getElementById("nome").value.trim();

        if (nome) {
            buscaLivrosPorNome(nome);
        } else {
            fetchAllBooks();
        }
    }

    // Oculta o botão de voltar se estiver na primeira página
    if (paginaAtual === 1) {
        document.getElementById("botao-voltar").style.display = "none";
    }
}


// Função para buscar livros por nome
function buscaLivro() {
    const nome = document.getElementById("nome").value.trim();

    if (nome === "") {
        alert("Digite um nome para pesquisar.");
        return;
    }

    paginaAtual = 1; // Reinicia a página atual ao fazer uma nova pesquisa
    buscaLivrosPorNome(nome);
}

// Chamando a função ao carregar a página
document.addEventListener("DOMContentLoaded", fetchAllBooks);

function chamaTelaCadastraLivro() {
    window.location.href = "cadastraLivro.html"; // Altere para o caminho correto da página
}
