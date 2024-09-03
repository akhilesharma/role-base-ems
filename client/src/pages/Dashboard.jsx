// src/pages/Dashboard.js
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>Welcome, {user.username}!</p> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;
