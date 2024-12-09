// Função para criar um novo gerenciador com autenticação
async function createManager(nome, role, email, senha) {
    const token = localStorage.getItem('authToken');  // Recupera o token do localStorage

    if (!token) {
        alert('Você precisa estar autenticado para criar um gerenciador.');
        return;
    }

    const managerData = {
        nome,
        role,
        email,
        senha
    };

    try {
        const response = await fetch('http://3.141.87.82:8080/gerenciador/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho de autorização
            },
            body: JSON.stringify(managerData)
        });

        if (response.status === 201) {
            alert('Gerenciador criado com sucesso!');
            const createdManager = await response.json();
            console.log('Gerenciador criado:', createdManager);
        } else if (response.status === 400) {
            alert('Erro ao tentar criar o gerenciador. Verifique os dados e tente novamente.');
        } else if (response.status === 409) {
            alert('O email informado já está cadastrado.');
        }
    } catch (error) {
        console.error('Erro ao criar o gerenciador:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}

// Função para buscar todos os gerenciadores com autenticação
async function fetchAllManagers() {
    const token = localStorage.getItem('authToken');  // Recupera o token do localStorage

    if (!token) {
        alert('Você precisa estar autenticado para buscar os gerenciadores.');
        return;
    }

    try {
        const response = await fetch('http://3.141.87.82:8080/gerenciador/todos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho de autorização
            }
        });

        if (response.status === 200) {
            const managers = await response.json();
            console.log('Lista de gerenciadores:', managers);
            alert('Gerenciadores carregados com sucesso. Verifique o console para detalhes.');
        } else if (response.status === 500) {
            alert('Erro interno do servidor ao buscar os gerenciadores.');
        }
    } catch (error) {
        console.error('Erro ao buscar gerenciadores:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}

// // Exemplo de chamadas às funções
// // Criar um novo gerenciador
// createManager('Guilherme Silva', 'SUBADMIN', 'guilherme1@gmail.com', 'senha123');

// // Buscar todos os gerenciadores
// fetchAllManagers();
