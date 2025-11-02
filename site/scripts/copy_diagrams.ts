import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyMermaidDiagrams() {
  try {
    console.log('Copying Mermaid diagrams...');

    const sourceDir = path.join(__dirname, '../../mermaid');
    const targetDir = path.join(__dirname, '../public/diagrams');

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Read all .mmd files from source
    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.mmd'));

    const diagrams = files.map(file => {
      const filePath = path.join(sourceDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Copy file to target
      const targetPath = path.join(targetDir, file);
      fs.writeFileSync(targetPath, content);

      return {
        name: file,
        content: content,
      };
    });

    // Create index file
    const indexPath = path.join(targetDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(diagrams, null, 2));

    console.log(`Copied ${diagrams.length} Mermaid diagrams`);
    console.log('Diagrams saved to', targetDir);
  } catch (error) {
    console.error('Error copying Mermaid diagrams:', error);
    // Create empty fallback
    const targetDir = path.join(__dirname, '../public/diagrams');
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.json'), JSON.stringify([], null, 2));
  }
}

copyMermaidDiagrams();
