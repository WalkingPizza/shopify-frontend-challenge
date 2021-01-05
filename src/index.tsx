import React from 'react';
import ReactDOM from 'react-dom';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SharedList from './SharedList/SharedList';

ReactDOM.render(
  <Router>
    <AppProvider i18n={enTranslations}>
      <Route exact path="/" component={App} />
      <Route path="/list/:nominations" component={SharedList} />
    </AppProvider>
  </Router>,
  document.querySelector('#root'),
);
reportWebVitals();
