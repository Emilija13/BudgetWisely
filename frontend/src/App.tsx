import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import OverviewPage from "./pages/OverviewPage";
import AccountsPage from "./pages/AccountsPage";
import Sidebar from "./components/Sidebar";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex font-medium rounded-md bg-[rgb(250,250,250)]">
        <Sidebar>
        </Sidebar>

        <div className="flex-1 ml-0">
          <Header /> 
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;