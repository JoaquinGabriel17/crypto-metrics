import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Route, Routes } from "react-router-dom";  
import './index.css'
import LandingPage from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Foooter.jsx';
import Highlights from './pages/Highlights.jsx';
import Categories from './pages/Categories.jsx';
import Exchanges from './pages/Exchanges.jsx';
import Nfts from './pages/Nfts.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Navbar/>
    <Provider store={store}>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/highlights' element={<Highlights/>} />
        <Route path='/categories' element={<Categories/>}/> 
        <Route path='/exchanges' element={<Exchanges/>}/>
        <Route path='*' element={<h1>404 Not Found</h1>} />
        <Route path='/ntfs' element={<Nfts/>} />
      </Routes>
    </Provider>
    <Footer></Footer>
  </BrowserRouter>
);
