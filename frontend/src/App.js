import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google';

import UserProfile from './routes/user_profile';
import Layout from './components/layout';
import LoginPage from './routes/login';
import RegisterPage from './routes/register';
import { AuthProvider } from "./contexts/useAuth";
import PrivateRoute from './components/private_route';
import CreatePostPage from './routes/create_post';
import Feed from './routes/feed';
import Search from './routes/search';
import Settings from './routes/settings';

function App() {
  return (
    <ChakraProvider>
      <GoogleOAuthProvider clientId="919797402039-e2vuojboon1d2l2rib89ocsdvnvjlteq.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<Layout><PrivateRoute><UserProfile /></PrivateRoute></Layout>} path='/:username' />
              <Route element={<LoginPage />} path='/login' />
              <Route element={<RegisterPage />} path='/register' />
              <Route element={<Layout><PrivateRoute><CreatePostPage /></PrivateRoute></Layout>} path='/create-post' />
              <Route element={<Layout><PrivateRoute><Feed /></PrivateRoute></Layout>} path='/feed' />
              <Route element={<Layout><PrivateRoute><Search /></PrivateRoute></Layout>} path='/search' />
              <Route element={<Layout><PrivateRoute><Settings /></PrivateRoute></Layout>} path='/settings' />
            </Routes>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </ChakraProvider>
  );
}

export default App;
