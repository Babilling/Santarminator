FROM node:8.12.0-alpine

COPY . /SpaceChristmas/

USER 0

RUN chmod +x SpaceChristmas/entrypoint.sh

HEALTHCHECK CMD netstat -an | grep 8080 > /dev/null; if [ 0 != $? ]; then exit 1; fi;

ENTRYPOINT ["sh","SpaceChristmas/entrypoint.sh"]