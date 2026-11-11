const API_URL = 'http://localhost:3000';

// Elementos da Interface
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const loginErro = document.getElementById('login-erro');

const compForm = document.getElementById('componente-form');
const compId = document.getElementById('comp-id');
const compNome = document.getElementById('comp-nome');
const compCategoria = document.getElementById('comp-categoria');
const compPreco = document.getElementById('comp-preco');
const compQtd = document.getElementById('comp-qtd');
const compDesc = document.getElementById('comp-desc');
const btnCancelar = document.getElementById('btn-cancelar');
const btnLogout = document.getElementById('btn-logout');

// 1. AUTENTICAÇÃO (LOGIN)
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginErro.textContent = '';

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      exibirApp();
    } else {
      loginErro.textContent = data.message || 'Erro ao fazer login';
    }
  } catch (err) {
    loginErro.textContent = 'Erro ao conectar com a API Backend.';
  }
});

// LOGOUT
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('token');
  loginContainer.classList.remove('hidden');
  appContainer.classList.add('hidden');
});

function exibirApp() {
  loginContainer.classList.add('hidden');
  appContainer.classList.remove('hidden');
  carregarComponentes();
}

// 2. CARREGAR E LISTAR COMPONENTES + RELATÓRIO
async function carregarComponentes() {
  try {
    const res = await fetch(`${API_URL}/relatorios/estoque`);
    const data = await res.json();

    const tbody = document.getElementById('tabela-componentes');
    document.getElementById('valor-total-estoque').textContent = data.valor_total_estoque;
    tbody.innerHTML = '';

    data.componentes.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.id_componente}</td>
        <td><strong>${c.nome}</strong></td>
        <td>${c.descricao || '-'}</td>
        <td>R$ ${parseFloat(c.preco).toFixed(2)}</td>
        <td>${c.quantidade_estoque}</td>
        <td>
          <button onclick="prepararEdicao(${c.id_componente}, '${c.nome}', '${c.descricao || ''}', ${c.preco}, ${c.quantidade_estoque}, ${c.id_categoria})">Editar</button>
          <button class="btn-danger" onclick="deletarComponente(${c.id_componente})">Apagar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Erro ao carregar lista de estoque:', err);
  }
}

// 3. CADASTRAR / EDITAR COMPONENTE
compForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = compId.value;
  const payload = {
    nome: compNome.value,
    id_categoria: parseInt(compCategoria.value),
    preco: parseFloat(compPreco.value),
    quantidade_estoque: parseInt(compQtd.value),
    descricao: compDesc.value
  };

  const url = id ? `${API_URL}/componentes/${id}` : `${API_URL}/componentes`;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  resetarFormulario();
  carregarComponentes();
});

// PREPARAR EDIÇÃO
window.prepararEdicao = (id, nome, desc, preco, qtd, cat) => {
  compId.value = id;
  compNome.value = nome;
  compDesc.value = desc;
  compPreco.value = preco;
  compQtd.value = qtd;
  compCategoria.value = cat || 1;

  btnCancelar.classList.remove('hidden');
  document.getElementById('btn-salvar').textContent = 'Atualizar Componente';
};

btnCancelar.addEventListener('click', resetarFormulario);

function resetarFormulario() {
  compId.value = '';
  compForm.reset();
  btnCancelar.classList.add('hidden');
  document.getElementById('btn-salvar').textContent = 'Salvar Componente';
}

// 4. DELETAR COMPONENTE
window.deletarComponente = async (id) => {
  if (confirm('Tem certeza que deseja remover este componente?')) {
    await fetch(`${API_URL}/componentes/${id}`, { method: 'DELETE' });
    carregarComponentes();
  }
};

// Verificar sessão ao abrir
if (localStorage.getItem('token')) {
  exibirApp();
}