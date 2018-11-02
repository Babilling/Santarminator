FROM node:8.12.0-alpine

COPY . /SpaceChristmas/

ENV PORT=8080

RUN chmod +x SpaceChristmas/entrypoint.sh

ENTRYPOINT ["sh","SpaceChristmas/entrypoint.sh"]