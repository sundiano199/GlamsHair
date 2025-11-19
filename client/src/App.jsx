import { lazy, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import RootLayout from "./layout/RootLayout";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import NewPasswordReset from "./pages/NewPasswordReset";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import SearchPage from "./pages/SearchPage";
const SignUp = lazy(() => import("../src/pages/SignUp"));
const SignIn = lazy(() => import("../src/pages/SignIn"));
function App() {
  return (
    <>
      {/* <SignIn /> */}
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/searchpage" element={<SearchPage />} />

          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<NewPasswordReset />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
