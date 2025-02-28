import { useContext } from "react";
import { ResetPasswordContext } from "../context/ResetPasswordContext";

const useResetPassword = () => {
  const context = useContext(ResetPasswordContext);

  if (!context) {
    throw new Error(
      "useResetPassword must be used within a ResetPasswordProvider"
    );
  }

  return context;
};

export default useResetPassword;
