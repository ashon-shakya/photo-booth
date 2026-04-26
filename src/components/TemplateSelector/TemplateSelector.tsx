import { motion } from 'framer-motion';
import { TEMPLATES } from '../../templates/config';
import './TemplateSelector.css';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="template-grid">
      {TEMPLATES.map((t, i) => (
        <motion.button
          key={t.id}
          id={`template-${t.id}`}
          className={`template-card ${selected === t.id ? 'selected' : ''}`}
          onClick={() => onSelect(t.id)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ y: -6, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{ '--accent': t.accent } as React.CSSProperties}
        >
          <div className="template-preview" style={{ background: t.gradient }}>
            <div className="template-preview-inner">
              {/* Mini layout preview */}
              <LayoutPreview id={t.id} />
            </div>
            {selected === t.id && (
              <motion.div
                className="template-selected-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                ✓
              </motion.div>
            )}
          </div>
          <div className="template-info">
            <span className="template-icon">{t.icon}</span>
            <div>
              <div className="template-name">{t.name}</div>
              <div className="template-desc">{t.description}</div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function LayoutPreview({ id }: { id: string }) {
  const box = 'rgba(255,255,255,0.18)';
  const style: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 };

  switch (id) {
    case 'classic-strip':
      return <div style={{ ...style, flexDirection: 'column', gap: 3 }}>
        {[1,2,3].map(n => <div key={n} style={{ background: box, width: '75%', height: '27%', borderRadius: 2 }} />)}
      </div>;
    case 'newspaper':
      return <div style={{ ...style, flexDirection: 'column', gap: 3, padding: '6px' }}>
        <div style={{ background: 'rgba(255,255,255,0.3)', width: '90%', height: '12%', borderRadius: 1 }} />
        <div style={{ display:'flex', gap:3, width:'90%', flex:1 }}>
          {[1,2,3].map(n => <div key={n} style={{ background: box, flex:1, borderRadius: 1 }} />)}
        </div>
      </div>;
    case 'columns':
      return <div style={{ ...style, gap: 3 }}>
        {[1,2,3].map(n => <div key={n} style={{ background: box, flex:1, height: '80%', borderRadius: 2 }} />)}
      </div>;
    case 'polaroid':
      return <div style={{ ...style, position:'relative', overflow:'visible' }}>
        {[{x:-14,y:-8,r:-8},{x:0,y:6,r:4},{x:14,y:-4,r:-3}].map((p,i) => (
          <div key={i} style={{ position:'absolute', background: '#fff', width: 26, height: 30, borderRadius: 1, transform: `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`, padding: 2 }}>
            <div style={{ background: box, width: '100%', height: '78%' }} />
          </div>
        ))}
      </div>;
    case 'film-reel':
      return <div style={{ ...style, flexDirection: 'column', gap: 0 }}>
        <div style={{ width:'100%', height:'18%', background:'rgba(255,255,255,0.08)', display:'flex', gap:2, padding:'2px 4px', alignItems:'center' }}>
          {[1,2,3,4,5].map(n => <div key={n} style={{ background:'rgba(0,0,0,0.4)', flex:1, height:'55%', borderRadius: 1 }} />)}
        </div>
        <div style={{ display:'flex', gap:3, padding:'0 4px', flex:1, alignItems:'center' }}>
          {[1,2,3].map(n => <div key={n} style={{ background: box, flex:1, height:'85%', borderRadius: 1 }} />)}
        </div>
        <div style={{ width:'100%', height:'18%', background:'rgba(255,255,255,0.08)', display:'flex', gap:2, padding:'2px 4px', alignItems:'center' }}>
          {[1,2,3,4,5].map(n => <div key={n} style={{ background:'rgba(0,0,0,0.4)', flex:1, height:'55%', borderRadius: 1 }} />)}
        </div>
      </div>;
    case 'magazine':
      return <div style={{ ...style, flexDirection: 'column', gap: 3, padding: 4 }}>
        <div style={{ background: box, width: '100%', flex: 2, borderRadius: 2 }} />
        <div style={{ display:'flex', gap:3, width:'100%', flex:1 }}>
          <div style={{ background: box, flex:1, borderRadius: 2 }} />
          <div style={{ background: box, flex:1, borderRadius: 2 }} />
        </div>
      </div>;
    case 'scrapbook':
      return <div style={{ ...style, position:'relative' }}>
        {[{x:-12,y:-10,r:-7},{x:4,y:4,r:5},{x:-4,y:12,r:-3}].map((p,i) => (
          <div key={i} style={{ position:'absolute', background: '#fff', width: 28, height: 24, borderRadius: 1, transform: `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`, padding: 2 }}>
            <div style={{ background: box, width: '100%', height: '80%' }} />
          </div>
        ))}
      </div>;
    default: return null;
  }
}
