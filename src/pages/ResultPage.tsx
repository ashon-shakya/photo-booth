import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePhotoSession } from '../hooks/usePhotoSession';
import { TEMPLATES } from '../templates/config';
import { renderTemplate } from '../templates';
import './ResultPage.css';

interface Props {
  session: ReturnType<typeof usePhotoSession>;
}

const OUTPUT_WIDTH = 1200;

export function ResultPage({ session }: Props) {
  const navigate = useNavigate();
  const { session: s, reset, resetToTemplate } = session;
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const template = TEMPLATES.find((t) => t.id === s.templateId);

  useEffect(() => {
    if (!s.templateId || s.photos.length < 3) { navigate('/'); return; }
  }, []);

  const generate = useCallback(async () => {
    if (!template || s.photos.length < 3) return;
    setLoading(true);
    try {
      const w = OUTPUT_WIDTH;
      const h = Math.round(w / template.aspectRatio);
      const url = await renderTemplate(template.id, s.photos, w, h);
      setResultUrl(url);
    } finally {
      setLoading(false);
    }
  }, [template, s.photos]);

  useEffect(() => { generate(); }, [generate]);

  const handleDownload = () => {
    if (!resultUrl) return;
    setDownloading(true);
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `photo-booth-${template?.id ?? 'strip'}-${Date.now()}.png`;
    a.click();
    setTimeout(() => setDownloading(false), 1200);
  };

  if (!template) return null;

  return (
    <div className="result-page page">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="result-content">
        {/* Header */}
        <div className="result-header">
          <motion.button
            className="btn-ghost back-btn"
            onClick={() => navigate('/camera')}
            whileHover={{ x: -3 }}
          >
            ← Retake
          </motion.button>
          <div className="template-badge">
            <span>{template.icon}</span>
            <span>{template.name}</span>
          </div>
          <div style={{ width: 80 }} />
        </div>

        {/* Result title */}
        <motion.div
          className="result-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Your <span className="gradient-text">Photo Strip</span> is ready!</h1>
          <p>Download it, share it, or try another template.</p>
        </motion.div>

        {/* Canvas preview */}
        <motion.div
          className="result-preview-wrapper"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: loading ? 0.3 : 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="result-loading">
              <div className="spinner" />
              <span>Developing your photos…</span>
            </div>
          ) : resultUrl ? (
            <img
              id="result-image"
              src={resultUrl}
              alt="Your photo strip"
              className="result-image"
            />
          ) : null}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </motion.div>

        {/* Actions */}
        <motion.div
          className="result-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            id="download-btn"
            className="btn-primary btn-lg"
            onClick={handleDownload}
            disabled={loading || !resultUrl}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {downloading ? '✓ Saved!' : '⬇  Download PNG'}
          </motion.button>

          <button
            id="try-template-btn"
            className="btn-ghost"
            onClick={() => { resetToTemplate(); navigate('/camera'); }}
          >
            📷 Retake Photos
          </button>

          <button
            id="new-session-btn"
            className="btn-ghost"
            onClick={() => { reset(); navigate('/'); }}
          >
            ✦ New Template
          </button>
        </motion.div>

        {/* Thumbnail row */}
        <motion.div
          className="result-thumbs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {s.photos.map((photo, i) => (
            <div key={i} className="result-thumb">
              <img src={photo} alt={`Photo ${i + 1}`} />
              <span className="result-thumb-num">{i + 1}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
