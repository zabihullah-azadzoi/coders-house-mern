import "./App.css";

import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import useRefreshOnReload from "./hooks/useRefreshOnReload";
import Loader from "./components/shared/Loader/Loader";

import Nav from "./components/layout/Nav/Nav";
import Home from "./pages/home/Home";
import Authenticate from "./pages/authenticate/Authenticate";
import Activate from "./pages/activate/Activate";
import Login from "./pages/login/Login";
import Rooms from "./pages/rooms/Rooms";

import GuestRoutes from "./protectedRoutes/GuestRoutes";
import SemiProtectedRoutes from "./protectedRoutes/SemiProtectedRoutes";
import ProtectedRoutes from "./protectedRoutes/ProtectedRoutes";

function App() {
  const { isAuth, user } = useSelector((state) => state.auth);
  const { isLoading } = useRefreshOnReload();

  return (
    <>
      <div className="App">
        <ToastContainer theme="colored" />
        <Nav />

        {isLoading ? (
          <Loader text="Loading your page..." />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <GuestRoutes isAuth={isAuth}>
                  <Home />
                </GuestRoutes>
              }
            />

            <Route
              path="/authenticate"
              element={
                <GuestRoutes isAuth={isAuth} user={user}>
                  <Authenticate />
                </GuestRoutes>
              }
            />

            <Route
              path="/activate"
              element={
                <SemiProtectedRoutes isAuth={isAuth} user={user}>
                  <Activate />
                </SemiProtectedRoutes>
              }
            />

            <Route
              path="/rooms"
              element={
                <ProtectedRoutes isAuth={isAuth} user={user}>
                  <Rooms />
                </ProtectedRoutes>
              }
            />

            <Route
              path="/login"
              element={
                <GuestRoutes isAuth={isAuth}>
                  <Login />
                </GuestRoutes>
              }
            />
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
