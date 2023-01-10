import "./App.css";

import { Route, Routes } from "react-router-dom";

import Nav from "./components/layout/Nav/Nav";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Rooms from "./pages/rooms/Rooms";

import GuestRoutes from "./protectedRoutes/GuestRoutes";
import SemiProtectedRoutes from "./protectedRoutes/SemiProtectedRoutes";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";

const Auth = false;
const user = {
  activated: false,
};

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoutes Auth={Auth}>
              <Home />
            </GuestRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <SemiProtectedRoutes Auth={Auth} user={user}>
              <Register />
            </SemiProtectedRoutes>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoutes Auth={Auth} user={user}>
              <Rooms />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoutes Auth={Auth}>
              <Login />
            </GuestRoutes>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
