import UsuarioService from '../services/UsuarioService.js';

const UsuarioView = {
  init({ onAdd, onEdit, onDelete, fetchAll }) {
    const root = document.getElementById('usuarios-crud-view');
    root.innerHTML = `
      <h3>Usuários</h3>
      <input id="search-usuario" type="text" placeholder="Pesquisar usuário pelo nome..." style="width:100%;margin-bottom:12px;padding:8px 10px;font-size:1em;border-radius:6px;border:1px solid #ccc;">
      <button id="add-usuario-btn" class="crud-btn">Adicionar Usuário</button>
      <div id="usuarios-list"></div>
      <div id="usuario-form-modal" style="display:none;"></div>
    `;
    this.onAdd = onAdd;
    this.onEdit = onEdit;
    this.onDelete = onDelete;
    this.fetchAll = fetchAll;
    this._searchTerm = '';
    document.getElementById('search-usuario').addEventListener('input', e => {
      this._searchTerm = e.target.value.toLowerCase();
      this.renderList();
    });
    this.renderList();
  },
  async renderList() {
    const list = document.getElementById('usuarios-list');
    let usuarios = await this.fetchAll();
    if (this._searchTerm) {
      usuarios = usuarios.filter(u => (u.username||'').toLowerCase().includes(this._searchTerm));
    }
    list.innerHTML = '';
    // Adição inline
    const addExt = document.createElement('div');
    addExt.className = 'add-extension';
    addExt.style.display = 'none';
    list.appendChild(addExt);
    document.getElementById('add-usuario-btn').onclick = () => this.toggleAddExtension(addExt);
    // Usuários
    usuarios.forEach(user => {
      const item = document.createElement('div');
      item.className = 'crud-item';
      item.innerHTML = `
        <b>${user.username}</b> (${user.role})
        <button class="edit-btn crud-btn">Editar</button>
        <button class="delete-btn crud-btn">Remover</button>
        <div class="edit-extension" style="display:none;"></div>
      `;
      item.querySelector('.edit-btn').onclick = () => this.toggleEditExtension(item, user);
      item.querySelector('.delete-btn').onclick = () => this.deleteUsuario(user.id);
      list.appendChild(item);
    });
  },
  toggleEditExtension(item, user) {
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
        <input name="username" placeholder="Usuário" value="${user.username||''}" required />
        <input name="password" placeholder="Senha" type="password" value="" required />
        <select name="role">
          <option value="cliente" ${user.role==='cliente'?'selected':''}>Cliente</option>
          <option value="gerente" ${user.role==='gerente'?'selected':''}>Gerente</option>
        </select>
        <div class="form-alert" style="color:#c40000;font-size:1em;margin:8px 0 0 0;display:none;"></div>
        <button type="submit" class="crud-btn">Salvar</button>
      </form>
      <button type="button" class="crud-btn close-inline-edit" style="margin-top:8px;">Cancelar</button>
    `;
    ext.querySelector('.close-inline-edit').onclick = () => { ext.style.display = 'none'; ext.innerHTML = ''; };
    ext.querySelector('.inline-edit-form').onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      if (!data.username || !data.password || !data.role) {
        const alert = ext.querySelector('.form-alert');
        alert.textContent = 'Preencha todos os campos obrigatórios!';
        alert.style.display = 'block';
        return;
      }
      data.id = user.id;
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
        <input name="username" placeholder="Usuário" required />
        <input name="password" placeholder="Senha" type="password" required />
        <select name="role">
          <option value="cliente">Cliente</option>
          <option value="gerente">Gerente</option>
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
      if (!data.username || !data.password || !data.role) {
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
  showForm(mode, user = {}) {
    const modal = document.getElementById('usuario-form-modal');
    modal.style.display = 'block';
    modal.innerHTML = `
      <form id="usuario-form">
        <input name="username" placeholder="Usuário" value="${user.username||''}" required />
        <input name="password" placeholder="Senha" type="password" value="" required />
        <select name="role">
          <option value="cliente" ${user.role==='cliente'?'selected':''}>Cliente</option>
          <option value="gerente" ${user.role==='gerente'?'selected':''}>Gerente</option>
        </select>
        <button type="submit">Salvar</button>
        <button type="button" onclick="document.getElementById('usuario-form-modal').style.display='none'">Cancelar</button>
      </form>
    `;
    document.getElementById('usuario-form').onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      if (mode === 'edit') data.id = user.id;
      if (mode === 'edit') {
        await this.onEdit(data);
      } else {
        await this.onAdd(data);
      }
      modal.style.display = 'none';
      this.renderList();
    };
  },
  async deleteUsuario(id) {
    await this.onDelete(id);
    this.renderList();
  }
};
export default UsuarioView;

window.UsuarioView = UsuarioView;

document.addEventListener('DOMContentLoaded', () => {
  UsuarioView.init({
    onAdd: UsuarioService.addUsuario,
    onEdit: UsuarioService.editUsuario,
    onDelete: UsuarioService.deleteUsuario,
    fetchAll: UsuarioService.getUsuarios
  });
});
