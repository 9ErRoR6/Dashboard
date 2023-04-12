import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from "./store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAccessToken } from './services/api-user-service';
import { AuthUser } from './store/action-creators/userActions';

const token = getAccessToken();
if (token) {
  AuthUser(token, "Loaded from local storrage.", store.dispatch);
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer autoClose={5000} />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
