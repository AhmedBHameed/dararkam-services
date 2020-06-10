import React from 'react';
import 'normalize.css';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from './styles/theme';
// import logo from './logo.svg';
import './App.scss';
import Home from './pages/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
