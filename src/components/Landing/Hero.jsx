import React from 'react';
import { Play } from 'lucide-react';
import anime from 'animejs';

export default function Hero() {
  React.useEffect(() => {
    anime({
      targets: '.hero-element',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
      easing: 'easeOutExpo',
      duration: 1000
    });
    
    // Abstract nodes animation
    anime({
      targets: '.node-dot',
      scale: [0.8, 1.2],
      opacity: [0.4, 1],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: function() { return anime.random(1000, 3000); },
      delay: function() { return anime.random(0, 1000); }
    });
  }, []);

  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cielo/10 to-rosa/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 text-center z-10 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-500 mb-8 hero-element shadow-sm">
          <span className="w-2 h-2 rounded-full bg-verde animate-pulse"></span>
          Análisis con Inteligencia Flash
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-carbon mb-6 tracking-tight hero-element leading-tight">
          Simula el <span className="text-transparent bg-clip-text bg-gradient-to-r from-cielo to-naranja">Impacto Social</span><br/>
          Antes de Legislar
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto hero-element">
          Laboratorio digital alimentado por 1 millón de perfiles sintéticos para anticipar cómo reaccionará El Salvador ante políticas públicas.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 hero-element">
          <button 
            onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-xl px-8 py-4"
          >
            <Play className="w-6 h-6 fill-current" /> Iniciar Simulación
          </button>
        </div>
        
        {/* Abstract 3D/Network Visualization placeholder */}
        <div className="mt-16 relative h-64 w-full max-w-4xl mx-auto hero-element opacity-80 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
            {/* Connection lines */}
            <path d="M 100 100 Q 250 20 400 100 T 700 100" fill="none" stroke="url(#grad)" strokeWidth="2" strokeDasharray="5,5" className="animate-[heartbeat-line_10s_linear_infinite]" />
            <path d="M 200 150 Q 400 200 600 50" fill="none" stroke="url(#grad2)" strokeWidth="1" opacity="0.5" />
            
            {/* Nodes */}
            <circle cx="100" cy="100" r="6" fill="#3B82F6" className="node-dot" />
            <circle cx="250" cy="60" r="4" fill="#F97316" className="node-dot" />
            <circle cx="400" cy="100" r="8" fill="#EC4899" className="node-dot" />
            <circle cx="550" cy="140" r="5" fill="#10B981" className="node-dot" />
            <circle cx="700" cy="100" r="7" fill="#3B82F6" className="node-dot" />
            <circle cx="200" cy="150" r="5" fill="#10B981" className="node-dot" />
            <circle cx="600" cy="50" r="6" fill="#F97316" className="node-dot" />
            
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#F97316" stopOpacity="1" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
