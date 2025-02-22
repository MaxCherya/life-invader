import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import UserProfile from './routes/user_profile';
import Layout from './components/layout';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from './components/private_route';
import CreatePostPage from './routes/create_post';
import Feed from './routes/feed';
import Search from './routes/search';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<Layout><PrivateRoute><UserProfile /></PrivateRoute></Layout>} path='/:username' />
            <Route element={<LoginPage />} path='/login' />
            <Route element={<RegisterPage />} path='/register' />
            <Route element={<Layout><PrivateRoute><CreatePostPage /></PrivateRoute></Layout>} path='/create-post' />
            <Route element={<Layout><PrivateRoute><Feed /></PrivateRoute></Layout>} path='/feed' />
            <Route element={<Layout><PrivateRoute><Search /></PrivateRoute></Layout>} path='/search' />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
