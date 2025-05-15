# 开发阶段
FROM node:18-alpine  as build-stage
# 设置工作目录
WORKDIR /app
COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine as production-stage

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/.env.prod /app/.env.prod
COPY --from=build-stage /app/ecosystem.config.js /app/ecosystem.config.js

WORKDIR /app

RUN mkdir -p /app/log && chown -R node:node /app/log && chmod -R 755 /app/log
# 环境变量
ENV NODE_ENV production

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install --legacy-peer-deps  --omit=dev

EXPOSE 3000

CMD ["npm", "run","prod"]
USER node

RUN ls -la /app/dist
