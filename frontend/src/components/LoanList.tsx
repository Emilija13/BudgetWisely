import { Loan } from "../models/Loan";

type LoanListProps = {
  loans: Loan[];
  onDelete(id: number): void;
  onEdit(loan: Loan): void;
};

const LoanList = ({ loans, onDelete, onEdit }: LoanListProps) => {
  const calculateProgress = (loan: Loan) =>
    (loan.months_paid / loan.period) * 100;

  const calculateRemainingBalance = (loan: Loan) => {
    const paid = loan.monthly_payment * loan.months_paid;
    const total = loan.monthly_payment * loan.period;
    return total - paid;
  };

  const handleDelete = (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (isConfirmed) {
      onDelete!(id);
    }
  };

  const handleEdit = (loan: Loan) => {
    onEdit!(loan);
  };

  return (
    <div className="space-y-6">
      {loans.map((loan) => (
        <div
          key={loan.id}
          className="bg-white rounded-lg pl-8 pb-6 pt-3 shadow-[0_0px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_0px_12px_rgba(0,0,0,0.15)] transition-shadow duration-300"
        >
          <div className="flex justify-end pb-2 pr-2 space-x-2">
            <button
              className="text-gray-500 hover:text-blue-600 transition-colors"
              onClick={() => handleEdit(loan)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
                x-tooltip="tooltip"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </button>

            <button
              className="text-gray-500 hover:text-red-600 transition-colors"
              onClick={() => handleDelete(loan.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
                x-tooltip="tooltip"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4 pr-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="">{loan.purpose}</div>
                <p className="text-sm font-light text-gray-600 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-building2-icon lucide-building-2"
                  >
                    <path d="M10 12h4" />
                    <path d="M10 8h4" />
                    <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
                    <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
                    <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
                  </svg>
                  {loan.bank_name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-light text-gray-600">
                  Monthly Payment
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {loan.monthly_payment.toLocaleString()} MKD
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {loan.months_paid} of {loan.period} months paid
                </span>
                <span className="font-medium">
                  {calculateProgress(loan).toFixed(1)}%
                </span>
              </div>
              <div className="w-full purple-light rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 main-color rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(loan)}%` }}
                />
              </div>
            </div>

            {/* Loan Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-light text-gray-600">
                  Original Amount
                </p>
                <p className="font-semibold">
                  {loan.amount.toLocaleString()} MKD
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-gray-600">
                  Interest Rate
                </p>
                <p className="font-semibold">{loan.interest_rate}%</p>
              </div>
              <div>
                <p className="text-xs font-light text-gray-600">
                  Total Interest
                </p>
                <p className="font-semibold text-[rgb(255,148,87)]">
                  {loan.total_interest.toLocaleString()} MKD
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-gray-600">Remaining</p>
                <p className="font-semibold text-[rgb(255,97,97)]">
                  {calculateRemainingBalance(loan).toLocaleString()} MKD
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoanList;
