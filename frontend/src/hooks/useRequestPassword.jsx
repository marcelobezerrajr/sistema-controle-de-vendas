import { useContext } from "react";
import { RequestPasswordContext } from "../context/RequestPasswordContext";

const useRequestPassword = () => {
  const context = useContext(RequestPasswordContext);

  if (!context) {
    throw new Error(
      "useRequestPassword must be used within a RequestPasswordContext"
    );
  }

  return context;
};

export default useRequestPassword;
