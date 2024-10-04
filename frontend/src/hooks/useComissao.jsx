import { useContext } from 'react';
import { ComissaoContext } from '../context/ComissaoContext';

const useComissao = () => {
  const context = useContext(ComissaoContext);

  if (!context) {
    throw new Error('useComissoes must be used within a ComissaoProvider');
  }

  return context;
};

export default useComissao;
