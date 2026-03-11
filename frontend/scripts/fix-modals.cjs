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

const files = walk('C:\\Users\\pc\\OneDrive\\Desktop\\CRM_Project\\frontend\\src\\pages');
let modalCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix manager/TeamOverview.jsx grids specifically
    if (file.includes('TeamOverview.jsx')) {
        content = content.replace(/grid-cols-1 md:grid-cols-4/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
        content = content.replace(/grid-cols-2 lg:grid-cols-4/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4');
    }

    // Modal width fix: target elements containing 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl' that are modals
    const regex = /className="([^"\n]*max-w-(?:md|lg|xl|2xl|sm|3xl)[^"\n]*)"/g;

    content = content.replace(regex, (match, inner) => {
        // If it's a structural modal (has bg-white, rounded, shadow, etc and isn't just a text containter)
        if (inner.includes('bg-white') && inner.includes('rounded') && inner.includes('shadow')) {
            if (!inner.includes('max-h-') && !inner.includes('overflow-y-auto')) {
                modalCount++;
                return `className="${inner} mx-2 sm:mx-auto max-h-[85vh] overflow-y-auto no-scrollbar"`;
            }
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed Modals:', modalCount);
