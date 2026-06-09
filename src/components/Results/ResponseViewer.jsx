import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function ResponseViewer({ results }) {
  const [filterSent, setFilterSent] = useState('all');
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  // Filter valid results
  const validResults = results.filter(r => r.parsed && !r.error);
  
  const filtered = validResults.filter(r => {
    if (filterSent === 'all') return true;
    return r.parsed.sentimiento === filterSent;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  if (validResults.length === 0) return null;

  return (
    <div className="card p-6 md:p-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-carbon">Voces de la Simulación</h3>
        
        {/* Filters */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-pill">
          <Filter className="w-4 h-4 text-gray-400 ml-2" />
          <button 
            onClick={() => {setFilterSent('all'); setPage(0);}}
            className={`px-3 py-1 text-sm font-bold rounded-pill transition-colors ${filterSent === 'all' ? 'bg-white shadow text-carbon' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => {setFilterSent('a_favor'); setPage(0);}}
            className={`px-3 py-1 text-sm font-bold rounded-pill transition-colors ${filterSent === 'a_favor' ? 'bg-verde text-white shadow' : 'text-verde hover:bg-verde/10'}`}
          >
            A Favor
          </button>
          <button 
            onClick={() => {setFilterSent('en_contra'); setPage(0);}}
            className={`px-3 py-1 text-sm font-bold rounded-pill transition-colors ${filterSent === 'en_contra' ? 'bg-rojo text-white shadow' : 'text-rojo hover:bg-rojo/10'}`}
          >
            En Contra
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay respuestas que coincidan con este filtro.</p>
        ) : (
          paginated.map((res, i) => (
            <div key={res.profile.uuid || i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-bold text-carbon">
                    {res.profile.sex === 'Masculino' ? 'Hombre' : 'Mujer'}, {res.profile.age} años
                  </h5>
                  <p className="text-xs text-gray-500">{res.profile.occupation} • {res.profile.municipality}, {res.profile.department}</p>
                </div>
                <span className={`px-2 py-1 rounded-pill text-xs font-bold ${SENTIMENT_COLORS[res.parsed.sentimiento]}`}>
                  {SENTIMENT_LABELS[res.parsed.sentimiento]} (Fuerza: {res.parsed.intensidad}/5)
                </span>
              </div>
              <p className="text-sm text-carbon italic bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                <span className="absolute -top-3 left-4 bg-white px-1 text-xs text-gray-400 font-bold">Razón: {res.parsed.razon_principal}</span>
                "{res.parsed.reaccion}"
              </p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary text-sm py-1 px-3"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <span className="text-sm text-gray-500 font-mono">Página {page + 1} de {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="btn-secondary text-sm py-1 px-3"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
