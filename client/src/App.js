import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router";
import "./App.css";
import MainNavigation from "./components/layout/MainNavigation";
import AddVacation from "./components/pages/AddVacation";
import AuthPage from "./components/pages/auth/AuthPage.js";
import Home from "./components/pages/Home.js";
import Profile from "./components/pages/Profile.js";
import Vacations from "./components/pages/Vacations.js";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { addNotification } from "./stateManagement/notifications.js";
import { signIn } from "./stateManagement/user";
import CryptoJS from "crypto-js";
import keys from "./common/config";

const socket = io.connect("http://localhost:5001");

function App() {
  const user = useSelector((state) => state.user);
  const [connectedUser, setConnectedUser] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const userEmailFormStorage = sessionStorage.getItem("connected-user");

    if (userEmailFormStorage !== null) {
      const bytes = CryptoJS.AES.decrypt(
        userEmailFormStorage,
        keys.TOKEN_SECRET
      );
      const currentUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      setConnectedUser(currentUser);
      dispatch(signIn({ userInfo: { ...currentUser } }));
    }
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.message !== undefined) {
        dispatch(
          addNotification({ message: data.message, timeStemp: data.time })
        );
      }
    });
  }, [dispatch]);

  return (
    <div className='App'>
      <header style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <MainNavigation socketObj={socket} />
      </header>
      <main>
        <Routes>
          {(!user.isSignIn || connectedUser === null) && (
            <>
              <Route path='/auth' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' replace />} />
            </>
          )}

          {user.isSignIn && (
            <>
              <Route
                path='/vacations'
                element={<Vacations socketObj={socket} />}
              />
              {user.userInfo.role === "admin" && (
                <>
                  <Route path='/home' element={<Home />} />

                  <Route
                    path='/add-vacation'
                    element={<AddVacation socketObj={socket} />}
                  />
                </>
              )}
              <Route path='/profile' element={<Profile />} />
              <Route path='*' element={<Navigate to='/vacations' replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;




