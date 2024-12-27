import { Route, Routes } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import OverviewPage from './OverviewPage'
import TransactionsPage from './TransactionsPage1'
import BudgetsPage from './BudgetsPage'
import AccountsPage from './AccountsPage'
import UserDetails from './UserDetails'

const LoggedInPage = () => {
  return (
      <div className="flex font-medium rounded-md bg-[rgb(249,249,251)]">
        <Sidebar>
        </Sidebar>

        <div className="flex-1 ml-0">
          <Routes>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/profile" element={<UserDetails />} />
          </Routes>
        </div>
      </div>
      )
}

export default LoggedInPage