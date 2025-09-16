import RegisterForm from "./components/RegisterForm";
import InvitationTree from "./components/InvitationTree";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div className="container py-4">
        

        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/tree" element={<InvitationTree />} />
          <Route path="*" element={<p>Not Found</p>} />
        </Routes>
      </div>
    </Router>
  );
}
