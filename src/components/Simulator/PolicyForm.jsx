import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings2, SlidersHorizontal, Zap, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

const POLICIES = [
  "Aprobación de la pena de muerte para crímenes graves",
  "Impuesto del 5% a todas las remesas familiares",
  "Aumento del salario mínimo a $400 mensuales a nivel nacional",
  "Legalización del matrimonio igualitario en El Salvador",
  "Prohibición total de la minería metálica y no metálica",
  "Aprobación del aborto terapéutico en casos de riesgo",
  "Privatización del servicio de agua potable (ANDA)",
  "Reelección presidencial indefinida",
  "Implementación de peajes en las principales carreteras",
  "Reducción de la edad penal a los 12 años",
  "Uso obligatorio del Bitcoin para pago de salarios",
  "Eliminación de la pensión vitalicia para expresidentes",
  "Servicio militar obligatorio para jóvenes (NiNis)",
  "Aprobación de la ley de eutanasia asistida",
  "Legalización de la marihuana para uso recreativo",
  "Eliminación del subsidio al gas propano",
  "Restricción vehicular por número de placa (Hoy No Circula)",
  "Construcción de un tren nacional con deuda externa",
  "Impuesto a las bebidas azucaradas y ultraprocesados",
  "Nacionalización del sistema de transporte público"
];

export default function PolicyForm({ onStart, status }) {
  const isRunning = status === 'processing';
  const [policy, setPolicy] = useState('');
  const [mode, setMode] = useState('rapida'); // rapida, estandar, profunda
  const [quality, setQuality] = useState('flash'); // flash, mayor_calidad
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ department: '', sex: '', education_level: '' });
  const [dailySims, setDailySims] = useState({ date: '', count: 0 });
  const scrollRef = useRef(null);

  const scrollPolicies = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('pulso_sims');
    const today = new Date().toDateString();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setDailySims(parsed);
      } else {
        // Reset if it's a new day
        setDailySims({ date: today, count: 0 });
        localStorage.setItem('pulso_sims', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      setDailySims({ date: today, count: 0 });
      localStorage.setItem('pulso_sims', JSON.stringify({ date: today, count: 0 }));
  }, []);

  // Rollback daily simulation count if the server throws an error
  const prevStatusRef = useRef(status);
  useEffect(() => {
    if (prevStatusRef.current === 'processing' && status === 'error') {
      setDailySims(prev => {
        const revertedCount = Math.max(0, prev.count - 1);
        const revertedSims = { ...prev, count: revertedCount };
        localStorage.setItem('pulso_sims', JSON.stringify(revertedSims));
        return revertedSims;
      });
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!policy.trim() || dailySims.count >= 3) return;
    
    // Increment daily count
    const newCount = dailySims.count + 1;
    const newSims = { ...dailySims, count: newCount };
    setDailySims(newSims);
    localStorage.setItem('pulso_sims', JSON.stringify(newSims));

    // Convert empty strings to null for backend
    const cleanFilters = {};
    Object.keys(filters).forEach(k => {
      if (filters[k]) cleanFilters[k] = filters[k];
    });

    onStart({ policy, mode, quality, filters: cleanFilters });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6 relative overflow-visible">
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-naranja rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cielo rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-carbon mb-2">Diseña el Escenario</h2>
          <p className="text-gray-500 mb-4">Escribe la política pública o elige un ejemplo predefinido.</p>
          
          <textarea
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            disabled={isRunning}
            placeholder="Ej: Subsidio universal de $50 mensuales para madres solteras..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl focus:border-cielo focus:ring-4 focus:ring-cielo/20 transition-all resize-none text-lg"
          />

          <div className="flex items-center gap-2 mt-3 w-full">
            {/* Scroll Left Button */}
            <button 
              type="button" 
              onClick={() => scrollPolicies('left')}
              className="flex-shrink-0 z-10 bg-white shadow-sm rounded-full p-1.5 border border-gray-200 text-carbon hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex-1 flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x scroll-smooth"
              style={{ 
                maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)'
              }}
            >
              {POLICIES.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isRunning}
                  onClick={() => setPolicy(p)}
                  className="whitespace-nowrap flex-shrink-0 text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-full transition-all border border-gray-200 shadow-sm snap-start mx-1"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Scroll Right Button */}
            <button 
              type="button" 
              onClick={() => scrollPolicies('right')}
              className="flex-shrink-0 z-10 bg-white shadow-sm rounded-full p-1.5 border border-gray-200 text-carbon hover:bg-gray-50 hover:scale-110 transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Tamaño de Muestra
            </label>
            <div className="flex bg-gray-100 p-1 rounded-pill">
              <button
                type="button"
                onClick={() => setMode('rapida')}
                disabled={isRunning}
                className={`flex-1 py-2 text-sm font-semibold rounded-pill transition-all ${mode === 'rapida' ? 'bg-white shadow-md text-cielo' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Rápida (50)
              </button>
              <button
                type="button"
                onClick={() => setMode('estandar')}
                disabled={isRunning}
                className={`flex-1 py-2 text-sm font-semibold rounded-pill transition-all ${mode === 'estandar' ? 'bg-white shadow-md text-cielo' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Estándar (100)
              </button>
            </div>
          </div>

          {/* Static Quality Indicator */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Motor de Inferencia
            </label>
            <div className="flex bg-gray-50 p-1 rounded-pill border border-gray-100">
              <div className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-pill bg-white shadow-sm text-naranja">
                <Zap className="w-4 h-4 fill-current" /> Análisis con Inteligencia Flash
              </div>
            </div>
          </div>
        </div>

        {/* Filters Toggle */}
        <div className="relative z-10 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm font-semibold text-cielo hover:text-blue-700 flex items-center gap-1"
          >
            {showFilters ? 'Ocultar Filtros Avanzados' : 'Mostrar Filtros Avanzados'}
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 animate-fade-in-up">
              <select 
                value={filters.department} 
                onChange={e => setFilters({...filters, department: e.target.value})}
                disabled={isRunning}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-cielo focus:ring-1 focus:ring-cielo"
              >
                <option value="">Todos los Departamentos</option>
                <option value="San Salvador">San Salvador</option>
                <option value="La Libertad">La Libertad</option>
                <option value="Santa Ana">Santa Ana</option>
                <option value="San Miguel">San Miguel</option>
                <option value="Usulután">Usulután</option>
              </select>

              <select 
                value={filters.sex} 
                onChange={e => setFilters({...filters, sex: e.target.value})}
                disabled={isRunning}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-cielo focus:ring-1 focus:ring-cielo"
              >
                <option value="">Cualquier Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>

              <select 
                value={filters.education_level} 
                onChange={e => setFilters({...filters, education_level: e.target.value})}
                disabled={isRunning}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-cielo focus:ring-1 focus:ring-cielo"
              >
                <option value="">Cualquier Educación</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="bachillerato">Bachillerato</option>
                <option value="universitario">Universitario</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mt-8 relative z-10">
          <button
            type="submit"
            disabled={!policy.trim() || isRunning || dailySims.count >= 3}
            className={`btn-primary w-full md:w-auto md:px-12 md:py-4 text-lg ${(isRunning || dailySims.count >= 3) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {dailySims.count >= 3 ? <Lock className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            {dailySims.count >= 3 ? 'Límite Diario Alcanzado' : (isRunning ? 'Simulando...' : 'Iniciar Simulación')}
          </button>
          
          <p className={`mt-3 text-sm font-bold ${dailySims.count >= 3 ? 'text-rojo' : 'text-gray-500'}`}>
            Simulaciones disponibles hoy: {Math.max(0, 3 - dailySims.count)} / 3
          </p>
        </div>
      </form>
    </div>
  );
}
