import { Typography } from "@material-tailwind/react";
import BarChartTransactions from "../components/charts/BarChartTransactions";
import { FilterDto } from "../models/dto/FilterDto";
import DonutChartTransactions from "../components/charts/DonutChartTransactions";
import LineChartAccountBalance from "../components/charts/LineChartAccounts";
import { AccountService } from "../services/AccountService";
import { Account } from "../models/Account";
import { useState, useEffect } from "react";
import AccountsList from "../components/AccountsList";


function OverviewPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [userId, setUser] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const userId = localStorage.getItem("userId")!;
      setUser(+userId);
      console.log("userid: ", userId)
      if(userId)
      {  const response = await AccountService.getAllAccountsForUser(+userId);
        setAccounts(response.data);
        console.log("Acc: ",response.data)
      }
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const startOfMonth = new Date();
  startOfMonth.setDate(1); 
  const now = new Date(); 
  
  const filterDto: FilterDto = {
    userId: userId!, 
    accountId: null,
    categoryId: null,
    type: null,
    start: startOfMonth.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  };

  const donutChartDto: FilterDto = {
    ...filterDto,
    type: "EXPENSE", 
  };

  
  if (error) {
    return <div>{error}</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

    return (
        <section className="w-full">
            <div className="p-10 mx-10">
                <Typography variant="lead" color="blue-gray" className="font-bold text-lg">
                    Overview
                </Typography>
            </div>

            <div className="mx-[6rem] mb-[4rem]">
                <Typography variant="lead" color="blue-gray" className="font-semibold text-md">
                    Accounts
                </Typography>
                <AccountsList accounts={accounts}></AccountsList>
            </div>

            <div className="mx-[6rem]">
                <div className="flex h-25 " >
                    <div className="flex w-[65%] h-[25rem] bg-white rounded-lg mr-8 p-7" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                        <div className="w-[45%] mr-1 ">
                            Balance
                        </div>
                        <div className="w-[55%] mt-[2.5rem]">   
                            <LineChartAccountBalance filterDto={filterDto}></LineChartAccountBalance>
                        </div>
                    </div>
                    
                    <div className="w-[35%] rounded-lg p-7 bg-white " style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                    <span>Analytics</span>
                    <DonutChartTransactions filterDto={donutChartDto}></DonutChartTransactions>

                    </div>
                </div>

                
                <div className="flex my-[5rem] h-25 bg-white rounded-lg p-7" style={{ boxShadow: "0 0px 8px rgba(0, 0, 0, 0.05)" }}>
                    
                <BarChartTransactions filterDto={filterDto}></BarChartTransactions>
                </div>
            </div>

            <div className="">
            </div>


        </section>
    );
}

export default OverviewPage