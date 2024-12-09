// Função para finalizar o empréstimo
async function finalizarEmprestimo(idEmprestimo) {
    console.log("Iniciando finalização do empréstimo...");

    const token = localStorage.getItem("authToken"); 

    if (!token) {
        alert("Você precisa estar autenticado para finalizar um empréstimo.");
        console.error("Token de autenticação não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://3.141.87.82:8080/emprestimo/finalizar/${idEmprestimo}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Status da resposta:", response.status);
        const responseBody = await response.text(); 

        console.log("Corpo da resposta:", responseBody);

        if (response.status === 204) {
            alert("Empréstimo finalizado com sucesso!");
            fetchAllLocacoes(); 
        } else if (response.status === 400) {
            const errorData = JSON.parse(responseBody);
            alert(`Erro ao finalizar empréstimo: ${errorData.message}`);
            console.error("Erro 400:", errorData);
        } else if (response.status === 404) {
            alert("Empréstimo não encontrado pelo ID informado.");
            console.error("Erro 404: Empréstimo não encontrado.");
        } else {
            alert(`Erro ao finalizar empréstimo. Status: ${response.status}`);
            console.error(`Erro ao finalizar empréstimo. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao finalizar empréstimo:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}

// Exemplo de chamada da função
function chamaFinalizarEmprestimo() {
    var idEmprestimo = document.getElementById("idLocacao").value.trim();
    console.log("ID do Empréstimo:", idEmprestimo);
    if (idEmprestimo) {
        finalizarEmprestimo(idEmprestimo);
    } else {
        alert("Favor preencher uma locação a ser finalizada.");
    }
}
