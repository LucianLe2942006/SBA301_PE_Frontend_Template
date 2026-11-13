import React from 'react';
import { Alert } from 'react-bootstrap';

// =========================================================================
// SYSTEM ALERT: DISPLAY ERROR / SUCCESS BANNER BELOW SCREEN TITLE
// =========================================================================
export default function SystemAlert({ alert, onClose }) {
  if (!alert || !alert.message) return null;

  return (
    <Alert
      variant={alert.type === 'error' ? 'danger' : 'success'}
      dismissible={!!onClose}
      onClose={onClose}
      className="my-3 py-2 shadow-sm"
    >
      {alert.type === 'success' ? '✓ ' : '⚠ '}
      {alert.message}
    </Alert>
  );
}
