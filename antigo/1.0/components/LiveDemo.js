'use client';

import { useEffect, useState } from 'react';

const ITENS = ['Fralda RN', 'Manta para o berço', 'Conjunto body + mijão', 'Toalhão de banho'];

export default function LiveDemo() {
  const [marcados, setMarcados] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setMarcados((m) => (m >= ITENS.length ? 0 : m + 1));
    }, 1100);
    return () => clearInterval(intervalo);
  }, []);

  const progresso = Math.round((marcados / ITENS.length) * 100);

  return (
    <div className="relative w-72 mx-auto">
      <div className="absolute -top-4 -left-4 w-full h-full rounded-card bg-sage/25 rotate-[-4deg]" />
      <div className="relative rounded-card bg-white border border-plum/10 shadow-xl p-5">
        <p className="font-display text-plum-dark text-lg mb-1 text-left">Mala do bebê</p>
        <div className="h-2 rounded-full bg-plum/10 overflow-hidden mb-4">
          <div className="h-full bg-marigold transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>
        <ul className="space-y-2.5 text-left">
          {ITENS.map((nome, i) => {
            const feito = i < marcados;
            return (
              <li key={nome} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    feito ? 'bg-sage border-sage' : 'border-plum/30'
                  }`}
                >
                  {feito && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className={`transition-colors duration-300 ${feito ? 'line-through text-ink/40' : 'text-ink'}`}>
                  {nome}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}