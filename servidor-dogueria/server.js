const express = require('express'); // Importa a ferramenta Express para criar o servidor
const bodyParser = require('body-parser'); // Ajuda a ler dados enviados pelo navegador
const fs = require('fs'); // Ferramenta para ler e escrever arquivos (como CSV)
const csv = require('fast-csv'); // Ferramenta para trabalhar com CSVs
const cors = require('cors'); // Adiciona o pacote CORS para permitir requisições do frontend

const app = express(); // Cria uma instância do servidor Express
const PORT = 3000; // Define a porta onde o servidor vai rodar (você acessará por http://localhost:3000)

// Configura o Express para entender JSON (dados que o navegador envia)
app.use(bodyParser.json());
app.use(cors()); // Habilita CORS para todas as rotas

// --- Funções para ler e escrever CSV ---

// Função para ler dados de um arquivo CSV
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const data = []; // Array para guardar os dados lidos
        fs.createReadStream(filePath) // Abre o arquivo para leitura
            .pipe(csv.parse({ headers: true })) // Lê o CSV e usa a primeira linha como cabeçalho
            .on('data', (row) => data.push(row)) // Para cada linha lida, adiciona ao array 'data'
            .on('end', () => resolve(data)) // Quando termina de ler, resolve a Promise com os dados
            .on('error', (error) => reject(error)); // Se der erro, rejeita a Promise
    });
};

// Função para escrever dados em um arquivo CSV
const writeCSV = (filePath, data) => {
    const ws = fs.createWriteStream(filePath); // Abre o arquivo para escrita
    csv.write(data, { headers: true }).pipe(ws); // Escreve os dados no formato CSV
};

// --- Rotas (os "endereços" que seu site vai acessar no servidor) ---

// Rota de Login (quando o usuário tenta entrar)
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Pega o usuário e senha enviados pelo navegador
    const users = await readCSV('usuarios.csv'); // Lê todos os usuários do CSV

    // Procura se existe um usuário com o nome e senha fornecidos
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Se encontrou o usuário, retorna sucesso e os dados do usuário (sem a senha, por segurança)
        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
        // Se não encontrou, retorna falha
        res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
    }
});

// Rota de Cadastro (quando um novo usuário se registra)
app.post('/register', async (req, res) => {
    const { username, password } = req.body; // Pega o usuário e senha enviados
    let users = await readCSV('usuarios.csv'); // Lê todos os usuários

    // Verifica se o nome de usuário já existe
    const userExists = users.some(u => u.username === username);

    if (userExists) {
        res.status(409).json({ success: false, message: 'Nome de usuário já existe.' });
    } else {
        // Cria um novo ID para o usuário
        const newId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
        const newUser = { id: newId.toString(), username, password, role: 'cliente' }; // Novo usuário é sempre cliente
        users.push(newUser); // Adiciona o novo usuário à lista
        await writeCSV('usuarios.csv', users); // Salva a lista atualizada no CSV

        res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso!' });
    }
});

// --- Rotas CRUD para Produtos (Gerente) ---

// Obter todos os produtos
app.get('/produtos', async (req, res) => {
    const produtos = await readCSV('produtos.csv');
    res.json(produtos);
});

// Adicionar um novo produto
app.post('/produtos', async (req, res) => {
    const newProductData = req.body;
    let produtos = await readCSV('produtos.csv');
    const newId = produtos.length > 0 ? Math.max(...produtos.map(p => parseInt(p.id))) + 1 : 1;
    // Garante que o campo secao exista
    const newProduct = { id: newId.toString(), ...newProductData, secao: newProductData.secao || '' };
    produtos.push(newProduct);
    await writeCSV('produtos.csv', produtos);
    res.status(201).json(newProduct);
});

// Atualizar um produto existente
app.put('/produtos/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    let produtos = await readCSV('produtos.csv');
    const index = produtos.findIndex(p => p.id === productId);

    if (index !== -1) {
        // Garante que o campo secao exista
        produtos[index] = { ...produtos[index], ...updatedProductData, id: productId, secao: updatedProductData.secao || produtos[index].secao || '' };
        await writeCSV('produtos.csv', produtos);
        res.json(produtos[index]);
    } else {
        res.status(404).json({ message: 'Produto não encontrado.' });
    }
});

// Deletar um produto
app.delete('/produtos/:id', async (req, res) => {
    const productId = req.params.id;
    let produtos = await readCSV('produtos.csv');
    const initialLength = produtos.length;
    produtos = produtos.filter(p => p.id !== productId);

    if (produtos.length < initialLength) {
        await writeCSV('produtos.csv', produtos);
        res.status(204).send(); // 204 No Content (sucesso sem retorno)
    } else {
        res.status(404).json({ message: 'Produto não encontrado.' });
    }
});

// --- Rotas CRUD para Usuários (Gerente) ---

// Obter todos os usuários
app.get('/usuarios', async (req, res) => {
    const usuarios = await readCSV('usuarios.csv');
    // Não retornar a senha para o frontend por segurança
    const safeUsers = usuarios.map(u => ({ id: u.id, username: u.username, role: u.role }));
    res.json(safeUsers);
});

// Adicionar um novo usuário (apenas para gerente adicionar outros usuários)
app.post('/usuarios', async (req, res) => {
    const newUserData = req.body;
    let users = await readCSV('usuarios.csv');
    const newId = users.length > 0 ? Math.max(...users.map(u => parseInt(u.id))) + 1 : 1;
    const newUser = { id: newId.toString(), ...newUserData };
    users.push(newUser);
    await writeCSV('usuarios.csv', users);
    res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
});

// Atualizar um usuário existente
app.put('/usuarios/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;
    let users = await readCSV('usuarios.csv');
    const index = users.findIndex(u => u.id === userId);

    if (index !== -1) {
        users[index] = { ...users[index], ...updatedUserData, id: userId };
        await writeCSV('usuarios.csv', users);
        res.json({ id: users[index].id, username: users[index].username, role: users[index].role });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

// Deletar um usuário
app.delete('/usuarios/:id', async (req, res) => {
    const userId = req.params.id;
    let users = await readCSV('usuarios.csv');
    const initialLength = users.length;
    users = users.filter(u => u.id !== userId);

    if (users.length < initialLength) {
        await writeCSV('usuarios.csv', users);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
    }
});

// --- Nova rota para receber pedidos ---
app.post('/pedidos', async (req, res) => {
    const { itens } = req.body;
    if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ success: false, message: 'Carrinho vazio.' });
    }
    // Aqui você pode salvar o pedido em um arquivo, banco de dados, etc.
    // Exemplo: salvar em pedidos.csv (implemente se desejar)
    // Por enquanto, só retorna sucesso
    res.json({ success: true, message: 'Pedido recebido com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Para testar:`);
    console.log(`  - Login: POST http://localhost:${PORT}/login`);
    console.log(`  - Cadastro: POST http://localhost:${PORT}/register`);
    console.log(`  - Produtos: GET http://localhost:${PORT}/produtos`);
    console.log(`  - Usuários: GET http://localhost:${PORT}/usuarios`);
});