import { Routes, Route } from "react-router-dom";
import "./App.css";

import User from "./pages/User";
import Customer from "./pages/Customer";
import SignUp from "./components/Auth/SignUp";
import SingIn from "./components/Auth/SingIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<SingIn />} />
        <Route path="/user" element={<User />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
    </>
  );
}

export default App;
