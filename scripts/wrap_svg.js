const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'grouped_paths.txt');
const outputPath = path.join(__dirname, '..', 'test-app', 'src', 'components', 'LemarLogoSVG.tsx');

const content = fs.readFileSync(inputPath, 'utf8');

const component = `import React from 'react';

${content}

const LemarLogoSVG = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 1024 1024" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <IconGroup />
      <LemarGroup />
      <SubtitleGroup />
    </svg>
  );
};

export default LemarLogoSVG;
`;

fs.writeFileSync(outputPath, component);
console.log('Successfully wrapped SVG into React component.');
