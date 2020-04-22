import React, { useState } from "react";
import { useAuth, AuthCheck } from "reactfire";
import { Redirect } from "react-router-dom";
import LoginComponent from "../components/Login";

function handleSubmit(e, auth) {
  e.preventDefault();
  const data = new FormData(e.target),
    email = data.get("cedula") + "@incesinfo.com",
    password = data.get("password");

  return auth.signInWithEmailAndPassword(email, password);
}

function Login() {
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async e => {
    setBusy(true);
    try {
      await handleSubmit(e, auth);
    } catch (e) {
      setErr(e);
    }
    setBusy(false);
  };

  return (
    <AuthCheck
      auth={auth}
      fallback={
        <LoginComponent busy={busy} err={err} handleSubmit={onSubmit} />
      }
    >
      <Redirect to="/admin" />
    </AuthCheck>
  );
}

export default Login;
