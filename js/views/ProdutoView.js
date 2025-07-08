import ProdutoService from '../services/ProdutoService.js';

const ProdutoView = {
  init({ onAdd, onEdit, onDelete, fetchAll }) {
    const root = document.getElementById('produtos-crud-view');
    root.innerHTML = `
      <h3>Produtos</h3>
      <input id="search-produto" type="text" placeholder="Pesquisar produto pelo nome..." style="width:100%;margin-bottom:12px;padding:8px 10px;font-size:1em;border-radius:6px;border:1px solid #ccc;">
      <button id="add-produto-btn" class="crud-btn">Adicionar Produto</button>
      <div id="produtos-list"></div>
      <div id="produto-form-modal" style="display:none;"></div>
    `;
    this.onAdd = onAdd;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.fetchAll = fetchAll;
    this._searchTerm = '';
    document.getElementById('search-produto').addEventListener('input', e => {
      this._searchTerm = e.target.value.toLowerCase();
      this.renderList();
    });
    this.renderList();
  },
  async renderList() {
    const list = document.getElementById('produtos-list');
    let produtos = await this.fetchAll();
    if (this._searchTerm) {
      produtos = produtos.filter(p => (p.nome||'').toLowerCase().includes(this._searchTerm));
    }
    list.innerHTML = '';
    // Adição inline
    const addExt = document.createElement('div');
    addExt.className = 'add-extension';
    addExt.style.display = 'none';
    list.appendChild(addExt);
    document.getElementById('add-produto-btn').onclick = () => this.toggleAddExtension(addExt);
    // Produtos
    produtos.forEach(prod => {
      const item = document.createElement('div');
      item.className = 'crud-item';
      item.innerHTML = `
        <b>${prod.nome}</b> - R$ ${parseFloat(prod.preco).toFixed(2)}
        <img src="${prod.imagem || 'img/hot-dog-classico-capa-730x480.jpeg'}" alt="${prod.nome}" style="max-width:60px;max-height:60px;vertical-align:middle;margin-left:10px;" onerror="this.src='img/hot-dog-classico-capa-730x480.jpeg'">
        <button class="edit-btn crud-btn">Editar</button>
        <button class="delete-btn crud-btn">Remover</button>
        <div class="edit-extension" style="display:none;"></div>
      `;
      item.querySelector('.edit-btn').onclick = () => this.toggleEditExtension(item, prod);
      item.querySelector('.delete-btn').onclick = () => this.deleteProduto(prod.id);
      list.appendChild(item);
    });
  },
  toggleEditExtension(item, prod) {
    // Fecha outros edit-extension e add-extension abertos
    document.querySelectorAll('.edit-extension').forEach(ext => { ext.style.display = 'none'; ext.innerHTML = ''; });
    document.querySelectorAll('.add-extension').forEach(ext => { ext.style.display = 'none'; ext.innerHTML = ''; });
    const ext = item.querySelector('.edit-extension');
    if (ext.style.display === 'block') {
      ext.style.display = 'none';
      ext.innerHTML = '';
      return;
    }
    ext.style.display = 'block';
    ext.innerHTML = `
      <form class="inline-edit-form">
        <input name="nome" placeholder="Nome" value="${prod.nome||''}" required />
        <input name="preco" placeholder="Preço" type="number" step="0.01" value="${prod.preco||''}" required />
        <input name="descricao" placeholder="Descrição" value="${prod.descricao||''}" required />
        <input name="imagem" placeholder="URL da Imagem" value="${prod.imagem||''}" required />
        <select name="secao" required>
          <option value="Lanches" ${prod.secao==='Lanches'?'selected':''}>Lanches</option>
          <option value="Bebidas" ${prod.secao==='Bebidas'?'selected':''}>Bebidas</option>
          <option value="Porções" ${prod.secao==='Porções'?'selected':''}>Porções</option>
        </select>
        <div class="form-alert" style="color:#c40000;font-size:1em;margin:8px 0 0 0;display:none;"></div>
        <button type="submit" class="crud-btn">Salvar</button>
      </form>
      <button type="button" class="crud-btn close-inline-edit" style="margin-top:8px;">Cancelar</button>
      <img src="${prod.imagem||''}" alt="Pré-visualização" style="max-width:120px;max-height:120px;margin-top:10px;${prod.imagem?'':'display:none;'}">
    `;
    ext.querySelector('.close-inline-edit').onclick = () => { ext.style.display = 'none'; ext.innerHTML = ''; };
    ext.querySelector('.inline-edit-form').onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      if (!data.nome || !data.preco || !data.descricao || !data.imagem || !data.secao) {
        const alert = ext.querySelector('.form-alert');
        alert.textContent = 'Preencha todos os campos obrigatórios!';
        alert.style.display = 'block';
        return;
      }
      data.id = prod.id;
      await this.onEdit(data);
      ext.style.display = 'none';
      ext.innerHTML = '';
      this.renderList();
    };
  },
  toggleAddExtension(addExt) {
    // Fecha outros add/edit abertos
    document.querySelectorAll('.edit-extension').forEach(ext => { ext.style.display = 'none'; ext.innerHTML = ''; });
    document.querySelectorAll('.add-extension').forEach(ext => { ext.style.display = 'none'; ext.innerHTML = ''; });
    if (addExt.style.display === 'block') {
      addExt.style.display = 'none';
      addExt.innerHTML = '';
      return;
    }
    addExt.style.display = 'block';
    addExt.innerHTML = `
      <form class="inline-add-form">
        <input name="nome" placeholder="Nome" required />
        <input name="preco" placeholder="Preço" type="number" step="0.01" required />
        <input name="descricao" placeholder="Descrição" required />
        <input name="imagem" placeholder="URL da Imagem" required />
        <select name="secao" required>
          <option value="Lanches">Lanches</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Porções">Porções</option>
        </select>
        <div class="form-alert" style="color:#c40000;font-size:1em;margin:8px 0 0 0;display:none;"></div>
        <button type="submit" class="crud-btn">Salvar</button>
      </form>
      <button type="button" class="crud-btn close-inline-add" style="margin-top:8px;">Cancelar</button>
    `;
    addExt.querySelector('.close-inline-add').onclick = () => { addExt.style.display = 'none'; addExt.innerHTML = ''; };
    addExt.querySelector('.inline-add-form').onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      if (!data.nome || !data.preco || !data.descricao || !data.imagem || !data.secao) {
        const alert = addExt.querySelector('.form-alert');
        alert.textContent = 'Preencha todos os campos obrigatórios!';
        alert.style.display = 'block';
        return;
      }
      await this.onAdd(data);
      addExt.style.display = 'none';
      addExt.innerHTML = '';
      this.renderList();
    };
  },
  showForm(mode, prod = {}) {
    const modal = document.getElementById('produto-form-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <form id="produto-form">
        <input name="nome" placeholder="Nome" value="${prod.nome||''}" required />
        <input name="preco" placeholder="Preço" type="number" step="0.01" value="${prod.preco||''}" required />
        <input name="descricao" placeholder="Descrição" value="${prod.descricao||''}" required />
        <input name="imagem" id="imagem-url" placeholder="URL da Imagem" value="${prod.imagem||''}" required />
        <div id="form-alert" style="color:#c40000;font-size:1em;margin:8px 0 0 0;display:none;"></div>
        <button type="submit">Salvar</button>
        <button type="button" onclick="document.getElementById('produto-form-modal').style.display='none'">Cancelar</button>
      </form>
      <img id="preview-img" src="${prod.imagem||''}" alt="Pré-visualização" style="max-width:120px;max-height:120px;margin-top:10px;${prod.imagem?'':'display:none;'}">
    `;
    // Preview ao digitar
    const imgInput = document.getElementById('imagem-url');
    const preview = document.getElementById('preview-img');
    imgInput.addEventListener('input', e => {
      if (e.target.value) {
        preview.src = e.target.value;
        preview.style.display = '';
      } else {
        preview.style.display = 'none';
      }
    });
    document.getElementById('produto-form').onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      // Validação obrigatória
      if (!data.nome || !data.preco || !data.descricao || !data.imagem) {
        const alert = document.getElementById('form-alert');
        alert.textContent = 'Preencha todos os campos obrigatórios!';
        alert.style.display = 'block';
        return;
      }
      if (mode === 'edit') {
        data.id = prod.id;
        // Se imagem não for preenchida, mantém a anterior (mas agora é obrigatório)
      }
      if (mode === 'edit') {
        await this.onEdit(data);
      } else {
        await this.onAdd(data);
      }
      modal.style.display = 'none';
      this.renderList();
    };
  },
  async deleteProduto(id) {
    await this.onDelete(id);
    this.renderList();
  }
};
export default ProdutoView;

window.ProdutoView = ProdutoView;

document.addEventListener('DOMContentLoaded', () => {
  ProdutoView.init({
    onAdd: ProdutoService.addProduto,
    onEdit: ProdutoService.editProduto,
    onDelete: ProdutoService.deleteProduto,
    fetchAll: ProdutoService.getProdutos
  });
});
