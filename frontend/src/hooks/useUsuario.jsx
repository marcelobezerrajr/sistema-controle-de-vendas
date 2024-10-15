import { useContext } from 'react';
import { UsuarioContext } from '../context/UsuarioContext';

const useUsuario = () => {
  const context = useContext(UsuarioContext);

  if (!context) {
    throw new Error('useUsuario must be used within a UsuarioProvider');
  }

  return context;
};

export default useUsuario;
