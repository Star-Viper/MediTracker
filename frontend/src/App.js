import { Route, Routes } from 'react-router-dom';

import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import User from './components/User';
import Manufacturer from './components/Manufacturer';
import Navbar from './components/Navbar';
import ManuProducts from './components/ManuProducts';
import DistributorPage from './components/DistributorPage';
import RetailerPage from './components/RetailerPage';


function App() {

  return (
    <>
      <Routes>
        <Route exact path='/' element={<Navbar />} />
        <Route exact path='/mProducts' element={<ManuProducts />} />
        <Route exact path='/dProducts' element={<DistributorPage />} />
        <Route exact path='/rProducts' element={<RetailerPage />} />
        <Route exact path='/register' element={<Register />} />
        <Route exact path='/user' element={<User />} />
        <Route exact path='/manufacturer' element={<Manufacturer />} />
        <Route exact path='/login' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
