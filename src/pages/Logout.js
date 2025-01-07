import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNeurosity } from "../services/neurosity";

export function Logout() {
  const navigate = useNavigate();
  const { logoutNeurosity } = useNeurosity();

  useEffect(() => {
    logoutNeurosity().then(() => {
      navigate("/login");
    });
  }, [logoutNeurosity, navigate]);

  return null;
}
