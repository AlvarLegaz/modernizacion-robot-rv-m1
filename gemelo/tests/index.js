// Punto de entrada para `node --test gemelo/tests` (Node ≥ 20 resuelve el directorio como módulo y carga este fichero).
// También vale: node --test "gemelo/tests/*.test.js"
'use strict';
const fs = require('fs');
const path = require('path');
for (const f of fs.readdirSync(__dirname).filter((n) => n.endsWith('.test.js')).sort()) require(path.join(__dirname, f));
