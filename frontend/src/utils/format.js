export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
