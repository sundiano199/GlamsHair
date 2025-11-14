import { lazy, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
const SignUp = lazy(() => import("../src/pages/SignUp"));
const SignIn = lazy(() => import("../src/pages/SignIn"));
function App() {
  return (
    <>
      {/* <SignIn /> */}
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<SignIn />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
