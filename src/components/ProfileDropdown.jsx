import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * ProfileDropdown
 *
 * The dropdown is rendered with position:fixed, coordinates calculated
 * from the button's bounding rect. This escapes ALL stacking contexts
 * (sticky headers, backdrop-filter, transform, etc.) on every browser.
 */
const ProfileDropdown = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [dropPos, setDropPos]     = useState({ top: 0, right: 0 });
  const buttonRef                 = useRef(null);
  const dropdownRef               = useRef(null);
  const { logout, user }          = useAuth();
  const navigate                  = useNavigate();

  // Recalculate position whenever dropdown opens
  const recalcPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setDropPos({
      top:   rect.bottom + 6,                        // 6px gap below button
      right: window.innerWidth - rect.right,         // align to right edge of button
    });
  }, []);

  const handleToggle = () => {
    if (!isOpen) recalcPosition();
    setIsOpen(o => !o);
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [isOpen]);

  // Close on scroll / resize (position would be stale)
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('scroll', close, { passive: true, capture: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#f1f5f9',
          border: '1.5px solid #e2e8f0',
          padding: '6px 10px 6px 7px',
          borderRadius: 999,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          maxWidth: '100%',
          flexShrink: 0,
        }}
      >
        {/* Avatar circle */}
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#2563eb,#4f46e5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FiUser style={{ color: '#fff', width: 14, height: 14 }} />
        </div>

        {/* Name — hidden on very small screens */}
        <span className="hidden sm:block" style={{
          fontSize: 13, fontWeight: 600, color: '#374151',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          maxWidth: 110,
        }}>
          {user?.name || 'User'}
        </span>

        {/* Chevron */}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <FiChevronDown style={{ color: '#6b7280', width: 14, height: 14, flexShrink: 0 }} />
        </motion.div>
      </button>

      {/* ── Dropdown — rendered with position:fixed to escape stacking contexts ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              top: dropPos.top,
              right: dropPos.right,
              zIndex: 99999,           // always on top
              minWidth: 180,
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              boxShadow: '0 12px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* User info header */}
            <div style={{
              padding: '14px 16px 12px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, textTransform: 'capitalize' }}>
                {user?.role || 'Member'}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: '#dc2626',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'left',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiLogOut size={15} style={{ color: '#dc2626' }} />
              </div>
              Log Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileDropdown;