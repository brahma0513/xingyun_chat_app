// Apply the vendor's Vue2 compatibility sources without deleting the originals.
// Re-run after upgrading tuikit-atomic-x, then review the generated diff.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../uni_modules/tuikit-atomic-x');
const names = ['components', 'state', 'server'];
let count = 0;
function copy(source, target) {
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name), to = path.join(target, entry.name);
    if (entry.isDirectory()) { fs.mkdirSync(to, { recursive: true }); copy(from, to); }
    else {
      let bytes = fs.readFileSync(from);
      if (/\.(vue|nvue|js|ts)$/.test(entry.name)) {
        let text = bytes.toString('utf8');
        for (const name of [...names, 'quickstart', 'pages']) text = text.replaceAll(name + '_compatible', name);
        text = text.replaceAll('setSdkLanguageFromSystem_compatible', 'setSdkLanguageFromSystem');
        bytes = Buffer.from(text.replace(/[ \t]+$/gm, ''));
      }
      if (!fs.existsSync(to) || !fs.readFileSync(to).equals(bytes)) { fs.writeFileSync(to, bytes); count++; }
    }
  }
}
for (const name of names) copy(path.join(root, name + '_compatible'), path.join(root, name));
fs.copyFileSync(path.join(root, 'utils/setSdkLanguageFromSystem_compatible.ts'), path.join(root, 'utils/setSdkLanguageFromSystem.ts'));
console.log('Vue2 compatibility files updated:', count);
