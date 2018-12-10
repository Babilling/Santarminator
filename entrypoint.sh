#!/bin/bash
cd santarminator && npm install && npm link javascript-obfuscator && javascript-obfuscator public/js/ --output . && node index.js > /etc/log/santarminator.log
