#!/bin/bash
sed -i 's|8080|'"$PORT"'|g' spaceChristmas/index.js
cd SpaceChristmas && npm install && npm link javascript-obfuscator && javascript-obfuscator ./public/js/ --output ./public/js/ && node index.js > spaceChristmas.log
