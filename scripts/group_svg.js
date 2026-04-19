const fs = require('fs');
const path = require('path');

const svgPath = 'c:/Users/ihgha/Desktop/Java Codes/Date converter/test-app/src/assets/lemar_logo.svg';
const content = fs.readFileSync(svgPath, 'utf8');

// Simple regex to match paths and their translation values
const pathRegex = /<path[^>]+transform="translate\(([^,]+),([^)]+)\)"[^>]*\/>/g;

let iconPaths = [];
let lemarPaths = [];
let subtitlePaths = [];
let otherPaths = [];

let match;
while ((match = pathRegex.exec(content)) !== null) {
    const fullPath = match[0];
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    if (y < 580) {
        iconPaths.push(fullPath);
    } else if (y >= 580 && y < 650) {
        lemarPaths.push(fullPath);
    } else {
        subtitlePaths.push(fullPath);
    }
}

// Prepare the JSX output
const output = `
/* Grouped SVG Parts */
const IconGroup = () => (
  <g className="logo-target-icon">
    ${iconPaths.join('\n    ')}
  </g>
);

const LemarGroup = () => (
  <g className="logo-text-lemar">
    ${lemarPaths.join('\n    ')}
  </g>
);

const SubtitleGroup = () => (
  <g className="logo-text-sub">
    ${subtitlePaths.join('\n    ')}
  </g>
);
`;

fs.writeFileSync('grouped_paths.txt', output);
console.log('Processed ' + (iconPaths.length + lemarPaths.length + subtitlePaths.length) + ' paths.');
