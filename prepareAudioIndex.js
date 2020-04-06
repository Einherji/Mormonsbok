const fs = require("fs");

const files = fs.readdirSync("./app/audio")
  .filter(x => x.includes("mp3"))
  .filter(x => !x.includes('@2x'))
  .filter(x => !x.includes('@3x'));

const res = files.map(file =>`import { default as ${file.split('.mp3')[0]} } from './${file}';`)
  .join('\n');
const final = res + '\nexport default {\n' + files.map(file => file.split('.mp3')[0]).join(',\n') + '\n}'

fs.writeFileSync("./app/audio/index.js", final);