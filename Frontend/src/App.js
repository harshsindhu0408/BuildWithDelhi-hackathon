import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/homepage";
import LoginPage from "./pages/login/login";
import Message from "./pages/message/message";
import { useContext, useEffect } from "react";
import axios from "axios";
import LoginContext from "./context/context";
import { PrivateRoute } from "./components/router/PrivateRouter";
import { PrivateRouteAnalysis } from "./components/router/PrivateRouterAnalysis";
import Analysis from "./pages/analysis/analysis";
import Error from "./pages/error/error";
import ClientData from "./components/Forms/ClientData";
import TherapistData from "./components/Forms/TherapistData";
import RoleSelection from "./components/Forms/RoleSelection";
import Articles from "./pages/Articles/Articles";
import AnimatedCard from "./components/AnimatedCard";

function App() {
  const { login, logout } = useContext(LoginContext);
  useEffect(() => {
    async function isUser() {
      try {
        const user = await axios.get(
          process.env.REACT_APP_API_LINK + "/isUser",
          {
            withCredentials: true,
          }
        );
        if (user) {
          console.log("Yes");
          login();
        }
      } catch (error) {
        logout();
        console.log(error.message);
      }
    }
    isUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <LoginPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Homepage />} />
        <Route path="/message" element={<Message />} />
        <Route
          path="/analysis"
          element={
            <PrivateRouteAnalysis>
              <Analysis />
            </PrivateRouteAnalysis>
          }
        />
        <Route path="*" element={<Error />} />
        <Route path="/getClientData" element={<ClientData />} />
        <Route path="/getTherapistData" element={<TherapistData />} />
        <Route path="/roleSelection" element={<RoleSelection />} />
        <Route path="/articles" element={<AnimatedCard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
