// Função principal de login
function login() {
  console.log("Função login chamada");

  // Obtendo os valores dos campos
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  console.log("Email:", email, "Password:", password);

  try {
      console.log("Chamando handleLoginFormSubmit");
      handleLoginFormSubmit(email, password);
  } catch (error) {
      console.error("Erro na função login:", error);
  }

  // Redirecionamento desabilitado para evitar limpar os logs durante o teste
  // chamaTelaHome();
}

// Função para processar o envio do login
function handleLoginFormSubmit(email, password) {
  console.log("handleLoginFormSubmit chamado com:", email, password);

  // Dados do login
  const loginData = { email, password };

  // Requisição POST para a API
  fetch('http://3.141.87.82:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
  })
      .then(response => {
          if (response.ok) {
              return response.json();
          } else {
              return response.json().then(errorData => {
                  throw new Error(errorData.message);
              });
          }
      })
      .then(data => {
          const token = data.token; // Assumindo que a resposta contém o token
          localStorage.setItem('authToken', token); // Armazenando o token

          alert('Login bem-sucedido!');
          console.log('Token JWT:', token);

          // Redireciona para home.html após login
          window.location.href = "home.html";
      })
      .catch(error => {
          console.error('Erro de requisição:', error);
          alert('Erro ao tentar fazer login: ' + error.message);
      });
}

// Função para acessar dados protegidos usando o token
function getProtectedData() {
    const token = localStorage.getItem('authToken'); // Recuperando o token

    if (!token) {
        console.log("Usuário não autenticado");
        return;
    }

    fetch('http://3.141.87.82:8080/protected/resource', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adicionando o token no cabeçalho
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Dados protegidos:', data);
    })
    .catch(error => {
        console.error('Erro ao acessar recurso protegido:', error);
    });
}

// Associar o evento de envio ao formulário
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o recarregamento da página
  login(); // Chama a função de login
});
