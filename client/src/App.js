import "./App.css";

import { Route, Routes } from "react-router-dom";

import Nav from "./components/layout/Nav/Nav";
import Home from "./pages/Home/Home";

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
