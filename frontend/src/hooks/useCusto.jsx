import { useContext } from "react";
import { CustoContext } from "../context/CustoContext";

const useCusto = () => {
  const context = useContext(CustoContext);

  if (!context) {
    throw new Error("useCusto must be used within a CustoProvider");
  }

  return context;
};

export default useCusto;
