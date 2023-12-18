# 🚧Mictory

Microphone + Victory = Mictory

![](https://i.imgur.com/pRE6gAz.png)

<details><summary><b>其他一些功能截图</b></summary>

#### 输入设备选择

![](https://i.imgur.com/KpLz4KY.png)

#### 私聊界面

![](https://i.imgur.com/hWrHiF7.png)

#### 用户卡片

![](https://i.imgur.com/P3HDzf1.png)

</details>

## 功能规划

**项目还在开发中🚧**，目前已达到初步可用。

- [x] 频道语音聊天
- [x] 频道文字聊天
- [x] AI降噪
- [x] 语音设备选择
- [ ] 频道权限
- [ ] 频道设置
- [ ] i18n 国际化

## 项目部署

在服务器上部署时，您需要确保该主机拥有可被访问的公网IP，将 `docker-compose.yaml` 中的 `IP_ADDRESS` 修改为您的服务器公网IP地址。

如果您是在局域网中使用，可以将该环境变量修改为您在局域网中的IP地址。

```yaml
mictory-server:
  build:
    context: ./
    dockerfile: ./docker/server/Dockerfile
    args:
      API_HOST: /api
  environment:
    APP_ENV: prod
    APP_SECRET_PATH: /app/config/secret
    IP_ADDRESS: "127.0.0.1" # <----------- 修改为您的公网IP地址
    DATABASE_URL: mysql://root:root@mictory-db:3306/mic
```

随后运行如下命令来启动项目：

```bash
docker compose up --build
```

如果您的 `docker` 版本比较老旧，您可能需要更新您的 `docker`，需要 `docker compose` 版本>=3。

等待项目启动，可能需要等待3分钟左右，当您看到如下日志后，说明项目已经启动完毕：

```
mictory-server-1  | [Nest] 140  - 12/18/2023, 7:06:58 PM     LOG [NestApplication] Nest application successfully started +1ms
```

随后访问 `8999` 端口即可访问，例如 http://localhost:8999

顺利启动后，您可以使用 `ctrl + c` 来关闭项目，如果需要常驻并在后台运行，可以运行如下命令：

```bash
docker compose up --build -d
```

## 开发动机

国内使用 Discord 比较困难，所以很多朋友不愿意费劲去使用 Discord，而很多国内的语音软件不是广告很多就是有诸多限制（AI降噪要收费），所以萌生了自制一个语音软件的想法。

## 相关技术栈

如果您对项目感兴趣，并对如下技术栈有一定的了解，欢迎发 Issues 参与项目开发~

- node.js
- TypeScript
- mediasoap
- socket.io
- React
