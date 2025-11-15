import { lazy, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import ForgotPassword from "./pages/ForgotPassword";
const SignUp = lazy(() => import("../src/pages/SignUp"));
const SignIn = lazy(() => import("../src/pages/SignIn"));
function App() {
  return (
    <>
      {/* <SignIn /> */}
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
