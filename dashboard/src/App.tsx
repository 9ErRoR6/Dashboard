import React from 'react';
import { Routes, Route } from "react-router-dom";
import DashboardLayout from './containers';
import DefaultPage from './pages/defaultPage';
import Users from './pages/users';
import Error from './pages/errorPage';
import Signin from './pages/auth/signIn';
import SignUp from './pages/auth/signUp';
import EditUser from './pages/editUser';
import { useTypedSelector } from './hooks/useTypeSelector';
import UserProfile from './pages/UserProfile';
import ConfirmEmail from './pages/confirmEmail';

const App: React.FC = () => {
  const { isAuth, user } = useTypedSelector((store) => store.userReducer);
  return (
    <Routes>
      {isAuth && (
        <>
          {user.role === "Administrators" && (
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DefaultPage />} />
              <Route path="users" element={<Users />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path='userProfile' element={<UserProfile />} />
              <Route path='editUser' element={<EditUser />}></Route>
            </Route>
          )}
          {user.role === "Users" && (
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DefaultPage />} />
              <Route path="users" element={<Users />} />
              <Route path='userProfile' element={<UserProfile />} />
            </Route>
          )}
        </>
      )}
      <Route path="/" element={<Signin />} />
      <Route path="/dashboard/" element={<Signin />} />
      <Route path="/confirmEmail/" element={<ConfirmEmail />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default App;
