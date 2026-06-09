import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { User, MapPin, Briefcase } from 'lucide-react';

const DEPT_COLORS = {
  'San Salvador': 'bg-blue-100 text-blue-800',
  'La Libertad': 'bg-cyan-100 text-cyan-800',
  'Santa Ana': 'bg-green-100 text-green-800',
  'San Miguel': 'bg-orange-100 text-orange-800',
  'Usulután': 'bg-red-100 text-red-800',
  'Sonsonate': 'bg-yellow-100 text-yellow-800',
  'La Unión': 'bg-purple-100 text-purple-800',
  'La Paz': 'bg-pink-100 text-pink-800',
  'Chalatenango': 'bg-indigo-100 text-indigo-800',
  'Cuscatlán': 'bg-teal-100 text-teal-800',
  'Ahuachapán': 'bg-lime-100 text-lime-800',
  'Morazán': 'bg-fuchsia-100 text-fuchsia-800',
  'San Vicente': 'bg-rose-100 text-rose-800',
  'Cabañas': 'bg-emerald-100 text-emerald-800',
};

const SENTIMENT_COLORS = {
  a_favor: 'bg-verde text-white',
  neutral: 'bg-gray-400 text-white',
  en_contra: 'bg-rojo text-white'
};

const SENTIMENT_LABELS = {
  a_favor: 'A Favor',
  neutral: 'Neutral',
  en_contra: 'En Contra'
};

export default function PersonaCard({ result, index }) {
  const cardRef = useRef(null);
  const { profile, parsed, error } = result;
  
  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)',
        delay: Math.min(index * 100, 500)
      });
    }
  }, [index]);

  const deptColor = DEPT_COLORS[profile.department] || 'bg-gray-100 text-gray-800';
  const sentColor = parsed ? SENTIMENT_COLORS[parsed.sentimiento] : 'bg-gray-200';
  const sentLabel = parsed ? SENTIMENT_LABELS[parsed.sentimiento] : 'Error';

  return (
    <div ref={cardRef} className="card bg-white p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
      
      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0 ${deptColor}`}>
          {profile.avatarSeed?.charAt(0) || '👤'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h5 className="font-bold text-carbon truncate pr-2">
              {profile.sex === 'Masculino' ? 'Hombre' : 'Mujer'}, {profile.age} años
            </h5>
            <span className={`px-2 py-1 rounded-pill text-xs font-bold shrink-0 ${sentColor}`}>
              {sentLabel}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
            <Briefcase className="w-3 h-3" /> {profile.occupation}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
            <MapPin className="w-3 h-3" /> {profile.municipality}, {profile.department}
          </div>
        </div>
      </div>

      {/* Body: Reaction Text */}
      <div className="mt-2 bg-gray-50 rounded-xl p-3 text-sm text-carbon relative">
        <div className="absolute -top-2 left-4 text-2xl text-gray-300">"</div>
        <p className="italic relative z-10 line-clamp-3 hover:line-clamp-none transition-all">
          {error ? <span className="text-rojo">Error de inferencia: {error}</span> : parsed?.reaccion}
        </p>
      </div>
      
    </div>
  );
}
