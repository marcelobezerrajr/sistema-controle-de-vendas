import { useContext } from "react";
import { ItemVendaContext } from "../context/ItemVendaContext";

const useItemVenda = () => {
  const context = useContext(ItemVendaContext);

  if (!context) {
    throw new Error("useItemVenda must be used within a ItemVendaProvider");
  }

  return context;
};

export default useItemVenda;
