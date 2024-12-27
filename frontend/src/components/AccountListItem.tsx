import { Account } from "../models/Account";

const AccountListItem: React.FC<{ account: Account }> = ({ account }) => {
    return (
      <div style={styles.card}>
        <div className="text-sm font-thin">{account.name}</div>
        <div className="flex jusitfy-end">
            
            <div style={styles.button}>
            
            </div>
        </div>
        <div className="text-2xl font-normal">
          {account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} MKD
        </div>
      </div>
    );
  };
  
  const styles: { [key: string]: React.CSSProperties } = {
    card: {
      backgroundColor: "#475EE1", // Blue background
      color: "#ffffff", // White text
      borderRadius: "12px", // Rounded corners
      padding: "16px", // Internal spacing
      width: "240px", // Fixed width
      height: "140px", // Fixed height
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
      marginRight: "1rem",
    },
    button: {
        width: "3rem",
        height: "2rem",
        backgroundColor: "#6075EC",
        borderRadius: "5px"
    },
    name: {
        fontWeight: "1"
    }
    
  };
  
  export default AccountListItem;