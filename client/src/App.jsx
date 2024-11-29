import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Home from "./pages/Home";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useSelector } from "react-redux";

function App() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      style={{
        background: isDarkMode ? "#333" : "#FFF",
        color: isDarkMode ? "#FFF" : "#000",
        height: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verifyemail" element={<VerifyEmailPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forget-password" element={<ForgotPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
