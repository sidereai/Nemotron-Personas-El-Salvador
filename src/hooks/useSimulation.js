import { useState, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useSimulation() {
  const [status, setStatus] = useState('idle'); // idle, processing, complete, error
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [aggregation, setAggregation] = useState(null);
  const [error, setError] = useState(null);
  
  // Track active EventSource to allow cancellation
  const eventSourceRef = useRef(null);

  const startSimulation = useCallback((config) => {
    // Reset state
    setStatus('processing');
    setProgress({ current: 0, total: config.mode === 'rapida' ? 50 : config.mode === 'estandar' ? 100 : 1000 });
    setResults([]);
    setAggregation(null);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // We can't easily send body with EventSource directly, 
    // so we use fetch to initiate POST, then read the stream manually
    fetch(`${API_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let buffer = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Parse SSE format
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Keep incomplete chunk in buffer
        
        for (const block of lines) {
          const linesInBlock = block.split('\n');
          let eventType = 'message';
          let eventData = null;
          
          for (const line of linesInBlock) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              try {
                eventData = JSON.parse(line.slice(6));
              } catch (e) {
                console.error('Failed to parse SSE data', line);
              }
            }
          }
          
          if (eventData) {
            handleEvent(eventType, eventData);
          }
        }
      }
    })
    .catch(err => {
      console.error('Simulation fetch error:', err);
      setStatus('error');
      setError(err.message);
    });
  }, []);

  const handleEvent = (type, data) => {
    switch (type) {
      case 'status':
        if (data.total) setProgress(p => ({ ...p, total: data.total }));
        break;
      case 'progress':
        setProgress({ current: data.current, total: data.total });
        setResults(prev => [...prev, data]);
        break;
      case 'complete':
        setAggregation(data);
        setStatus('complete');
        // Save to history
        try {
          const history = JSON.parse(sessionStorage.getItem('pulso_history') || '[]');
          history.push({
            id: Date.now(),
            date: new Date().toISOString(),
            totalCompleted: data.totalCompleted,
            summary: data.summary
          });
          sessionStorage.setItem('pulso_history', JSON.stringify(history));
        } catch (e) { /* ignore */ }
        break;
      case 'error':
        setStatus('error');
        setError(data.message);
        break;
    }
  };

  const cancelSimulation = useCallback(() => {
    if (status === 'processing') {
      setStatus('idle');
      // Aborting the fetch stream is complex without AbortController,
      // but for MVP we just reset UI state. The server might finish processing in background.
    }
  }, [status]);

  return {
    status,
    progress,
    results,
    aggregation,
    error,
    startSimulation,
    cancelSimulation
  };
}
