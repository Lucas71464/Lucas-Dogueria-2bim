import UsuarioService from '../services/UsuarioService.js';
import UsuarioView from '../views/UsuarioView.js';

document.addEventListener('DOMContentLoaded', () => {
  UsuarioView.init({
    onAdd: UsuarioService.addUsuario,
    onEdit: UsuarioService.editUsuario,
    onDelete: UsuarioService.deleteUsuario,
    fetchAll: UsuarioService.getUsuarios
  });
});
