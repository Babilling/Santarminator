#!/bin/bash
sed -i 's|8080|'"$PORT"'|g' SpaceChristmas/index.js
cd SpaceChristmas && npm install && node index.js
