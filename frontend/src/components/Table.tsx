import { Typography } from "@material-tailwind/react";
import { TableProps } from "./props/TableProps";

const Table: React.FC<TableProps> = ({
  TABLE_HEAD = [],
  accounts = [],
  transactions = [],
}) => {
  return (
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th key={head} className="border-b border-gray-300 pb-4 pt-10">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-bold leading-none"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {accounts.length > 0 ? (
          accounts.map(({ name, balance }, index) => {
            const isLast = index === accounts.length - 1;
            const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

            return (
              <tr key={name} className="hover:bg-gray-50">
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {balance} MKD
                  </Typography>
                </td>
              </tr>
            );
          })
        ) : transactions.length > 0 ? (
          transactions.map(({ name, cost, date }, index) => {
            const isLast = index === transactions.length - 1;
            const classes = isLast ? "py-4" : "py-4 border-b border-gray-300";

            return (
              <tr key={name} className="hover:bg-gray-50">
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold"
                  >
                    {name}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {cost} MKD
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    className="font-normal text-gray-600"
                  >
                    {new Date(date).toLocaleDateString()}
                  </Typography>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={TABLE_HEAD.length} className="py-4 text-center">
              <Typography variant="small" className="font-normal text-gray-600">
                No rows available.
              </Typography>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
export default Table;
