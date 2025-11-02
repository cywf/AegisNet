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

async function fetchPackages() {
  try {
    console.log('Fetching packages data...');

    const { data: packages } = await octokit.packages.listPackagesForOrganization({
      package_type: 'container',
      org: owner,
    });

    const aegisnetPackage = packages.find((pkg: any) => pkg.name === 'aegisnet' || pkg.name.includes('aegisnet'));

    if (aegisnetPackage) {
      const { data: versions } = await octokit.packages.getAllPackageVersionsForPackageOwnedByOrg({
        package_type: 'container',
        package_name: aegisnetPackage.name,
        org: owner,
      });

      const packageInfo = {
        name: aegisnetPackage.name,
        url: aegisnetPackage.html_url,
        versions: versions.slice(0, 10).map((v: any) => ({
          id: v.id,
          name: v.name,
          created_at: v.created_at,
          updated_at: v.updated_at,
        })),
      };

      const outputPath = path.join(__dirname, '../public/data/packages.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify(packageInfo, null, 2));

      console.log('Packages data saved to', outputPath);
    } else {
      console.log('No AegisNet package found');
      const outputPath = path.join(__dirname, '../public/data/packages.json');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, JSON.stringify({ name: null, versions: [] }, null, 2));
    }
  } catch (error: any) {
    console.log('Packages not available (this is optional):', error.message);
    // Create empty fallback - packages are optional
    const outputPath = path.join(__dirname, '../public/data/packages.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ name: null, versions: [] }, null, 2));
  }
}

fetchPackages();
