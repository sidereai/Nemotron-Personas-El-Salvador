import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { Activity, CheckCircle, Clock } from 'lucide-react';
import PersonaCard from './PersonaCard';

export default function SimulationRunner({ status, progress, results, quality, error }) {
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const isThinking = quality === 'mayor_calidad';
  
  const [pulseColor, setPulseColor] = useState('#3B82F6'); // cielo
  const [points, setPoints] = useState('0,50 1000,50');
  
  // Update heartbeat animation based on incoming results
  useEffect(() => {
    if (status !== 'processing') return;

    // We keep a history of points. X goes from 0 to 1000. Y baseline is 50.
    const newPoints = [];
    let currentX = 0;
    const stepX = Math.max(10, 1000 / (progress.total || 50));
    
    // Baseline start
    newPoints.push(`0,50`);
    
    for (let i = 0; i < progress.current; i++) {
      currentX += stepX;
      
      if (isThinking) {
        // Double peak for thinking mode
        newPoints.push(`${currentX - stepX*0.2},50`);
        newPoints.push(`${currentX - stepX*0.1},10`); // High peak
        newPoints.push(`${currentX},70`); // Low dip
        newPoints.push(`${currentX + stepX*0.1},20`); // Second peak
        newPoints.push(`${currentX + stepX*0.2},50`);
      } else {
        // Standard ECG peak
        newPoints.push(`${currentX - stepX*0.2},50`);
        newPoints.push(`${currentX},15`); // Peak
        newPoints.push(`${currentX + stepX*0.1},65`); // Dip
        newPoints.push(`${currentX + stepX*0.2},50`);
      }
    }
    
    // Extend to end
    newPoints.push(`1000,50`);
    
    setPoints(newPoints.join(' '));
    
    // Change color momentarily to green when a new result comes in
    setPulseColor('#10B981'); // verde
    const timer = setTimeout(() => {
      setPulseColor(isThinking ? '#F97316' : '#3B82F6'); // naranja or cielo
    }, 300);
    
    return () => clearTimeout(timer);
  }, [progress.current, isThinking, status]);

  // Animate the path drawing continuously
  useEffect(() => {
    if (status === 'processing' && pathRef.current) {
      anime({
        targets: pathRef.current,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        duration: 2000,
        loop: true,
      });
    }
  }, [status]);

  if (status === 'idle') return null;

  if (status === 'error') {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up">
        <div className="card p-8 bg-rojo/10 border-2 border-rojo/30 text-center rounded-2xl">
          <div className="mx-auto w-16 h-16 bg-rojo/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-rojo font-bold text-2xl">!</span>
          </div>
          <h3 className="text-xl font-bold text-rojo mb-2">Simulación Interrumpida</h3>
          <p className="text-gray-700 font-medium">{error || "Ocurrió un error inesperado durante la simulación."}</p>
          <p className="mt-4 text-sm text-gray-500">Tu límite diario no ha sido afectado.</p>
        </div>
      </div>
    );
  }

  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up">
      <div className="card p-6 bg-carbon text-nube">
        
        {/* Header Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Activity className={`w-6 h-6 ${isThinking ? 'text-naranja' : 'text-cielo'} animate-pulse`} />
            <h3 className="text-xl font-bold font-nunito">Simulación en Progreso</h3>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Estimando...</span>
            <span className="bg-white/10 px-3 py-1 rounded-pill">{progress.current} / {progress.total} perfiles</span>
            <span className="text-verde font-bold">{percent}%</span>
          </div>
        </div>

        {/* Heartbeat Monitor */}
        <div className="relative h-32 bg-[#1E293B] rounded-xl overflow-hidden mb-8 border border-white/10 shadow-inner">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" className="monitor-grid" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* ECG Line */}
          <svg ref={svgRef} viewBox="0 0 1000 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline 
              ref={pathRef}
              points={points}
              className="monitor-path"
              stroke={pulseColor}
            />
          </svg>
          
          {/* Scanning Line overlay */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-[shimmer_2s_linear_infinite]" style={{ left: `${(Date.now() % 2000) / 20}%` }}></div>
        </div>

        {/* Feed of Responses */}
        <div className="mt-6">
          <h4 className="text-sm text-gray-400 mb-4 uppercase tracking-wider font-bold">Respuestas Recientes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            {results.slice().reverse().map((res, i) => (
              <PersonaCard key={res.profile.uuid} result={res} index={i} />
            ))}
          </div>
        </div>
        
        {status === 'complete' && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              <CheckCircle className="w-5 h-5" /> Ver Resultados Completos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
