import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import UserProfile from './routes/user_profile';
import Layout from './components/layout';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route element={<Layout><UserProfile /></Layout>} path='/:username' />
          <Route element={<LoginPage />} path='/login' />
          <Route element={<RegisterPage />} path='/register' />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
