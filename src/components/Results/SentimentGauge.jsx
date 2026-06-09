import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function SentimentGauge({ summary }) {
  const { a_favor = 0, neutral = 0, en_contra = 0, total = 0 } = summary || {};
  
  const favorRef = useRef(null);
  const neutralRef = useRef(null);
  const contraRef = useRef(null);
  const textRef = useRef(null);

  const pctFavor = total > 0 ? (a_favor / total) * 100 : 0;
  const pctNeutral = total > 0 ? (neutral / total) * 100 : 0;
  const pctContra = total > 0 ? (en_contra / total) * 100 : 0;

  useEffect(() => {
    if (total > 0) {
      // Animate the widths
      anime({
        targets: favorRef.current,
        width: [`0%`, `${pctFavor}%`],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: 200
      });
      anime({
        targets: neutralRef.current,
        width: [`0%`, `${pctNeutral}%`],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: 300
      });
      anime({
        targets: contraRef.current,
        width: [`0%`, `${pctContra}%`],
        easing: 'easeOutExpo',
        duration: 1500,
        delay: 400
      });
      
      // Counter animation for text
      if (textRef.current) {
        anime({
          targets: textRef.current,
          innerHTML: [0, total],
          round: 1,
          easing: 'easeOutExpo',
          duration: 1500
        });
      }
    }
  }, [total, pctFavor, pctNeutral, pctContra]);

  if (total === 0) return null;

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center justify-center text-center">
      <h3 className="text-xl font-bold text-carbon mb-6">Impacto General Predicho</h3>
      
      {/* Big Number */}
      <div className="mb-8">
        <span ref={textRef} className="text-6xl font-black text-carbon font-mono">0</span>
        <span className="text-gray-400 font-bold ml-2">Perfiles Evaluados</span>
      </div>

      {/* Stacked Bar Gauge */}
      <div className="w-full h-8 flex rounded-full overflow-hidden shadow-inner bg-gray-100 mb-6">
        <div ref={favorRef} className="h-full bg-verde flex items-center justify-center" style={{ width: '0%' }}></div>
        <div ref={neutralRef} className="h-full bg-gray-400 flex items-center justify-center" style={{ width: '0%' }}></div>
        <div ref={contraRef} className="h-full bg-rojo flex items-center justify-center" style={{ width: '0%' }}></div>
      </div>

      {/* Legend */}
      <div className="flex justify-between w-full max-w-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-verde font-mono">{pctFavor.toFixed(1)}%</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">A Favor</div>
          <div className="text-xs text-gray-400">{a_favor} personas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-500 font-mono">{pctNeutral.toFixed(1)}%</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Neutral</div>
          <div className="text-xs text-gray-400">{neutral} personas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-rojo font-mono">{pctContra.toFixed(1)}%</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">En Contra</div>
          <div className="text-xs text-gray-400">{en_contra} personas</div>
        </div>
      </div>
    </div>
  );
}
