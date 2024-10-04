// Função para pegar as iniciais de um nome
export const getInitials = (name) => {
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
    return initials;
  };
  