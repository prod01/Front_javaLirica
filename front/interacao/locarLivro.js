function Locacao(){

 
    const codLivro = document.getElementById("codLivro").value;
    console.log(codLivro);
    const CPF = document.getElementById("cpfLeitor").value;
    console.log(CPF);
    fazerLocacao(CPF,codLivro)


}
async function fazerLocacao(cpf, bookCode) {
    console.log("Tese");
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert('Você precisa estar autenticado para realizar um empréstimo.');
        return;
    }

    const loanData = {
        cpf: cpf,
        codigoLivro: bookCode
    };

    try {
        const response = await fetch('http://3.141.87.82:8080/emprestimo/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(loanData)
        });

        if (response.status === 201) {
            const data = await response.json();
            alert('Empréstimo realizado com sucesso!');
            console.log('Detalhes do empréstimo:', data);
        } else if (response.status === 400) {
            alert('Livro indisponível para empréstimo.');
        } else if (response.status === 404) {
            alert('Livro não encontrado pelo código informado.');
        }
    } catch (error) {
        console.error('Erro ao realizar empréstimo:', error);
        alert('Erro de conexão. Tente novamente mais tarde.');
    }
}