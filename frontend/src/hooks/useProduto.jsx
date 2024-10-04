import { useContext } from 'react';
import { ProdutoContext } from '../context/ProdutoContext';

const useProdutos = () => {
  const context = useContext(ProdutoContext);

  if (!context) {
    throw new Error('useProdutos must be used within a ProdutoProvider');
  }

  return context;
};

export default useProdutos;
