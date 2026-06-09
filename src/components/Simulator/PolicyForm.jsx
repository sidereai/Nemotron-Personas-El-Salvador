import React, { useState } from 'react';
import { Play, Settings2, SlidersHorizontal, Zap, BrainCircuit } from 'lucide-react';

const POLICIES = [
  "Aprobación de la pena de muerte para crímenes graves",
  "Impuesto del 5% a todas las remesas familiares",
  "Aumento del salario mínimo a $400 mensuales a nivel nacional",
  "Legalización del matrimonio igualitario en El Salvador"
];

export default function PolicyForm({ onStart, isRunning }) {
  const [policy, setPolicy] = useState('');
  const [mode, setMode] = useState('rapida'); // rapida, estandar, profunda
  const [quality, setQuality] = useState('flash'); // flash, mayor_calidad
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ department: '', sex: '', education_level: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!policy.trim()) return;
    
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

          <div className="flex flex-wrap gap-2 mt-3">
            {POLICIES.map((p, i) => (
              <button
                key={i}
                type="button"
                disabled={isRunning}
                onClick={() => setPolicy(p)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
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
              <button
                type="button"
                onClick={() => setMode('profunda')}
                disabled={isRunning}
                className={`flex-1 py-2 text-sm font-semibold rounded-pill transition-all ${mode === 'profunda' ? 'bg-white shadow-md text-cielo' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Profunda (1K)
              </button>
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Motor de Inferencia
            </label>
            <div className="flex bg-gray-100 p-1 rounded-pill">
              <button
                type="button"
                onClick={() => setQuality('flash')}
                disabled={isRunning}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold rounded-pill transition-all ${quality === 'flash' ? 'bg-white shadow-md text-naranja' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Zap className="w-4 h-4" /> Flash
              </button>
              <button
                type="button"
                onClick={() => setQuality('mayor_calidad')}
                disabled={isRunning}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-semibold rounded-pill transition-all ${quality === 'mayor_calidad' ? 'bg-white shadow-md text-naranja' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BrainCircuit className="w-4 h-4" /> Mayor Calidad
              </button>
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

        <div className="flex justify-center mt-8 relative z-10">
          <button
            type="submit"
            disabled={!policy.trim() || isRunning}
            className={`btn-primary w-full md:w-auto md:px-12 md:py-4 text-lg ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Play className="w-6 h-6 fill-current" />
            {isRunning ? 'Simulando...' : 'Iniciar Simulación'}
          </button>
        </div>
      </form>
    </div>
  );
}
