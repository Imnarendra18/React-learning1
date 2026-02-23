import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Std from './CE30012026/student.jsx';
import TodoList from './materialui/todo_list.jsx';
// import ContactManager from './CE30012026/ContactManager.jsx';
// import Std from './CE30012026/student.jsx';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Std />
        <TodoList />
      </Container>
    </ThemeProvider>
  );
}

export default App;