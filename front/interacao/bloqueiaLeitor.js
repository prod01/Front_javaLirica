async function bloquearLeitor(cpf) {
    console.log("Iniciando bloqueio do leitor...");
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("Você precisa estar autenticado para bloquear um leitor.");
        console.error("Token de autenticação não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://3.141.87.82:8080/leitor/bloquear/${cpf}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Status da resposta:", response.status);

        if (response.status === 204) {
            alert("Leitor bloqueado com sucesso!");
            console.log(`Leitor com CPF ${cpf} foi bloqueado.`);
        } else if (response.status === 404) {
            alert("Leitor não encontrado com o CPF informado.");
            console.error("Erro 404: Leitor não encontrado.");
        } else {
            alert(`Erro ao bloquear leitor: ${response.statusText}`);
            console.error(`Erro: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Erro ao bloquear leitor:", error);
        alert("Erro de conexão. Tente novamente.");
    }
}

// Função que será chamada quando o botão "Bloquear" for pressionado
function chamaBloquearLeitor() {
    var cpf = document.getElementById("cpfLeitorbloque").value;
    if (cpf !== "") {
        bloquearLeitor(cpf);
    } else {
        alert("Favor informar o CPF do leitor a ser bloqueado.");
    }
}
