let paginaAtual = 1; // Controla a página atual
const gerenciadoresPorPagina = 5; // Limite de gerenciadores por página


async function buscaTodosUsuarios() {
    console.log("Iniciando fetchAllGerenciadores...");
    try {
        const token = localStorage.getItem("authToken");
        console.log("Token de autenticação:", token);

        if (!token) {
            alert("Token de autenticação não encontrado. Faça login novamente.");
            console.error("Token de autenticação não encontrado.");
            return;
        }

        const response = await fetch("http://3.141.87.82:8080/gerenciador/todos", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Status da resposta:", response.status);

        if (response.ok) {
            const gerenciadores = await response.json();
            console.log("Lista de todos os gerenciadores:", gerenciadores);
            console.log(gerenciadores);
            // Aplica paginação
            const gerenciadoresPaginados = gerenciadores.slice(
                (paginaAtual - 1) * gerenciadoresPorPagina,
                paginaAtual * gerenciadoresPorPagina
            );
            exibirGerenciadores(gerenciadoresPaginados);
            
        } else if (response.status === 401) {
            alert("Não autorizado. Faça login novamente.");
            console.error("Erro 401: Não autorizado. Status de resposta:", response.status);
        } else if (response.status === 500) {
            alert("Erro interno no servidor. Tente novamente mais tarde.");
            console.error("Erro 500: Erro interno no servidor. Status de resposta:", response.status);
        } else {
            alert(`Erro ao buscar gerenciadores: ${response.statusText}`);
            console.error(`Erro: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao buscar todos os gerenciadores:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}



// Função para exibir os gerenciadores no DOM
function exibirGerenciadores(gerenciadores) {
    console.log("Exibindo gerenciadores:", gerenciadores);
    const listaGerenciadoresDiv = document.getElementById("lista-gerenciadores-tabela");
    const botaoProximo = document.getElementById("botao-proximo");
    listaGerenciadoresDiv.innerHTML = ""; // Limpa conteúdo anterior

    if (gerenciadores.length === 0) {
        listaGerenciadoresDiv.innerHTML = "<p>Nenhum gerenciador encontrado.</p>";
        botaoProximo.style.display = "none"; // Oculta o botão se não houver gerenciadores
        return;
    }

    const tabela = document.createElement("table");
    tabela.classList.add("tabela-gerenciador");

    // Cabeçalho da tabela
    tabela.innerHTML = ` 
        <thead> 
            <tr> 
                
                <th>Nome</th>
                <th>Email</th> 
                <th>Descrição</th> 
            </tr> 
        </thead> 
        <tbody></tbody> 
        `; 
    const tbody = tabela.querySelector('tbody');

    // Preenchendo os dados
    gerenciadores.forEach((gerenciador) => {
        const tr = document.createElement("tr");

        tr.innerHTML = ` 
            
            <td>${gerenciador.nome}</td> 
             <td>${gerenciador.email}</td> 
            <td>${gerenciador.role}</td> 
            `; 
            
        tbody.appendChild(tr);
    });

    listaGerenciadoresDiv.appendChild(tabela);

    // Oculta o botão "Próximo" se houver menos de 5 gerenciadores
    if (gerenciadores.length < gerenciadoresPorPagina) {
        botaoProximo.style.display = "none";
    } else {
        botaoProximo.style.display = "inline-block"; // Mostra o botão se houver mais páginas
    }
}

// Função para avançar a página
function proximaPagina() {
    paginaAtual++;
    buscaTodosUsuarios();

    // Mostra o botão de voltar
    document.getElementById("botao-voltar").style.display = "inline-block";
}

// Função para voltar à página anterior
function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        buscaTodosUsuarios();
    }

    // Oculta o botão de voltar se estiver na primeira página
    if (paginaAtual === 1) {
        document.getElementById("botao-voltar").style.display = "none";
    }
}

