import { useContext } from 'react';
import { ProdutoContext } from '../context/ProdutoContext';

const useProduto = () => {
  const context = useContext(ProdutoContext);

  if (!context) {
    throw new Error('useProduto must be used within a ProdutoProvider');
  }

  return context;
};

export default useProduto;
