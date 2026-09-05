const fs = require('fs');
let file = fs.readFileSync('.gemini/skills/extension-creator/references/introduction.md', 'utf8');
let lines = file.split('\n');

const fixBlock = (start, end, lang) => {
  for(let i = start - 3; i <= end + 3; i++) {
    if(lines[i] && lines[i].trim() === '```') {
      lines[i] = '```' + lang;
      break;
    }
  }
};

fixBlock(252, 259, 'json');
fixBlock(280, 290, 'json');
fixBlock(311, 316, 'json');

fs.writeFileSync('.gemini/skills/extension-creator/references/introduction.md', lines.join('\n'));
