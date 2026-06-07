import "./App.css";
import AboutPage from "./pages/AboutPage";
import DistanceDetails from "./pages/DistanceDetails";
import BudgetDetails from "./pages/BudgetDetails";
import TimeDetails from "./pages/TimeDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/distance-details" element={<DistanceDetails />} />
        <Route path="/budget-details"   element={<BudgetDetails />} />
        <Route path="/time-details"     element={<TimeDetails />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;