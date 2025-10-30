import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Analysis from './pages/Analysis';
import About from './pages/About';
import NotFound from './pages/NotFound';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/analyze" element={<Analysis />} />
      <Route path="/about" element={<About />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
