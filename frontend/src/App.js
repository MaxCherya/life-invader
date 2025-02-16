import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import UserProfile from './routes/user_profile';
import Layout from './components/layout';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from './components/private_route';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout><PrivateRoute><UserProfile /></PrivateRoute></Layout>} path='/:username' />
            <Route element={<LoginPage />} path='/login' />
            <Route element={<RegisterPage />} path='/register' />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
