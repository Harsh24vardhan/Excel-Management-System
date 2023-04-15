
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Login from './Component/Login';
import Signup from './Component/Signup';
import Upload from './Component/Upload';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/upload" element={<Upload />}></Route>
      </Routes>
    </div>
  );
}

export default App;
