import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Pages
import Home from './Pages/Home/home';
import Dashboard from './Pages/DashBoard/Dashboard';
import Member from './Pages/member/Member';
import GeneralUser from './Pages/GeneralUser/Generaluser';
import Memberdetail from './Pages/MemberDetail/Memberdetail';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLogin");
    if (isLoggedIn === "true") {
      setIsLogin(true);
      navigate('/dashboard');
    } else {
      setIsLogin(false);
      navigate('/');
    }
  }, [localStorage.getItem("isLogin")]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/Member' element={<Member />} />
        <Route path='/specific/:page' element={<GeneralUser />} />
        <Route path='/member/:id' element={<Memberdetail />} />
      </Routes>
    </>
  );
}

export default App;
