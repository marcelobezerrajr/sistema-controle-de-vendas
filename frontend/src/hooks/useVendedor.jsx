import { useContext } from 'react';
import { VendedorContext } from '../context/VendedorContext';

const useVendedores = () => {
  const context = useContext(VendedorContext);

  if (!context) {
    throw new Error('useVendedores must be used within a VendedorProvider');
  }

  return context;
};

export default useVendedores;
