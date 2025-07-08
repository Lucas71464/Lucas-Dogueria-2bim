import ProdutoService from '../services/ProdutoService.js';
import ProdutoView from '../views/ProdutoView.js';

document.addEventListener('DOMContentLoaded', () => {
  ProdutoView.init({
    onAdd: ProdutoService.addProduto,
    onEdit: ProdutoService.editProduto,
    onDelete: ProdutoService.deleteProduto,
    fetchAll: ProdutoService.getProdutos
  });
});
