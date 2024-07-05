FROM node:18
RUN apt update && apt install --yes --no-install-recommends \
     curl \
     ca-certificates \
     gnupg \
     unzip \
     dumb-init \
     && install -m 0755 -d /etc/apt/keyrings \
     && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
     && chmod a+r /etc/apt/keyrings/docker.gpg \
     && echo \
     "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
     tee /etc/apt/sources.list.d/docker.list > /dev/null \
     && apt update \
     && apt --yes --no-install-recommends install \
     docker-ce-cli \
     docker-compose-plugin \
     && rm -rf /var/lib/apt/lists/* 

WORKDIR /apps
COPY --chown=node:node ./daemon/dist/ .
COPY --chown=node:node ./daemon/node_modules ./node_modules
COPY --chown=node:node ./common ./node_modules/common
COPY --chown=node:node ./daemon/package.json .
EXPOSE 3001
CMD ["node", "app.js"]
