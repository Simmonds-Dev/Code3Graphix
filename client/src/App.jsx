import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Orders from './pages/Orders.jsx';
import Login from './pages/Login.jsx';
import Confirmation from './pages/Confirmation.jsx';
import CategoryProducts from './pages/CategoryProducts.jsx';
import './Main.css'


const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category_name" element={<CategoryProducts />} />
          <Route path="/orders" element={<Orders />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/confirmation" element={<Confirmation />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
