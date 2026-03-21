const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function toPascalCase(str) {
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const iconRegex = /<span\s+className="material-icons([^"]*)"[^>]*>([a-z0-9_]+)<\/span>/g;
  
  let match;
  let imports = new Set();
  let modified = false;

  content = content.replace(iconRegex, (match, classes, iconName) => {
    modified = true;
    const componentName = toPascalCase(iconName) + 'Icon';
    imports.add(`import ${componentName} from '@mui/icons-material/${toPascalCase(iconName)}';`);
    const remainingClasses = classes.trim();
    if (remainingClasses) {
      return `<${componentName} className="${remainingClasses}" />`;
    }
    return `<${componentName} />`;
  });

  // Handle dynamic ones where icon name is hardcoded in the map
  // e.g. `<span className="material-icons">{item.icon}</span>` -> requires dynamic handling, script won't touch it.

  if (modified) {
    // Insert imports after the last import statement
    const importStatements = Array.from(imports).join('\n');
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
       if (lines[i].trim().startsWith('import ')) {
         lastImportIndex = i;
       }
    }
    
    if (lastImportIndex !== -1) {
       lines.splice(lastImportIndex + 1, 0, importStatements);
    } else {
       lines.unshift(importStatements);
    }
    
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log('Updated', filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
