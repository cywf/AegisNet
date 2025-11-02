import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.GITHUB_TOKEN || '';
const octokit = new Octokit({ auth: token });

const owner = 'cywf';
const repo = 'AegisNet';

async function fetchRepoData() {
  try {
    console.log('Fetching repository data...');

    // Get repository info
    const { data: repoInfo } = await octokit.repos.get({ owner, repo });

    // Get languages
    const { data: languages } = await octokit.repos.listLanguages({ owner, repo });

    // Get commit activity (last 12 weeks)
    const { data: commitActivity } = await octokit.repos.getCommitActivityStats({ owner, repo });
    
    // Extract just the commit counts from the last 12 weeks
    const weeklyCommits = commitActivity?.slice(-12).map((week: any) => week.total) || Array(12).fill(0);

    const stats = {
      stars: repoInfo.stargazers_count,
      forks: repoInfo.forks_count,
      watchers: repoInfo.subscribers_count,
      languages,
      commitActivity: weeklyCommits,
    };

    const outputPath = path.join(__dirname, '../public/data/stats.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

    console.log('Repository data saved to', outputPath);
    console.log(`Stats: ${stats.stars} stars, ${stats.forks} forks, ${stats.watchers} watchers`);
  } catch (error) {
    console.error('Error fetching repository data:', error);
    // Create a fallback file with default data
    const fallbackStats = {
      stars: 0,
      forks: 0,
      watchers: 0,
      languages: { TypeScript: 50, JavaScript: 30, Shell: 20 },
      commitActivity: Array(12).fill(0),
    };
    const outputPath = path.join(__dirname, '../public/data/stats.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(fallbackStats, null, 2));
    console.log('Fallback data written due to error');
  }
}

fetchRepoData();
