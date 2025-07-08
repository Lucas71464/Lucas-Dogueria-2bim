const UsuarioService = {
  async getUsuarios() {
    const res = await fetch('http://localhost:3000/usuarios');
    return res.json();
  },
  async addUsuario(usuario) {
    const res = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return res.json();
  },
  async editUsuario(usuario) {
    const res = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return res.json();
  },
  async deleteUsuario(id) {
    const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'DELETE' });
    return res.json();
  }
};
export default UsuarioService;
