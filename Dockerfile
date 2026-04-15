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
COPY --from=builder-stage usr/local/app/dist ./
CMD ["node", "./src/main.js"]
USER node
