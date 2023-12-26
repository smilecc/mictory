FROM node:18

ENV VITE_API_HOST $API_HOST

ADD ./ /app
WORKDIR /app

RUN rm -rf /app/packages/client-desktop

# 安装依赖
RUN npx pnpm i

# 构建前端
WORKDIR /app/packages/client-web
RUN npx pnpm build

# 存储构建
WORKDIR /app/client-web-build
RUN cp -r /app/packages/client-web/dist/* /app/client-web-build
RUN rm -rf /app/packages/client-web
RUN npx pnpm store prune

# 运行后端
WORKDIR /app/packages/server

ENTRYPOINT ["/bin/sh","-c","rm -rf /app/client-web-dist/* && cp -r /app/client-web-build/* /app/client-web-dist && npx prisma db push && npx pnpm start"]
