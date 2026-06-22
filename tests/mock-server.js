const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Mock de dados
const users = {
  'user@example.com': { 
    password: 'SecurePass@123',
    role: 'reader',
    id: '1',
    name: 'Test User'
  },
  'admin@example.com': { 
    password: 'AdminPass@123',
    role: 'admin',
    id: '2',
    name: 'Admin User'
  }
};

// Rastreamento de tentativas de login
const loginAttempts = {};
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

// HTML da página de login
const loginHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Biblioteca Virtual - Login</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
    .error { color: #d32f2f; margin: 10px 0; }
    .success { color: #388e3c; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Biblioteca Virtual</h1>
    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" name="email" required />
      <input type="password" id="password" placeholder="Senha" name="password" required />
      <button type="submit">Entrar</button>
    </form>
    <div id="message"></div>
    <p><a href="/signup">Criar conta</a></p>
  </div>
  <script>
    document.getElementById('loginForm').onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await resp.json();
      const msgEl = document.getElementById('message');
      
      if (resp.ok) {
        msgEl.className = 'success';
        msgEl.textContent = 'Login bem-sucedido!';
        localStorage.setItem('token', data.token);
        setTimeout(() => window.location.href = '/dashboard', 1000);
      } else {
        msgEl.className = 'error';
        msgEl.textContent = data.message || 'Erro no login';
      }
    };
  </script>
</body>
</html>
`;

// HTML da página de signup
const signupHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Biblioteca Virtual - Registrar</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 400px; margin: 100px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #333; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #0056b3; }
    .error { color: #d32f2f; margin: 10px 0; font-size: 12px; }
    .success { color: #388e3c; margin: 10px 0; }
    .requirement { font-size: 12px; margin: 5px 0; }
    .requirement.met { color: #388e3c; }
    .requirement.unmet { color: #d32f2f; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Criar Conta</h1>
    <form id="signupForm">
      <input type="email" id="email" placeholder="Email" name="email" required />
      <input type="password" id="password" placeholder="Senha" name="password" required />
      <div id="requirements">
        <div class="requirement unmet" id="req-length">✗ Mínimo 12 caracteres</div>
        <div class="requirement unmet" id="req-upper">✗ Letra maiúscula</div>
        <div class="requirement unmet" id="req-lower">✗ Letra minúscula</div>
        <div class="requirement unmet" id="req-number">✗ Número</div>
        <div class="requirement unmet" id="req-special">✗ Caractere especial (!@#$%^&*)</div>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <div id="message"></div>
    <p><a href="/login">Voltar para login</a></p>
  </div>
  <script>
    const passwordInput = document.getElementById('password');
    
    passwordInput.oninput = () => {
      const pwd = passwordInput.value;
      
      const checks = {
        'req-length': pwd.length >= 12,
        'req-upper': /[A-Z]/.test(pwd),
        'req-lower': /[a-z]/.test(pwd),
        'req-number': /\\d/.test(pwd),
        'req-special': /[!@#$%^&*]/.test(pwd)
      };
      
      Object.entries(checks).forEach(([id, met]) => {
        const el = document.getElementById(id);
        el.textContent = (met ? '✓' : '✗') + el.textContent.substring(1);
        el.className = 'requirement ' + (met ? 'met' : 'unmet');
      });
    };
    
    document.getElementById('signupForm').onsubmit = async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const resp = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await resp.json();
      const msgEl = document.getElementById('message');
      
      if (resp.ok) {
        msgEl.className = 'success';
        msgEl.textContent = 'Conta criada com sucesso!';
        setTimeout(() => window.location.href = '/login', 1000);
      } else {
        msgEl.className = 'error';
        msgEl.textContent = data.message || 'Erro no registro';
      }
    };
  </script>
</body>
</html>
`;

// HTML do dashboard
const dashboardHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Biblioteca Virtual - Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 1000px; margin: 20px auto; }
    .navbar { background: #007bff; color: white; padding: 10px 20px; }
    .content { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
    input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 5px 5px 5px 0; }
    .book-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px; }
    .book { border: 1px solid #ddd; padding: 15px; border-radius: 4px; background: #f9f9f9; }
    .error { color: #d32f2f; }
    .success { color: #388e3c; }
  </style>
</head>
<body>
  <div class="navbar">
    <h1>Biblioteca Virtual</h1>
    <button onclick="logout()">Sair</button>
  </div>
  <div class="container">
    <div class="content">
      <h2>Buscar Livros</h2>
      <input type="text" id="searchInput" placeholder="Buscar por título..." />
      <button onclick="search()">Buscar</button>
      <div id="searchResult"></div>
      
      <h2>Meus Empréstimos</h2>
      <div id="loans"></div>
    </div>
  </div>
  
  <script>
    const token = localStorage.getItem('token');
    if (!token) window.location.href = '/login';
    
    function search() {
      const query = document.getElementById('searchInput').value;
      const result = document.getElementById('searchResult');
      result.textContent = 'Buscando por: ' + query;
    }
    
    function logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  </script>
</body>
</html>
`;

// Rota para servir o HTML de login
app.get('/login', (req, res) => {
  res.send(loginHTML);
});

// Rota para servir o HTML de signup
app.get('/signup', (req, res) => {
  res.send(signupHTML);
});

// Rota para servir o HTML do dashboard
app.get('/dashboard', (req, res) => {
  res.send(dashboardHTML);
});

// API de login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Verifica lockout
  const now = Date.now();
  if (loginAttempts[email]) {
    if (loginAttempts[email].locked && now < loginAttempts[email].lockedUntil) {
      return res.status(429).json({ message: 'Conta bloqueada. Tente novamente mais tarde.' });
    }
  }
  
  // Verifica credenciais
  const user = users[email];
  if (!user || user.password !== password) {
    // Incrementa tentativas falhadas
    if (!loginAttempts[email]) {
      loginAttempts[email] = { count: 0, locked: false, lockedUntil: 0 };
    }
    loginAttempts[email].count++;
    
    // Bloqueia após N tentativas
    if (loginAttempts[email].count >= LOCKOUT_THRESHOLD) {
      loginAttempts[email].locked = true;
      loginAttempts[email].lockedUntil = now + LOCKOUT_TIME;
    }
    
    return res.status(401).json({ message: `Credenciais inválidas. (Tentativa ${loginAttempts[email].count}/${LOCKOUT_THRESHOLD})` });
  }
  
  // Reset tentativas em caso de sucesso
  loginAttempts[email] = { count: 0, locked: false, lockedUntil: 0 };
  
  // Retorna token
  res.json({ 
    token: 'mock_token_' + email,
    user: { id: user.id, name: user.name, email, role: user.role }
  });
});

// API de signup
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  
  // Validação de senha fraca
  const isWeak = password.length < 12 || 
    !/[A-Z]/.test(password) || 
    !/[a-z]/.test(password) || 
    !/\d/.test(password) || 
    !/[!@#$%^&*]/.test(password);
  
  if (isWeak) {
    return res.status(400).json({ 
      message: 'Senha fraca. Deve ter 12+ caracteres, maiúsculas, minúsculas, números e caracteres especiais.' 
    });
  }
  
  // Verifica se email já existe
  if (users[email]) {
    return res.status(409).json({ message: 'Email já cadastrado.' });
  }
  
  // Registra novo usuário
  users[email] = {
    password,
    role: 'reader',
    id: Object.keys(users).length + 1,
    name: email.split('@')[0]
  };
  
  res.status(201).json({ 
    message: 'Conta criada com sucesso!',
    token: 'mock_token_' + email
  });
});

// API de rota bloqueada (admin)
app.get('/api/admin', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  
  // Mock: se token é de admin, permite
  if (token === 'mock_token_admin@example.com') {
    return res.json({ message: 'Acesso ao painel admin' });
  }
  
  res.status(403).json({ message: 'Acesso negado' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Biblioteca Virtual</h1>
      <p><a href="/login">Login</a> | <a href="/signup">Registrar</a></p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
});
