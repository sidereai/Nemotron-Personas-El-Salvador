import React, { useState } from 'react';
import Toolbar from './components/Layout/Toolbar';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import Methodology from './components/Landing/Methodology';
import PolicyForm from './components/Simulator/PolicyForm';
import SimulationRunner from './components/Simulator/SimulationRunner';
import SentimentGauge from './components/Results/SentimentGauge';
import DemographicBreakdown from './components/Results/DemographicBreakdown';
import DepartmentHeatmap from './components/Results/DepartmentHeatmap';
import ResponseViewer from './components/Results/ResponseViewer';
import ExportPanel from './components/Results/ExportPanel';
import { useSimulation } from './hooks/useSimulation';

export default function App() {
  const sim = useSimulation();
  const [currentPolicy, setCurrentPolicy] = useState('');

  const handleStart = (config) => {
    setCurrentPolicy(config.policy);
    sim.startSimulation(config);
    
    // Scroll to runner slightly after start
    setTimeout(() => {
      document.getElementById('runner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Toolbar />
      
      <main>
        <Hero />
        <Features />
        <Methodology />

        <div id="simulator" className="py-20 px-4">
          <div className="container mx-auto">
            <PolicyForm onStart={handleStart} isRunning={sim.status === 'processing'} />
          </div>
        </div>

        <div id="runner" className="px-4">
          <div className="container mx-auto">
            <SimulationRunner 
              status={sim.status} 
              progress={sim.progress} 
              results={sim.results} 
              quality={sim.status === 'processing' ? 'flash' : null} // Can pass actual quality from state if needed
            />
          </div>
        </div>

        {sim.status === 'complete' && sim.aggregation && (
          <div id="results-section" className="py-20 px-4 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-carbon mb-4">Resultados de la Simulación</h2>
                <p className="text-gray-500 italic max-w-2xl mx-auto">
                  "{currentPolicy}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-1">
                  <SentimentGauge summary={sim.aggregation.summary} />
                </div>
                <div className="md:col-span-2">
                  <DepartmentHeatmap byDepartment={sim.aggregation.byDepartment} />
                </div>
              </div>

              <div className="mb-8">
                <DemographicBreakdown 
                  byAge={sim.aggregation.byAge} 
                  bySex={sim.aggregation.bySex} 
                  byEducation={sim.aggregation.byEducation} 
                />
              </div>

              <ResponseViewer results={sim.results} />
              
              <ExportPanel results={sim.results} policy={currentPolicy} />
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-carbon text-gray-400 py-12 text-center text-sm border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <h4 className="text-white font-bold text-lg mb-3">Construido por SidereAI</h4>
            <p className="text-gray-400 leading-relaxed">
              Somos especialistas en inteligencia artificial, desarrollo de agentes sintéticos y análisis de datos masivos. 
              Creamos este laboratorio como una prueba de concepto del potencial de los modelos de lenguaje para el análisis social en El Salvador.
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-6 max-w-xl mx-auto border border-slate-700 mb-8">
            <p className="mb-4 text-gray-300 font-medium text-base">
              ¿Necesitas simulaciones a mayor escala (&gt;100 hasta 100K+ perfiles) o análisis de datos personalizados para tu institución?
            </p>
            <a 
              href="https://wa.me/50362200921" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:scale-105"
            >
              Contactar por WhatsApp
            </a>
          </div>

          <p className="text-gray-500">
            © 2026 PulsoSV. Una herramienta oficial de{' '}
            <a href="https://sidereai.com/" target="_blank" rel="noopener noreferrer" className="text-cielo hover:underline font-bold">
              SidereAI
            </a>. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
