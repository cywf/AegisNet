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

async function fetchDiscussions() {
  try {
    console.log('Fetching discussions...');

    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              title
              url
              createdAt
              author {
                login
              }
              category {
                name
              }
            }
          }
        }
      }
    `;

    const response: any = await octokit.graphql(query, { owner, repo });
    const discussions = response.repository.discussions.nodes.map((d: any) => ({
      title: d.title,
      author: d.author?.login || 'Unknown',
      url: d.url,
      createdAt: d.createdAt,
      category: d.category?.name || 'General',
    }));

    const outputPath = path.join(__dirname, '../public/data/discussions.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(discussions, null, 2));

    console.log(`Fetched ${discussions.length} discussions`);
    console.log('Discussions data saved to', outputPath);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    // Create empty fallback
    const outputPath = path.join(__dirname, '../public/data/discussions.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    console.log('Empty discussions file created due to error');
  }
}

fetchDiscussions();
