FROM node:24-alpine AS builder-stage
WORKDIR usr/local/app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:24-alpine AS final-stage
ENV NODE_ENV=production
EXPOSE ${PORT}
COPY ./package.json ./package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder-stage usr/local/app/prisma.config.ts .
COPY --from=builder-stage usr/local/app/dist ./dist
COPY --from=builder-stage usr/local/app/prisma ./prisma
CMD ["npm", "run", "start:prod"]
USER node
