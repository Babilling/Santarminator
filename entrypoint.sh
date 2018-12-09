#!/bin/bash
mv public/js/melonJS-min.js public/js/melonjs-min.js
cd SpaceChristmas && npm install && npm link javascript-obfuscator && javascript-obfuscator public/js/ --output . && node index.js > SpaceChristmas.log
