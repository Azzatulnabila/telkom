import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import RevenueDashboard from "./components/revenue/revenue";
import NGTMAReport from "./components/revenue/NGTMA";
import TREND from "./components/revenue/trend";
import SEGMENT from "./components/revenue/segment";
import PROGNOSA from "./components/revenue/prognosa";
import Sales from "./components/sales/sales";
import Collection from "./components/collection/collection";
import LoginPage from "./components/login/login";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <Router>
      <div className="bg-[#EEEEEE] dark:bg-gray-900 dark:text-white duration-200 overflow-x-hidden">
        <Routes>
        
          <Route path="/" element={<RevenueDashboard />} />
          <Route path="/revenue" element={<RevenueDashboard />} />
          <Route path="/ngtma" element={<NGTMAReport />} />
          <Route path="/trend" element={<TREND />} />
          <Route path="/segment" element={<SEGMENT />} />
          <Route path="/prognosa" element={<PROGNOSA />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
