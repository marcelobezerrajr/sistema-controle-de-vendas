import { useContext } from 'react';
import { ParcelaContext } from '../context/ParcelaContext';

const useParcelas = () => {
  const context = useContext(ParcelaContext);

  if (!context) {
    throw new Error('useParcela must be used within a ParcelaProvider');
  }

  return context;
};

export default useParcelas;
