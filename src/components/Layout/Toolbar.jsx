import React from 'react';
import { Activity } from 'lucide-react';

export default function Toolbar() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="glass-pill px-6 py-3 flex items-center gap-6 pointer-events-auto animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cielo to-naranja w-8 h-8 rounded-full flex items-center justify-center shadow-inner">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-carbon to-gray-500">
            PulsoSV
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* Nav */}
        <nav className="hidden md:flex gap-4 text-sm font-bold text-gray-500">
          <a href="#" className="text-cielo hover:text-blue-700 transition-colors">Simulador</a>
          <a href="#metodologia" className="hover:text-carbon transition-colors">Metodología</a>
          <a href="https://huggingface.co/datasets/nvidia/Nemotron-Personas-El-Salvador" target="_blank" className="hover:text-carbon transition-colors">Dataset</a>
          <a href="https://sidereai.com/" target="_blank" className="hover:text-carbon transition-colors">SidereAI</a>
        </nav>
      </div>
    </div>
  );
}
