import { useEffect, useState } from 'react';

interface ProjectItem {
  title: string;
  status: string;
  url: string;
  labels: string[];
  assignees: string[];
}

interface KanbanColumn {
  title: string;
  items: ProjectItem[];
}

const SkeletonLoader = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="h-8 bg-base-300 rounded w-1/2"></div>
        {[...Array(3)].map((_, j) => (
          <div key={j} className="animate-pulse card bg-base-200">
            <div className="card-body p-4">
              <div className="h-4 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default function DevelopmentBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}/data/projects.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load project data');
        return res.json();
      })
      .then((data) => {
        // Group items by status
        const columnsMap: { [key: string]: ProjectItem[] } = {
          'To Do': [],
          'In Progress': [],
          'Done': [],
        };

        data.forEach((item: ProjectItem) => {
          const status = item.status || 'To Do';
          if (columnsMap[status]) {
            columnsMap[status].push(item);
          } else {
            columnsMap['To Do'].push(item);
          }
        });

        const cols = Object.entries(columnsMap).map(([title, items]) => ({
          title,
          items,
        }));

        setColumns(cols);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <SkeletonLoader />;
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

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.title} className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{column.title}</h3>
            <span className="badge badge-neutral">{column.items.length}</span>
          </div>
          <div className="space-y-3">
            {column.items.length === 0 ? (
              <div className="card bg-base-200">
                <div className="card-body p-4 text-center opacity-50">
                  No items
                </div>
              </div>
            ) : (
              column.items.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card bg-base-200 shadow hover:shadow-xl transition-shadow"
                >
                  <div className="card-body p-4">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    {item.labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.labels.map((label, i) => (
                          <span key={i} className="badge badge-sm badge-outline">
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.assignees.length > 0 && (
                      <div className="flex gap-1 mt-2 text-xs opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{item.assignees.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
