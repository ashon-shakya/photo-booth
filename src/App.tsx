import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { usePhotoSession } from './hooks/usePhotoSession';
import { LandingPage } from './pages/LandingPage';
import { CameraPage } from './pages/CameraPage';
import { ResultPage } from './pages/ResultPage';

function AnimatedRoutes() {
  const location = useLocation();
  const photoSession = usePhotoSession();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"       element={<LandingPage session={photoSession} />} />
        <Route path="/camera" element={<CameraPage  session={photoSession} />} />
        <Route path="/result" element={<ResultPage  session={photoSession} />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
