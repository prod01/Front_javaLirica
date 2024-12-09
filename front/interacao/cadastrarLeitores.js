function cadastro() {
    var nome = document.getElementById("nome").value;
    var cpf = document.getElementById("cpf").value;
    var email = document.getElementById("email").value;
    var celular = document.getElementById("celular").value;

    console.log("Dados do Leitor:", { nome, cpf, email, celular });

    adicionarNovoLeitor(nome, cpf, email, celular);
}

async function adicionarNovoLeitor(nome, cpf, email, celular) {
    const readerData = {
        nome,
        cpf,
        email,
        celular
    };

    console.log("Enviando dados para API:", readerData);

    // Recuperando o token do localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        console.error('Token não encontrado.');
        return;
    }

    try {
        const response = await fetch('http://3.141.87.82:8080/leitor/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adicionando o token no cabeçalho
            },
            body: JSON.stringify(readerData)
        });

        console.log("Status da resposta:", response.status);

        if (response.status === 201) {
            alert('Leitor adicionado com sucesso!');
            const createdReader = await response.json();
            console.log('Leitor criado:', createdReader);
            window.location.href = "home.html";
        } else if (response.status === 400) {
            const errorData = await response.json();
            alert(`Erro ao salvar leitor: ${errorData.message}`);
            console.error('Erro ao salvar leitor:', errorData);
        } else if (response.status === 409) {
            alert('Já existe um usuário com este email.');
        }
    } catch (error) {
        console.error('Erro ao adicionar leitor:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}
