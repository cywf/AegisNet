import { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

interface Diagram {
  name: string;
  content: string;
}

export default function MermaidViewer() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with dark theme
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });
  }, []);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    
    // Fetch list of diagrams
    fetch(`${base}/diagrams/index.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load diagrams');
        return res.json();
      })
      .then((data: Diagram[]) => {
        setDiagrams(data);
        if (data.length > 0) {
          setSelectedDiagram(data[0].name);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedDiagram || !containerRef.current) return;

    const diagram = diagrams.find((d) => d.name === selectedDiagram);
    if (!diagram) return;

    // Clear previous diagram
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Render new diagram
    const element = document.createElement('div');
    element.className = 'mermaid';
    element.textContent = diagram.content;
    containerRef.current?.appendChild(element);

    mermaid.init(undefined, element);
  }, [selectedDiagram, diagrams]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-base-300 rounded w-1/3"></div>
        <div className="h-96 bg-base-300 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (diagrams.length === 0) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>No diagrams found.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="tabs tabs-boxed bg-base-200 overflow-x-auto">
        {diagrams.map((diagram) => (
          <button
            key={diagram.name}
            className={`tab ${selectedDiagram === diagram.name ? 'tab-active' : ''}`}
            onClick={() => setSelectedDiagram(diagram.name)}
          >
            {diagram.name.replace('.mmd', '')}
          </button>
        ))}
      </div>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">{selectedDiagram.replace('.mmd', '')}</h2>
            <a
              href={`https://github.com/cywf/AegisNet/blob/main/mermaid/${selectedDiagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-ghost"
            >
              View Source
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div 
            ref={containerRef}
            className="flex justify-center items-center min-h-[400px] overflow-x-auto p-4"
          />
        </div>
      </div>
    </div>
  );
}
