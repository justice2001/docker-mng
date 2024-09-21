FROM node:18

WORKDIR /apps
COPY --chown=node:node ./panel/dist/ .
COPY --chown=node:node ./panel/node_modules ./node_modules
COPY --chown=node:node ./common ./node_modules/common
COPY --chown=node:node ./panel/package.json .
COPY --chown=node:node ./ui/dist ./public
EXPOSE 3000
CMD ["node", "app.js"]
