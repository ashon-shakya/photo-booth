import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Camera } from '../components/Camera/Camera';
import { usePhotoSession } from '../hooks/usePhotoSession';
import { TEMPLATES } from '../templates/config';
import './CameraPage.css';

interface Props {
  session: ReturnType<typeof usePhotoSession>;
}

export function CameraPage({ session }: Props) {
  const navigate = useNavigate();
  const { session: s, addPhoto, retakePhoto, isDone, reset } = session;

  const template = TEMPLATES.find((t) => t.id === s.templateId);

  useEffect(() => {
    if (!s.templateId) navigate('/');
  }, [s.templateId, navigate]);

  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => navigate('/result'), 600);
      return () => clearTimeout(timer);
    }
  }, [isDone, navigate]);

  if (!template) return null;

  return (
    <div className="camera-page page">
      <div className="bg-orb bg-orb-1" />

      <div className="camera-page-content">
        {/* Header */}
        <div className="camera-page-header">
          <motion.button
            className="btn-ghost back-btn"
            onClick={() => navigate('/')}
            whileHover={{ x: -3 }}
          >
            ← Back
          </motion.button>

          <div className="template-badge">
            <span>{template.icon}</span>
            <span>{template.name}</span>
          </div>

          <div style={{ width: 80 }} />
        </div>

        {/* Camera */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Camera
            onCapture={addPhoto}
            photoCount={s.photos.length}
            totalPhotos={3}
          />
        </motion.div>

        {/* Thumbnail strip */}
        <div className="photo-strip-preview">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`thumb-slot ${s.photos[i] ? 'filled' : s.photos.length === i ? 'next' : 'empty'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <AnimatePresence>
                {s.photos[i] ? (
                  <motion.div
                    className="thumb-inner"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <img src={s.photos[i]} alt={`Photo ${i + 1}`} />
                    <button
                      id={`retake-${i}`}
                      className="retake-btn"
                      onClick={() => retakePhoto(i)}
                      title="Retake this photo"
                    >
                      ↺
                    </button>
                  </motion.div>
                ) : (
                  <motion.div className="thumb-placeholder" key="placeholder">
                    <span className="thumb-number">{i + 1}</span>
                    {s.photos.length === i && <div className="thumb-pulse" />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Reset */}
        <div className="camera-page-actions">
          <button className="btn-ghost" id="reset-session-btn" onClick={reset}>
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
