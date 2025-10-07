'use client';
import { useState } from 'react';
import LoginModal from '../LoginModal';

export default function LoginPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {showModal && (
        <LoginModal
          onLoginSuccess={() => setShowModal(false)}
          onBack={() => setShowModal(false)}
          onShowSignup={() => { window.location.href = '/'; }}
        />
      )}
    </>
  );
}
