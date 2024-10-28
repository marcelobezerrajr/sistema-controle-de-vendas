import { useContext } from 'react';
import { VendaContext } from '../context/VendaContext';

const useVenda = () => {
  const context = useContext(VendaContext);

  if (!context) {
    throw new Error('useVenda must be used within a VendaProvider');
  }

  return context;
};

export default useVenda;
