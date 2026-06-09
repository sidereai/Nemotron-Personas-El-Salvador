import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function DepartmentHeatmap({ byDepartment }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: null });

  // In a real app, this GeoJSON should be served from public folder
  // We'll mock it gracefully if not available, or draw a simplified grid
  useEffect(() => {
    fetch('/sv-departments.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.warn('GeoJSON no encontrado. Se necesita public/sv-departments.json', err));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current || !byDepartment) return;

    const width = containerRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    svg.selectAll('*').remove(); // Clear previous render

    // Projection for El Salvador
    const projection = d3.geoMercator()
      .fitSize([width - 40, height - 40], geoData);
      
    const pathGenerator = d3.geoPath().projection(projection);

    // Color scale: Red (en contra) -> Gray (neutral) -> Green (a favor)
    const getColor = (deptName) => {
      const stats = byDepartment[deptName];
      if (!stats) return '#E2E8F0'; // No data
      
      const total = stats.a_favor + stats.neutral + stats.en_contra;
      if (total === 0) return '#E2E8F0';
      
      const score = (stats.a_favor - stats.en_contra) / total; // -1 to 1
      
      // Map -1 to 1 into color interpolator
      if (score > 0.2) return d3.interpolateGreens(0.4 + score * 0.4); // Light to dark green
      if (score < -0.2) return d3.interpolateReds(0.4 + Math.abs(score) * 0.4); // Light to dark red
      return '#CBD5E1'; // Neutral gray
    };

    const g = svg.append('g').attr('transform', 'translate(20, 20)');

    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#F8FAFC')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .style('transition', 'fill 0.3s ease, filter 0.3s ease')
      // Enter animation
      .attr('opacity', 0)
      .attr('transform', 'translate(0, 10)')
      .transition()
      .duration(800)
      .delay((d, i) => i * 50)
      .attr('opacity', 1)
      .attr('transform', 'translate(0, 0)')
      .attr('fill', d => getColor(d.properties.NAMLSAD))
      .end()
      .then(() => {
        // Add interactivity after animation
        g.selectAll('path')
          .on('mouseover', function(event, d) {
            d3.select(this).style('filter', 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))');
            const deptName = d.properties.NAMLSAD;
            const stats = byDepartment[deptName] || { a_favor: 0, neutral: 0, en_contra: 0 };
            const total = stats.a_favor + stats.neutral + stats.en_contra;
            
            setTooltip({
              show: true,
              x: event.pageX,
              y: event.pageY - 100,
              content: { name: deptName, stats, total }
            });
          })
          .on('mousemove', (event) => {
            setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY - 100 }));
          })
          .on('mouseout', function() {
            d3.select(this).style('filter', 'none');
            setTooltip({ show: false, x: 0, y: 0, content: null });
          });
      });

  }, [geoData, byDepartment]);

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-xl font-bold text-carbon mb-2">Mapa de Calor por Departamento</h3>
      <p className="text-sm text-gray-500 mb-6">El color indica la postura predominante en la región.</p>
      
      {!geoData ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">Cargando mapa (requiere GeoJSON)...</p>
        </div>
      ) : (
        <div ref={containerRef} className="w-full relative">
          <svg ref={svgRef}></svg>
          
          {/* Custom Tooltip rendered as React component over the SVG */}
          {tooltip.show && tooltip.content && (
            <div 
              className="absolute z-50 bg-white border border-gray-100 shadow-xl rounded-xl p-4 pointer-events-none transform -translate-x-1/2 w-48"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <h4 className="font-bold text-carbon border-b border-gray-100 pb-2 mb-2 text-center">
                {tooltip.content.name}
              </h4>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between text-verde">
                  <span>A Favor:</span> <span>{tooltip.content.stats.a_favor}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Neutral:</span> <span>{tooltip.content.stats.neutral}</span>
                </div>
                <div className="flex justify-between text-rojo">
                  <span>En Contra:</span> <span>{tooltip.content.stats.en_contra}</span>
                </div>
                <div className="flex justify-between text-carbon font-bold pt-1 border-t border-gray-100 mt-1">
                  <span>Total:</span> <span>{tooltip.content.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
