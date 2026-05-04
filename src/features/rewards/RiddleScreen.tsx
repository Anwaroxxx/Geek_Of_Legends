// ============================================
// RIDDLE SCREEN — Boss puzzle phase
// ============================================
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useBattleStore } from '../../store/battleStore';
import { getRandomRiddle } from '../../data/riddles/riddleData';
import { RIDDLE_TRIES_MAX } from '../../constants/balance';
import type { RiddleQuestion } from '../../types/Game';

export default function RiddleScreen() {
  const setPhase = useGameStore((s) => s.setPhase);
  const boss = useBattleStore((s) => s.boss);
  const [riddle, setRiddle] = useState<RiddleQuestion | null>(null);
  const [answer, setAnswer] = useState('');
  const [triesLeft, setTriesLeft] = useState(RIDDLE_TRIES_MAX);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [memoryPhase, setMemoryPhase] = useState<'show' | 'input' | null>(null);
  const [memoryInput, setMemoryInput] = useState<string[]>([]);

  // Load riddle
  useEffect(() => {
    const r = getRandomRiddle();
    setRiddle(r);
    setTimeLeft(r.timeLimit || 30);

    if (r.type === 'memory') {
      setMemoryPhase('show');
      setTimeout(() => setMemoryPhase('input'), (r.timeLimit || 10) * 1000);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleWrong();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleWrong = useCallback(() => {
    setFeedback('wrong');
    const newTries = triesLeft - 1;
    setTriesLeft(newTries);

    if (newTries <= 0) {
      setTimeout(() => setPhase('death'), 1500);
    } else {
      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
        const r = getRandomRiddle();
        setRiddle(r);
        setTimeLeft(r.timeLimit || 30);
      }, 1500);
    }
  }, [triesLeft, setPhase]);

  const handleSubmit = useCallback(() => {
    if (!riddle) return;

    const isCorrect = answer.toLowerCase().trim() === riddle.answer.toLowerCase().trim();

    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => setPhase('victory'), 2000);
    } else {
      handleWrong();
    }
  }, [riddle, answer, setPhase, handleWrong]);

  const handleOptionSelect = useCallback((option: string) => {
    if (!riddle) return;
    setAnswer(option);

    const isCorrect = option.toLowerCase().trim() === riddle.answer.toLowerCase().trim();
    if (isCorrect) {
      setFeedback('correct');
      setTimeout(() => setPhase('victory'), 2000);
    } else {
      handleWrong();
    }
  }, [riddle, setPhase, handleWrong]);

  const handleMemoryInput = useCallback((symbol: string) => {
    const newInput = [...memoryInput, symbol];
    setMemoryInput(newInput);

    if (riddle && newInput.length === (riddle.sequence?.length || 0)) {
      const isCorrect = newInput.join('') === riddle.sequence?.join('');
      if (isCorrect) {
        setFeedback('correct');
        setTimeout(() => setPhase('victory'), 2000);
      } else {
        handleWrong();
        setMemoryInput([]);
      }
    }
  }, [riddle, memoryInput, setPhase, handleWrong]);

  if (!riddle) return null;

  const timerPercent = (timeLeft / (riddle.timeLimit || 30)) * 100;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #05030a 0%, #120a22 50%, #1a0b2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: 30, zIndex: 2 }}
      >
        <h2 style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: '1.8rem',
          color: '#a855f7',
          textShadow: '0 0 20px rgba(168,85,247,0.6)',
          marginBottom: 6,
        }}>
          🔮 Ancient Riddle
        </h2>
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.8rem',
          color: '#8b7aa8',
          letterSpacing: '0.1em',
        }}>
          {boss?.name} challenges your mind — answer to seal the victory!
        </p>
      </motion.div>

      {/* Timer bar */}
      <div style={{
        width: 400, maxWidth: '90%',
        marginBottom: 24, zIndex: 2,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: '0.7rem', color: '#8b7aa8', marginBottom: 4,
        }}>
          <span>Time</span>
          <span style={{ color: timeLeft <= 5 ? '#ef4444' : '#c5a059' }}>
            {timeLeft}s
          </span>
        </div>
        <div style={{
          width: '100%', height: 6,
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 3,
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: timeLeft <= 5
                ? 'linear-gradient(90deg, #991b1b, #ef4444)'
                : 'linear-gradient(90deg, #7c3aed, #a855f7)',
              borderRadius: 3,
              boxShadow: timeLeft <= 5 ? '0 0 10px rgba(239,68,68,0.6)' : '0 0 8px rgba(168,85,247,0.4)',
            }}
          />
        </div>
      </div>

      {/* Riddle content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: 500, maxWidth: '90%',
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(18,14,34,0.95) 0%, rgba(13,10,24,0.98) 100%)',
          border: '1px solid rgba(168,85,247,0.3)',
          borderRadius: 12,
          boxShadow: '0 0 30px rgba(168,85,247,0.15)',
          zIndex: 2,
        }}
      >
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1rem',
          color: '#e2d9f3',
          textAlign: 'center',
          lineHeight: 1.7,
          marginBottom: 24,
        }}>
          {riddle.prompt}
        </p>

        {/* Memory sequence display */}
        {riddle.type === 'memory' && memoryPhase === 'show' && riddle.sequence && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12,
            marginBottom: 20,
          }}>
            {riddle.sequence.map((s, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.5 }}
                style={{ fontSize: '2.5rem' }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        )}

        {/* Memory input */}
        {riddle.type === 'memory' && memoryPhase === 'input' && (
          <div>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16,
              minHeight: 40,
            }}>
              {memoryInput.map((s, i) => (
                <span key={i} style={{ fontSize: '1.8rem' }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {['🔥', '❄️', '⚡', '🌑'].map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMemoryInput(s)}
                  style={{
                    fontSize: '2rem', padding: '8px 12px',
                    background: 'rgba(168,85,247,0.15)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    borderRadius: 8, cursor: 'pointer',
                  }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Multiple choice */}
        {riddle.options && riddle.type !== 'memory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {riddle.options.map((opt) => (
              <motion.button
                key={opt}
                whileHover={{ borderColor: '#a855f7', x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOptionSelect(opt)}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(26,11,46,0.5)',
                  border: '1px solid rgba(42,32,64,0.6)',
                  borderRadius: 6,
                  color: '#e2d9f3',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        )}

        {/* Text input (logic / typing) */}
        {!riddle.options && riddle.type !== 'memory' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your answer..."
              autoFocus
              style={{
                flex: 1,
                padding: '10px 14px',
                background: 'rgba(5,3,10,0.8)',
                border: '1px solid rgba(42,32,64,0.6)',
                borderRadius: 6,
                color: '#e2d9f3',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Submit
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: feedback === 'correct' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              zIndex: 50,
            }}
          >
            <div style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '3rem',
              fontWeight: 900,
              color: feedback === 'correct' ? '#4ade80' : '#ef4444',
              textShadow: feedback === 'correct'
                ? '0 0 30px rgba(74,222,128,0.8)'
                : '0 0 30px rgba(239,68,68,0.8)',
            }}>
              {feedback === 'correct' ? '✨ Correct!' : '❌ Wrong!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tries & Hint */}
      <div style={{
        marginTop: 20,
        display: 'flex', gap: 20, alignItems: 'center',
        zIndex: 2,
      }}>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.75rem',
          color: triesLeft <= 1 ? '#ef4444' : '#8b7aa8',
        }}>
          Attempts: {triesLeft}/{RIDDLE_TRIES_MAX}
        </span>

        {riddle.hint && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            style={{
              background: 'none', border: 'none',
              color: '#c5a059', fontSize: '0.75rem',
              cursor: 'pointer', fontFamily: "'Cinzel', serif",
            }}
          >
            💡 Show Hint
          </button>
        )}

        {showHint && (
          <span style={{ fontSize: '0.75rem', color: '#c5a059', fontStyle: 'italic' }}>
            Hint: {riddle.hint}
          </span>
        )}
      </div>
    </div>
  );
}
