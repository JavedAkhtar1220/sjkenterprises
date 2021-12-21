import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Components 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";

import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" exact element={<Home />} />

        <Route path="/login" exact element={<Login />} />

        <Route path="/signup" exact element={<Signup />} />

        <Route path="/upload" exact element={<Upload />} />

      </Routes>
    </Router>
  );
}

export default App;
