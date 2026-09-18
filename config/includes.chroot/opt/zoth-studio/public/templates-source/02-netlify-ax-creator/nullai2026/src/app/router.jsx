import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Studio from '../pages/Studio';
import Profile from '../pages/Profile';
import Feed from '../pages/Feed'; 
import Tools from '../pages/Tools';
import NotFound from '../pages/NotFound';
import Nodes from '../pages/Nodes';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/zoth" element={<Studio />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/nodes" element={<Nodes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
