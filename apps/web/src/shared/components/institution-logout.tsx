'use client';

import { useState } from 'react';

export function InstitutionLogout() {
  const [error, setError] = useState('');

  async function logout() {
    setError('');
    try {
      const response = await fetch('/api/institution/session', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('No se pudo cerrar la sesión.');
      }
      window.location.reload();
    } catch (error) {
      console.error('Could not sign out from institutional dashboard', error);
      setError('No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  }

  return (
    <div className="institution-logout">
      <button className="button button--secondary" type="button" onClick={logout}>
        Cerrar sesión
      </button>
      {error && (
        <span className="form-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
