import { useContext } from "react";
import { VendaVendedorContext } from "../context/VendaVendedorContext";

const useVendaVendedor = () => {
  const context = useContext(VendaVendedorContext);

  if (!context) {
    throw new Error(
      "useVendaVendedor must be used within a VendaVendedorProvider"
    );
  }

  return context;
};

export default useVendaVendedor;
