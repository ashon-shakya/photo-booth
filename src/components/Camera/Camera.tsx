import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from '../CountdownTimer/CountdownTimer';
import './Camera.css';

interface Props {
  onCapture: (dataUrl: string) => void;
  photoCount: number;
  totalPhotos: number;
}

export function Camera({ onCapture, photoCount, totalPhotos }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [counting, setCounting]   = useState(false);
  const [flashing, setFlashing]   = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      setHasCamera(devices.some((d) => d.kind === 'videoinput'));
    });
  }, []);

  const startCountdown = useCallback(() => {
    if (counting) return;
    setCounting(true);
  }, [counting]);

  const handleCountdownDone = useCallback(() => {
    setCounting(false);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 300);
      onCapture(imageSrc);
    }
  }, [onCapture]);

  return (
    <div className="camera-container">
      {/* Camera feed */}
      <div className="camera-viewport">
        {hasCamera ? (
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.95}
            videoConstraints={{ facingMode: 'user', width: 1280, height: 720 }}
            className="camera-feed"
            mirrored
          />
        ) : (
          <div className="camera-placeholder">
            <span>📷</span>
            <p>No camera detected</p>
          </div>
        )}

        {/* Corner guides */}
        <div className="camera-corners">
          {[0,1,2,3].map(i => <div key={i} className={`corner corner-${i}`} />)}
        </div>

        {/* Countdown overlay */}
        {counting && <CountdownTimer onDone={handleCountdownDone} />}

        {/* Flash effect */}
        <AnimatePresence>
          {flashing && (
            <motion.div
              className="camera-flash"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Photo counter */}
        <div className="camera-counter-badge">
          {Array.from({ length: totalPhotos }).map((_, i) => (
            <div
              key={i}
              className={`counter-dot ${i < photoCount ? 'done' : i === photoCount ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="camera-controls">
        <div className="photo-progress">
          <span className="photo-progress-label">Photo</span>
          <span className="photo-progress-number">{Math.min(photoCount + 1, totalPhotos)}</span>
          <span className="photo-progress-label">of {totalPhotos}</span>
        </div>

        <motion.button
          id="capture-btn"
          className={`shutter-btn ${counting ? 'counting' : ''}`}
          onClick={startCountdown}
          disabled={counting}
          whileHover={{ scale: counting ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="shutter-inner" />
        </motion.button>

        <div className="photo-hint">
          {counting ? 'Get ready…' : 'Click to take photo'}
        </div>
      </div>
    </div>
  );
}
