import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TemplateSelector } from '../components/TemplateSelector/TemplateSelector';
import { usePhotoSession } from '../hooks/usePhotoSession';
import './LandingPage.css';

interface Props {
  session: ReturnType<typeof usePhotoSession>;
}

export function LandingPage({ session }: Props) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (session.session.templateId) {
      session.resetToTemplate();
      navigate('/camera');
    }
  };

  return (
    <div className="landing-page page">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="landing-content">
        {/* Hero */}
        <motion.div
          className="landing-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            📸 Photo Booth
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Strike a pose.<br />
            <span className="gradient-text">Make memories.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Pick a template, take 3 photos, and download your perfectly styled photo strip — no app needed.
          </motion.p>
        </motion.div>

        {/* Template picker */}
        <motion.section
          className="template-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <h2 className="section-title">Choose your template</h2>
          <TemplateSelector
            selected={session.session.templateId}
            onSelect={session.selectTemplate}
          />
        </motion.section>

        {/* CTA */}
        <motion.div
          className="landing-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            id="start-btn"
            className="btn-primary btn-lg"
            onClick={handleStart}
            disabled={!session.session.templateId}
            whileHover={{ scale: session.session.templateId ? 1.04 : 1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Start Session</span>
            <span>→</span>
          </motion.button>
          {!session.session.templateId && (
            <p className="cta-hint">Select a template above to continue</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
