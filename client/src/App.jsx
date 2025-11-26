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
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./utils/PrivateRoute";
import Orders from "./pages/Orders";
function App() {
  return (
    <>
      {/* <SignIn /> */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "__toast",
          // Default options for all toasts
          style: {
            fontSize: "30px", // bigger text
            padding: "20px 0px", // bigger padding

            background: "#FFFBF7", // custom bg color
            color: "#cc7c66", // custom text color
          },
        }}
      />
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/productdetail/:id" element={<ProductDetail />} />
              </Route>

              <Route path="/cartpage" element={<CartPage />} />
              <Route path="/searchpage" element={<SearchPage />} />
              <Route path="/orders" element={<Orders />} />

              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<NewPasswordReset />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
