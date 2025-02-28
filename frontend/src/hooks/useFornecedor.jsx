import { useContext } from "react";
import { FornecedorContext } from "../context/FornecedorContext";

const useFornecedor = () => {
  const context = useContext(FornecedorContext);

  if (!context) {
    throw new Error("useFornecedor must be used within a FornecedorProvider");
  }

  return context;
};

export default useFornecedor;
