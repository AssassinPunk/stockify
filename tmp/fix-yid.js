const fs = require('fs');
const filepath = 'src/components/dashboard/main-chart.tsx';
let txt = fs.readFileSync(filepath, 'utf-8');
txt = txt.replace(/yId=/g, 'yAxisId=');
fs.writeFileSync(filepath, txt, 'utf-8');
