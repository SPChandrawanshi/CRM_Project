const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk('C:\\\\Users\\\\pc\\\\OneDrive\\\\Desktop\\\\CRM_Project\\\\frontend\\\\src\\\\pages');
let formCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Use regex to find `className="... grid grid-cols-2`
    // and make sure we don't accidentally override `md:grid-cols-2` by doing it blindly.
    const regex = /className=\"([^\"]*?)grid grid-cols-2([^\"]*)\"/g;

    content = content.replace(regex, (match, prefix, suffix) => {
        // If it starts with md: or sm: or lg: right before it, it's not what we want. 
        // But the pattern is `grid grid-cols-2` so there is NO prefix directly bound to grid-cols-2
        if (prefix.includes('grid-cols-1')) return match;

        formCount++;
        return `className="${prefix}grid grid-cols-1 md:grid-cols-2${suffix}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed Form Grids:', formCount);
