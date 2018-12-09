FROM node:8.12.0-alpine

COPY . /SpaceChristmas/

ENV PORT=8080

USER 0

RUN chmod +x SpaceChristmas/entrypoint.sh

ENTRYPOINT ["sh","SpaceChristmas/entrypoint.sh"]