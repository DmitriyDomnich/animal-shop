import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import { store } from 'rdx';
import { Provider } from 'react-redux';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
