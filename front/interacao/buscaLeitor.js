let paginaAtualLeitores = 1;
const leitoresPorPagina = 5;

// Função para buscar todos os leitores
async function buscaTodosLeitores() {
    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Token não encontrado. Faça login.");
            return;
        }

        const response = await fetch("http://3.141.87.82:8080/leitor/todos", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.ok) {
            const leitores = await response.json();
            const leitoresPaginados = leitores.slice(
                (paginaAtualLeitores - 1) * leitoresPorPagina,
                paginaAtualLeitores * leitoresPorPagina
            );

            exibirLeitores(leitoresPaginados);

            document.getElementById("botao-voltar-leitores").style.display =
                paginaAtualLeitores > 1 ? "inline-block" : "none";

            document.getElementById("botao-proximo-leitores").style.display =
                leitoresPaginados.length < leitoresPorPagina ? "none" : "inline-block";
        } else {
            alert("Erro ao buscar leitores: " + response.statusText);
        }
    } catch (error) {
        console.error("Erro na busca dos leitores:", error);
    }
}

// Função para buscar um leitor específico por CPF
async function buscaLeitorCPF() {
    const cpfLeitor = document.getElementById("cpfLeitor").value.trim();

    if (!cpfLeitor) {
        alert("Por favor, insira o CPF do leitor.");
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Token não encontrado. Faça login.");
            return;
        }

        const response = await fetch(`http://3.141.87.82:8080/leitor/${cpfLeitor}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        if (response.ok) {
            const leitor = await response.json();
            exibirLeitores([leitor]); // Exibe o leitor encontrado na tabela
        } else {
            alert("Leitor não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao buscar leitor por CPF:", error);
    }
}

// Função para exibir os leitores em uma tabela
function exibirLeitores(leitores) {
    const listaLeitoresDiv = document.getElementById("lista-leitores-tabela");
    listaLeitoresDiv.innerHTML = "";

    if (leitores.length === 0) {
        listaLeitoresDiv.innerHTML = "<p>Nenhum leitor encontrado.</p>";
        return;
    }

    const tabela = document.createElement("table");
    tabela.classList.add("tabela-leitores");
    tabela.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = tabela.querySelector("tbody");
    leitores.forEach((leitor) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${leitor.id}</td>
            <td>${leitor.nome}</td>
            <td>${leitor.cpf}</td>
            <td>${leitor.email}</td>
            <td>${leitor.celular}</td>
            <td>${leitor.bloqueado ? "Inativo" : "Ativo"}</td>
        `;
        tbody.appendChild(tr);
    });

    listaLeitoresDiv.appendChild(tabela);
}

// Função para ir para a próxima página de leitores
function proximaPaginaLeitores() {
    paginaAtualLeitores++;
    buscaTodosLeitores();
}

// Função para voltar à página anterior de leitores
function paginaAnteriorLeitores() {
    if (paginaAtualLeitores > 1) {
        paginaAtualLeitores--;
        buscaTodosLeitores();
    }
}

