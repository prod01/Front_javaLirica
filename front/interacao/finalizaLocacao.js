// Função para finalizar um empréstimo com autenticação
async function finalizeLoan(loanId) {
    const token = localStorage.getItem('authToken');  // Recupera o token do localStorage

    if (!token) {
        alert('Você precisa estar autenticado para finalizar um empréstimo.');
        return;
    }

    try {
        const response = await fetch(`http://3.141.87.82:8080/emprestimo/${loanId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Passa o token no cabeçalho de autorização
            }
        });

        if (response.status === 204) {
            alert('Empréstimo finalizado com sucesso!');
            console.log('Empréstimo finalizado:', loanId);
        } else if (response.status === 404) {
            alert('Empréstimo não encontrado pelo ID informado.');
        } else if (response.status === 400) {
            alert('Erro interno ao tentar finalizar o empréstimo.');
        }
    } catch (error) {
        console.error('Erro ao finalizar empréstimo:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}

// // Exemplo de chamada à função
// // Finalizar um empréstimo com ID 1
// finalizeLoan(1);
