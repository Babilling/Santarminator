FROM node:8.12.0-alpine

COPY . /santarminator/

USER 0

RUN chmod +x santarminator/entrypoint.sh && \
    mkdir -p /etc/log/

HEALTHCHECK CMD netstat -an | grep 8080 > /dev/null; if [ 0 != $? ]; then exit 1; fi;

ENTRYPOINT ["sh","santarminator/entrypoint.sh"]