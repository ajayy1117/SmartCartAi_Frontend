import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // After animation, navigate to login
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        localStorage.setItem('hasVisitedSplash', 'true');
        navigate('/login', { replace: true });
      }, 500); // Wait for exit animation
    }, 3200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="splash-screen-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Items flying into cart */}
            <motion.div
              initial={{ x: -100, y: -150, opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: 0.5 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeIn" }}
              style={{ position: 'absolute', fontSize: '32px', zIndex: 3 }}
            >
              👟
            </motion.div>
            
            <motion.div
              initial={{ x: 120, y: -120, opacity: 0, rotate: 45, scale: 0.5 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: 0.5 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeIn" }}
              style={{ position: 'absolute', fontSize: '32px', zIndex: 3 }}
            >
              📱
            </motion.div>

            <motion.div
              initial={{ x: -30, y: -160, opacity: 0, rotate: 180, scale: 0.5 }}
              animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: 0.5 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeIn" }}
              style={{ position: 'absolute', fontSize: '32px', zIndex: 3 }}
            >
              👜
            </motion.div>

            {/* Shopping Cart */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
              style={{
                fontSize: '64px',
                zIndex: 2,
                filter: 'drop-shadow(0px 10px 20px rgba(79, 70, 229, 0.4))'
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.25, 1], 
                  rotate: [0, -8, 8, 0] 
                }}
                transition={{ delay: 1.0, duration: 0.5, ease: "easeInOut" }}
              >
                🛒
              </motion.div>
            </motion.div>
            
            {/* Glow effect behind cart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.5, scale: 1.5 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 1,
                borderRadius: '50%'
              }}
            />
          </div>

          {/* Logo Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div style={{
              fontFamily: 'var(--head)',
              fontSize: '42px',
              fontWeight: 900,
              letterSpacing: '-.04em',
              color: '#ffffff'
            }}>
              Smart<span style={{ 
                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Cart</span><span style={{ fontSize: '18px', color: '#9ca3af', fontFamily: 'var(--mono)' }}>.AI</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.8 }}
              style={{
                fontSize: '13px',
                color: '#cbd5e1',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'var(--mono)',
                fontWeight: 600
              }}
            >
              Add. Save. Simplify.
            </motion.div>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            style={{ display: 'flex', gap: '8px', marginTop: '36px' }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#818cf8',
                  boxShadow: '0 0 10px rgba(129, 140, 248, 0.6)'
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
