import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Toolkit } from './pages/Toolkit';

function SuccessBanner() {
  const [params] = useSearchParams();
  const success = params.get('success');
  const canceled = params.get('canceled');
  if (!success && !canceled) return null;
  return (
    <div className={`fixed top-16 inset-x-0 z-40 px-6 py-3 text-center text-sm font-medium ${success ? 'bg-emerald-900/80 text-emerald-100' : 'bg-rose-900/80 text-rose-100'}`}>
      {success === 'true' && '🎉 Payment confirmed. Check your email for toolkit access.'}
      {success === 'call' && '✅ Call booked. See you then.'}
      {canceled === 'true' && 'Checkout canceled. No charge was made.'}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <SuccessBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toolkit" element={<Toolkit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
