function cadastraUsario() {
    console.log('Erro ao criar o gerenciador:');
    var nomeUsuario = document.getElementById("nome").value;
    var emailUsuario = document.getElementById("email").value;
    var senhaUsuario = document.getElementById("senha").value;
    var tipoUsuario = document.getElementById("tipoUsuario").value;

   
    console.log('Erro ao criar o gerenciador:');
        if (nomeUsuario == '') {
            return("O campo 'Nome' é obrigatório. Por favor, preencha-o.");
           
        }
    
        if (emailUsuario == '') {
            return("O campo 'E-mail' é obrigatório. Por favor, preencha-o.");
           
        }
    
        if (senhaUsuario == '') {
            return("O campo 'Senha' é obrigatório. Por favor, preencha-o.");
           
        }
    
   
    // Fazer a chamada da API para cadastro, passando os dados do novo usuário
    createManager(nomeUsuario, tipoUsuario, emailUsuario, senhaUsuario);
}



async function createManager(nome, role, email, senha) {
    console.log('Erro ao criar o gerenciador:');
    // Recuperando o token do localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('Usuário não autenticado. Faça login novamente.');
        return;
    }

    const managerData = {
        nome,
        role,
        email,
        senha
    };

    try {
        console.log('Erro ao criar o gerenciador:');
        const response = await fetch('http://3.141.87.82:8080/gerenciador/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adicionando o token no cabeçalho
            },
            body: JSON.stringify(managerData)
        });
        console.log('Erro ao criar o gerenciador:');
        if (response.status === 201) {
            alert('Gerenciador criado com sucesso!');
            const createdManager = await response.json();
            console.log('Gerenciador criado:', createdManager);
        } else if (response.status === 400) {
            alert('Erro ao tentar criar o gerenciador. Verifique os dados e tente novamente.');
        } else if (response.status === 409) {
            alert('O email informado já está cadastrado.');
        }else {
            console.log( response.status);
           
            
        }
    } catch (error) {
        console.error('Erro ao criar o gerenciador:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}
