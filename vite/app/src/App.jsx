import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Tikrinti from '@/pages/Tikrinti';
import Apie from '@/pages/Apie';
import Pro from '@/pages/Pro';
import PrivatumoPolitika from '@/pages/PrivatumoPolitika';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <div
        className="parent-container"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh' }}
      >
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tikrinti" element={<Tikrinti />} />
            <Route path="/apie" element={<Apie />} />
            <Route path="/pro" element={<Pro />} />
            <Route path="/privatumo-politika" element={<PrivatumoPolitika />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
