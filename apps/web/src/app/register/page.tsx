'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DEPARTMENTS = [
  'Cochabamba',
  'La Paz',
  'Santa Cruz',
  'Oruro',
  'Potosí',
  'Chuquisaca',
  'Tarija',
  'Beni',
  'Pando',
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Cochabamba');
  const [municipality, setMunicipality] = useState('');
  const [language, setLanguage] = useState('Bilingüe (Español / Quechua)');
  const [role, setRole] = useState('Ciudadano');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative ambient background blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl sm:p-9">
          {/* Logo & Heading */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <Image
                src="/rimay-logo.png"
                alt="Rimay"
                width={120}
                height={38}
                className="mx-auto h-9 w-auto"
                priority
              />
            </Link>
            <h1 className="mt-4 font-heading text-2xl font-black text-foreground sm:text-3xl">
              Crea tu cuenta en Rimay
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Tu voz cuenta. Recibe comunicados claros, audios en quechua y respuestas a tus trámites.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-2xl bg-red-500/10 p-3 text-xs font-medium text-red-700" role="alert">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                Nombre completo
              </label>
              <input
                type="text"
                required
                placeholder="Ej. María Flores Mamani"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                placeholder="maria.flores@ejemplo.bo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Departamento
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Municipio / Zona
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cercado, Quillacollo"
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Preferencia de idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Bilingüe (Español / Quechua)">Bilingüe (Español / Quechua)</option>
                  <option value="Quechua prioritario">Quechua prioritario</option>
                  <option value="Español simple">Español simple</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Tipo de usuario
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Ciudadano">Ciudadano</option>
                  <option value="Líder vecinal / OTB">Líder vecinal / OTB</option>
                  <option value="Voluntario / Traductor">Voluntario / Traductor</option>
                  <option value="Funcionario institucional">Funcionario institucional</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="ml-2 block text-xs leading-relaxed text-foreground/70">
                Acepto los términos de uso ciudadano y autorizo el uso de mis consultas de forma anónima para
                mejorar los comunicados municipales.
              </label>
            </div>

            {success ? (
              <div className="rounded-2xl bg-teal-500/10 p-3.5 text-center text-xs font-bold text-teal-700">
                ✓ ¡Cuenta creada con éxito! Redirigiendo a Rimay...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 hover:shadow-lg"
              >
                Crear mi cuenta
              </button>
            )}
          </form>

          {/* Bottom link to login */}
          <p className="mt-6 text-center text-xs font-medium text-foreground/70">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
