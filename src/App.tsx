import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import NavBar from "./Components/NavBar";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Watchlist from './Components/Watchlist';
import Protected from './Components/Protected';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      {/* <NavBar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/' element={<Home/>}/>
          <Route element={<Protected/>}>
          <Route path='/watchlist' element={<Watchlist/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
