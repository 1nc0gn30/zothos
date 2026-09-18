import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Toolkit } from './pages/Toolkit';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toolkit" element={<Toolkit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;