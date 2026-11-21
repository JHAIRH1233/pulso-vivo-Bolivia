'use client';

import { FormEvent, useState } from 'react';

export function InstitutionLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/institution/session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(
          response.status === 503
            ? 'El acceso institucional no está configurado.'
            : 'No se pudo validar la contraseña.',
        );
        return;
      }
      window.location.reload();
    } catch (caught) {
      console.error('Could not sign in to institutional dashboard', caught);
      setError('No se pudo conectar con el servicio de acceso.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="institution-login">
      <p className="eyebrow">Rimay · Instituciones</p>
      <h1>Acceso al panel institucional</h1>
      <p>Ingresa la contraseña institucional para administrar las herramientas.</p>
      <form className="question-form" onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="institution-password">Contraseña</label>
          <input
            id="institution-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            maxLength={512}
          />
        </div>
        <button className="button button--primary" type="submit" disabled={busy}>
          {busy ? 'Validando…' : 'Ingresar'}
        </button>
      </form>
      {error && (
        <p className="form-message" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}
