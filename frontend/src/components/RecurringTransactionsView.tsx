import { RecurringTransaction } from "../models/RecurringTransaction";
import { RecurrenceFrequency } from "../models/enum/RecurrenceFrequency";
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns";
import { RecurringTransactionService } from "../services/RecurringTransactionService";
import { Edit, Play, Pause, Trash2, Repeat, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

interface RecurringTransactionsViewProps {
  recurringTransactions: RecurringTransaction[];
  onToggleActive: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (transaction: RecurringTransaction) => void;
}

function getNextOccurrence(recurring: RecurringTransaction): Date {
  const start = new Date(recurring.startDate);
  const now = new Date();
  let nextDate = new Date(start);

  switch (recurring.frequency) {
    case RecurrenceFrequency.DAILY:
      while (nextDate < now) nextDate = addDays(nextDate, 1);
      break;
    case RecurrenceFrequency.WEEKLY:
      while (nextDate < now) nextDate = addWeeks(nextDate, 1);
      break;
    case RecurrenceFrequency.MONTHLY:
      while (nextDate < now) nextDate = addMonths(nextDate, 1);
      break;
    case RecurrenceFrequency.YEARLY:
      while (nextDate < now) nextDate = addYears(nextDate, 1);
      break;
  }
  return nextDate;
}

function getFrequencyDescription(recurring: RecurringTransaction): string {
  switch (recurring.frequency) {
    case RecurrenceFrequency.DAILY:
      return "Daily";
    case RecurrenceFrequency.WEEKLY:
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return `Every ${days[recurring.dayOfWeek! - 1]}`;
    case RecurrenceFrequency.MONTHLY:
      return `Monthly on the ${recurring.dayOfMonth}${getOrdinalSuffix(recurring.dayOfMonth!)}`;
    case RecurrenceFrequency.YEARLY:
      const date = new Date(recurring.startDate);
      return `Yearly on ${format(date, "MMMM d")}`;
    default:
      return "";
  }
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const RecurringTransactionsView: React.FC<RecurringTransactionsViewProps> = ({
  recurringTransactions,
  onToggleActive,
  onDelete,
  onEdit,
}) => {
  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this recurring transaction? Already created transactions will remain."
    );
    if (isConfirmed) {
      try {
        await RecurringTransactionService.deleteRecurringTransaction(id);
        onDelete(id);
      } catch (err) {
        console.error("Failed to delete recurring transaction:", err);
        alert("Failed to delete recurring transaction");
      }
    }
  };

  const handleToggle = async (recurring: RecurringTransaction) => {
    try {
      await RecurringTransactionService.toggleActiveStatus(
        recurring.id,
        !recurring.isActive
      );
      onToggleActive(recurring.id);
    } catch (err) {
      console.error("Failed to toggle active status:", err);
      alert("Failed to update recurring transaction status");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 shadow-sm bg-white">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[25%] px-6 py-4 font-medium text-gray-600">Name & Account</th>
              <th className="w-[25%] px-6 py-4 font-medium text-gray-600">Frequency</th>
              <th className="w-[24%] px-6 py-4 font-medium text-gray-600">Next Occurrence</th>
              <th className="w-[24%] px-6 py-4 font-medium text-gray-600">Status</th>
              <th className="w-[1%] px-6 py-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {recurringTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No recurring transactions found
                </td>
              </tr>
            ) : (
              recurringTransactions.map((recurring) => (
                <tr key={recurring.id} className="group hover:bg-gray-50 h-[60px]">
                  {/* Name & Account */}
                  <td className="flex gap-3 px-6 py-3 font-normal text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                      <Repeat className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">{recurring.name}</div>
                      <div className="text-gray-400">{recurring.account.name}</div>
                      <div className="text-sm font-semibold text-red-600">
                        -{recurring.cost.toFixed(2)} MKD
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">{getFrequencyDescription(recurring)}</td>
                  <td className="px-6 py-4 text-sm">{format(getNextOccurrence(recurring), "dd/MM/yyyy")}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        recurring.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {recurring.isActive ? "Active" : "Paused"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-600 hover:text-gray-900" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white border border-gray-100 shadow-md rounded-md"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(recurring)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggle(recurring)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                          {recurring.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          {recurring.isActive ? "Pause" : "Resume"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(recurring.id)}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringTransactionsView;
