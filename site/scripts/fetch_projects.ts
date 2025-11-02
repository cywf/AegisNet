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

async function fetchProjects() {
  try {
    console.log('Fetching projects data...');

    // Try to fetch GitHub Projects v2 data using GraphQL
    const query = `
      query($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          projectsV2(first: 5) {
            nodes {
              title
              items(first: 100) {
                nodes {
                  id
                  content {
                    ... on Issue {
                      title
                      url
                      labels(first: 10) {
                        nodes {
                          name
                        }
                      }
                      assignees(first: 5) {
                        nodes {
                          login
                        }
                      }
                    }
                    ... on PullRequest {
                      title
                      url
                    }
                  }
                  fieldValues(first: 10) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field {
                          ... on ProjectV2SingleSelectField {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    let projectItems: any[] = [];

    try {
      const response: any = await octokit.graphql(query, { owner, repo });
      const projects = response.repository.projectsV2.nodes;

      if (projects && projects.length > 0) {
        // Process project items
        for (const project of projects) {
          for (const item of project.items.nodes) {
            if (!item.content) continue;

            let status = 'To Do';
            // Try to extract status from field values
            for (const fieldValue of item.fieldValues.nodes) {
              if (fieldValue.field?.name === 'Status') {
                status = fieldValue.name;
                break;
              }
            }

            projectItems.push({
              title: item.content.title,
              url: item.content.url,
              status,
              labels: item.content.labels?.nodes.map((l: any) => l.name) || [],
              assignees: item.content.assignees?.nodes.map((a: any) => a.login) || [],
            });
          }
        }
        console.log(`Fetched ${projectItems.length} items from Projects v2`);
      }
    } catch (projectError) {
      console.log('Projects v2 not available, falling back to issues...');
    }

    // Fallback to issues if no projects found
    if (projectItems.length === 0) {
      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        per_page: 50,
      });

      projectItems = issues.map((issue: any) => {
        let status = 'To Do';
        const statusLabel = issue.labels.find((l: any) => 
          l.name.startsWith('status:')
        );
        if (statusLabel) {
          const statusName = statusLabel.name.replace('status:', '');
          if (statusName === 'doing' || statusName === 'in-progress') {
            status = 'In Progress';
          } else if (statusName === 'done' || statusName === 'completed') {
            status = 'Done';
          }
        }

        return {
          title: issue.title,
          url: issue.html_url,
          status,
          labels: issue.labels.map((l: any) => l.name),
          assignees: issue.assignees?.map((a: any) => a.login) || [],
        };
      });

      console.log(`Fetched ${projectItems.length} items from issues (fallback)`);
    }

    const outputPath = path.join(__dirname, '../public/data/projects.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(projectItems, null, 2));

    console.log('Projects data saved to', outputPath);
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Create empty fallback
    const outputPath = path.join(__dirname, '../public/data/projects.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    console.log('Empty projects file created due to error');
  }
}

fetchProjects();
