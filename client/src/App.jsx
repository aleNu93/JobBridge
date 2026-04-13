import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPYME from './pages/DashboardPYME';
import DashboardFreelancer from './pages/DashboardFreelancer';
import ServicesOffer from './pages/ServicesOffer';
import ServiceDetail from './pages/ServiceDetail';
import CreateModifyService from './pages/CreateModifyService';
import ServicesManage from './pages/ServicesManage';
import NewContract from './pages/NewContract';
import MyContracts from './pages/MyContracts';
import ContractDetails from './pages/ContractDetails';
import MyRequests from './pages/MyRequests';
import Rating from './pages/Rating';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Cart from './pages/Cart';
import Splash from './pages/Splash';
import PasswordRecovery from './pages/PasswordRecovery';

function App() {
  const { user } = useContext(AuthContext);

  const getDashboardRoute = () => {
    if (!user) return '/login';
    return user.role === 'pyme' ? '/dashboard/pyme' : '/dashboard/freelancer';
  };

  return (
    <Routes>
      <Route path="/" element={!user ? <Splash /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/recovery" element={!user ? <PasswordRecovery /> : <Navigate to={getDashboardRoute()} />} />

      <Route path="/dashboard/pyme" element={user && user.role === 'pyme' ? <DashboardPYME /> : <Navigate to="/login" />} />
      <Route path="/dashboard/freelancer" element={user && user.role === 'freelancer' ? <DashboardFreelancer /> : <Navigate to="/login" />} />

      <Route path="/services" element={user ? <ServicesOffer /> : <Navigate to="/login" />} />
      <Route path="/services/create" element={user && user.role === 'freelancer' ? <CreateModifyService /> : <Navigate to="/login" />} />
      <Route path="/services/edit/:id" element={user && user.role === 'freelancer' ? <CreateModifyService /> : <Navigate to="/login" />} />
      <Route path="/services/manage" element={user && user.role === 'freelancer' ? <ServicesManage /> : <Navigate to="/login" />} />
      <Route path="/services/:id" element={user ? <ServiceDetail /> : <Navigate to="/login" />} />

      <Route path="/contracts/new/:serviceId" element={user && user.role === 'pyme' ? <NewContract /> : <Navigate to="/login" />} />
      <Route path="/contracts" element={user ? <MyContracts /> : <Navigate to="/login" />} />
      <Route path="/contracts/:id" element={user ? <ContractDetails /> : <Navigate to="/login" />} />
      <Route path="/requests" element={user && user.role === 'freelancer' ? <MyRequests /> : <Navigate to="/login" />} />


      <Route path="/rating" element={user ? <Rating /> : <Navigate to="/login" />} />

      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/profile/:userId" element={user ? <PublicProfile /> : <Navigate to="/login" />} />
      <Route path="/cart" element={user && user.role === 'pyme' ? <Cart /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? getDashboardRoute() : '/'} />} />
      
    </Routes>
  );
}

export default App;