import { useContext } from 'react';
import { VendedorContext } from '../context/VendedorContext';

const useVendedor = () => {
  const context = useContext(VendedorContext);

  if (!context) {
    throw new Error('useVendedor must be used within a VendedorProvider');
  }

  return context;
};

export default useVendedor;
