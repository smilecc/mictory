# 快速开始

## 环境要求

- node.js >= 18
- MySQL >= 8
- 公网 IP 地址
- docker compose >= 3

## 通过 Docker Compose 部署

通过 Docker Compose 部署是使用本项目的最快路径，首先您需要克隆本项目。

```bash
git clone https://github.com/smilecc/mictory.git
```

当在服务器上部署时，您需要将 `docker-compose.yaml` 中的 `IP_ADDRESS` 修改为您的服务器公网IP地址。

```yaml
mictory-server:
  image: smilecc/mictory-server:latest
  environment:
    APP_ENV: prod
    APP_SECRET_PATH: /app/config/secret
    IP_ADDRESS: "127.0.0.1" # <----------- 修改为您的公网IP地址
```

如果您是在局域网中使用，可以将该环境变量修改为您在局域网中的IP地址。

### 项目启动

随后运行如下命令来启动项目：

```bash
docker compose up --build
```

如果您的 `docker` 版本比较老旧，可能不包含 `docker compose`，您需要更新您的 `docker`。

等待项目启动，可能需要等待3分钟左右，当您看到如下日志后，说明项目已经启动完毕：

```
mictory-server-1  | [Nest] 140  - 12/18/2023, 7:06:58 PM     LOG [NestApplication] Nest application successfully started +1ms
```

随后访问 `8999` 端口即可访问，例如 http://localhost:8999

顺利启动后，您可以使用 `ctrl + c` 来关闭项目，如果需要常驻并在后台运行，可以运行如下命令：

```bash
docker compose up --build -d
```

### 端口白名单

您需要将如下端口加入直您的主机防火墙（或安全组）的白名单中。

- 8999（http 端口）
- 55555（turn 端口）
