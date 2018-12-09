#!/bin/bash
cd SpaceChristmas && npm install && npm link javascript-obfuscator && javascript-obfuscator ./public/js/ --output ./public/js/ && node index.js > SpaceChristmas.log
