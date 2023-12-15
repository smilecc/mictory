FROM node:18

ADD ./ /app
WORKDIR /app

# 安装依赖
RUN npx pnpm i

# 构建前端
WORKDIR /app/packages/client-web
RUN npx pnpm build

# 运行后端
WORKDIR /app/packages/server

ENTRYPOINT ["/bin/sh","-c","cp -r /app/packages/client-web/dist/* /app/client-web-dist && npx prisma db push && npx pnpm start"]
