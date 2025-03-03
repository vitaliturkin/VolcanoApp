// importing necessary modules and components
import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./routes/Home"
import VolcanoTable from "./routes/VolcanoTable"
import Volcano from "./routes/Volcano";
import Register from "./routes/Register"
import Login from "./routes/Login"

import Header from "./strucrure/Header"
import Footer from "./strucrure/Footer"

// retrieving authentication data(token) from localStorage
export default function App() {
  let strAuthData = localStorage.getItem("authData");
  let intAuthData = (strAuthData === null ? {email: "", token: ""} : JSON.parse(strAuthData))

  const [authData, setAuthData] = useState(intAuthData);

// rendering the App component
  return (
      <div className="App">
        <BrowserRouter>
          <div className="content">
            <Header authData={authData} setAuthData={setAuthData} />
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/volcanoes" element={<VolcanoTable/>}/>
              <Route path="/volcanoes/volcano" element={<Volcano/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login setAuthData={setAuthData}/>}/>
            </Routes>
          </div>
          <Footer/>
        </BrowserRouter>
      </div>
  );
}
