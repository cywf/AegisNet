import { useEffect, useState } from 'react';

const THEMES = [
  'nightfall',
  'dracula',
  'cyberpunk',
  'dark-neon',
  'hackerman',
  'gamecore',
  'neon-accent',
] as const;

type Theme = typeof THEMES[number];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('nightfall');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get default theme from environment or fallback
    const defaultTheme = import.meta.env.PUBLIC_DEFAULT_THEME || 'nightfall';
    
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme && THEMES.includes(storedTheme)) {
      setCurrentTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Respect prefers-color-scheme on first load
      setCurrentTheme(defaultTheme as Theme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    } else {
      setCurrentTheme(defaultTheme as Theme);
      document.documentElement.setAttribute('data-theme', defaultTheme);
      localStorage.setItem('theme', defaultTheme);
    }
  }, []);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost gap-2" aria-label="Change theme">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
          />
        </svg>
        <span className="hidden sm:inline">Theme</span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto"
      >
        {THEMES.map((theme) => (
          <li key={theme}>
            <button
              onClick={() => changeTheme(theme)}
              className={currentTheme === theme ? 'active' : ''}
            >
              <span className="capitalize">{theme}</span>
              {currentTheme === theme && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
