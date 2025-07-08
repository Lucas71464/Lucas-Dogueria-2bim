const ProdutoService = {
  async getProdutos() {
    const res = await fetch('http://localhost:3000/produtos');
    return res.json();
  },
  async addProduto(produto) {
    const res = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    return res.json();
  },
  async editProduto(produto) {
    const res = await fetch(`http://localhost:3000/produtos/${produto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto)
    });
    return res.json();
  },
  async deleteProduto(id) {
    const res = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: 'DELETE' });
    return res.json();
  }
};
export default ProdutoService;
