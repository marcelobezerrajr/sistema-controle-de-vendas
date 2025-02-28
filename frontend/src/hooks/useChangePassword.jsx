import { useContext } from "react";
import { ChangePasswordContext } from "../context/ChangePasswordContext";

const useChangePassword = () => {
  const context = useContext(ChangePasswordContext);

  if (!context) {
    throw new Error(
      "useChangePassword must be used within a ChangePasswordProvider"
    );
  }

  return context;
};

export default useChangePassword;
