import { useEffect, useState } from 'react';

interface Discussion {
  title: string;
  author: string;
  url: string;
  createdAt: string;
  category: string;
}

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="h-6 bg-base-300 rounded w-3/4"></div>
          <div className="h-4 bg-base-300 rounded w-1/2 mt-2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function DiscussionsList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}/data/discussions.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load discussions');
        return res.json();
      })
      .then((data) => {
        setDiscussions(data);
        setFilteredDiscussions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDiscussions(discussions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = discussions.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.author.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query)
    );
    setFilteredDiscussions(filtered);
  }, [searchQuery, discussions]);

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
    <div className="space-y-6">
      <div className="form-control">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search discussions..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {filteredDiscussions.length === 0 ? (
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>No discussions found matching your search.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion, index) => (
            <a
              key={index}
              href={discussion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="card-body">
                <h2 className="card-title">{discussion.title}</h2>
                <div className="flex flex-wrap gap-2 items-center text-sm opacity-70">
                  <span className="badge badge-primary">{discussion.category}</span>
                  <span>by {discussion.author}</span>
                  <span>•</span>
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <button className="btn btn-sm btn-ghost">
                    View on GitHub
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
