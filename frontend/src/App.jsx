import './App.css'
// import { Home } from './pages/homePage';
import { Register } from './pages/Register';
import { Routes, Route } from 'react-router-dom';
import { House } from './pages/house';
import Login from './pages/login';
import { NotFound } from './pages/404';
import { Navbar } from './pages/navbar';
import { UserProvider } from './contexts/userContext';
import { AuthProvider } from './contexts/authContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdvancedSearch } from './pages/AdvancedSearch';
import { HouseForm } from './pages/HouseForm';
import { Home } from './pages/home';

function App() {
  return (
      <UserProvider>
        <AuthProvider>
          <Navbar />
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/house/search" element={<AdvancedSearch />} />
                <Route path="/" element={<Home />} />
                <Route path="/auth/user/new/register" element={<Register />} />
                <Route path="/auth/user/login" element={<Login />} />
               <Route path="/house/:slug" element={<House />} />
                <Route path="auth/house/new/list" element={<HouseForm />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          <ToastContainer position="top-right" autoClose={5000} />
        </AuthProvider>
      </UserProvider>
  );
}
export default App;