
async function deletaLivroCode(codigo) {
    const token = localStorage.getItem('authToken');  // Recupera o token do localStorage

    if (!token) {
        alert('Você precisa estar autenticado para acessar esta funcionalidade.');
        return;
    }

    try {
        const response = await fetch(`http://3.141.87.82:8080/v1/livro/delete/${codigo}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho de autorização
            }
        });

        if (response.status === 204) {
            alert('Livro deletado com sucesso!');
        } else if (response.status === 404) {
            alert(`Livro não encontrado pelo código: ${codigo}`);
        }
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}

// Função para adicionar um novo livro com autenticação
async function cadastraLivro() {
    var nome = document.getElementById("nomeLivro").value;
    var codigoLivro = document.getElementById("codLivro").value;
    var autor = document.getElementById("autorLivro").value;
    var categoria = document.getElementById("categoriaLivro").value;

    const token = localStorage.getItem('authToken');  // Recupera o token do localStorage

    if (!token) {
        alert('Você precisa estar autenticado para adicionar um livro.');
        return;
    }

    const bookData = {
        nome,
        codigoLivro,
        autor,
        categoria
    };

    try {
        const response = await fetch('http://3.141.87.82:8080/v1/livro/novo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho de autorização
            },
            body: JSON.stringify(bookData)
        });

        if (response.status === 201) {
            const createdBook = await response.json();
            console.log('Livro adicionado com sucesso:', createdBook);
            alert('Livro adicionado com sucesso!');

            window.location.href = "buscaLivros.html"; 
        } else if (response.status === 400) {
            alert('Erro ao salvar livro. Verifique os dados e tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        alert('Erro de conexão. Tente novamente.');
    }
}
