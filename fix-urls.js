const fs = require('fs');

// Lê auth-security
let content = fs.readFileSync('tests/e2e/auth-security.spec.ts', 'utf8');
content = content.replace(/await page\.goto\('\/([^']+)'\)/g, "await page.goto('http://localhost:3000/$1')");
fs.writeFileSync('tests/e2e/auth-security.spec.ts', content);

// Lê biblioteca
content = fs.readFileSync('tests/e2e/biblioteca.spec.ts', 'utf8');
content = content.replace(/await page\.goto\('\/([^']+)'\)/g, "await page.goto('http://localhost:3000/$1')");
fs.writeFileSync('tests/e2e/biblioteca.spec.ts', content);

console.log('URLs atualizadas com sucesso!');
