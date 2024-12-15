import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import OverviewPage from "./pages/OverviewPage";
import AccountsPage from "./pages/AccountsPage";
import Sidebar from "./components/Sidebar";
import TransactionsPage from "./pages/TransactionsPage1";
import BudgetsPage from "./pages/BudgetsPage";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoggedInPage from "./pages/LoggedInPage";

function App() {
  const user = localStorage.getItem("user");

  //if (!user)
  //return <LoginPage/>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {user ? (
          <Route path="/*" element={<LoggedInPage />} />
        ) : (
          <Route path="/login" element={<LoginPage />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
