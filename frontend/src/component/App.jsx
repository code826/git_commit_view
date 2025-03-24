import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CommitPage from "./CommitPage"; // Component that fetches commit details
import InfoPage from "./InfoPage"; // Fallback info page

function App() {
  return (
    <Router>
      <Routes>
        {/* Valid route pattern */}
        <Route path="/repositories/:owner/:repo/commits/:commitId" element={<CommitPage />} />
        
        {/* Default route (homepage) */}
        <Route path="/" element={<InfoPage />} />

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
