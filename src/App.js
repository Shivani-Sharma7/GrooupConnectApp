import './App.css';
import './ChatPage.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import ChatPage from './Components/ChatPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ChatPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
