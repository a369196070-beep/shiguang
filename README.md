# 食光 SHIGUANG · Vue 3 + Spring Boot 每日食谱社区

一个前后端分离、可部署到服务器的菜谱社区：

- **前端**：Vue 3 + Vite，保留原来的视觉设计，负责页面、路由、交互和图片压缩。
- **后端**：Spring Boot 3.5 + MyBatis-Plus + Spring Security + MySQL 8，负责账号、菜谱、收藏、每日菜单、图片上传。
- **部署**：前端构建成静态 `dist/`，后端打成可执行 `jar`，用 Nginx 同源反向代理。

账号、菜谱、收藏、今日菜单都保存在 **MySQL**；上传的封面图保存在服务器本地磁盘（也可以换成 OSS/MinIO）。浏览器 `localStorage` 只用于保存**未发布的草稿**。

---

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | Vue 3.5（Composition API / `<script setup>`）、Vite 7、原生 CSS |
| 后端 | JDK 21、Spring Boot 3.5.7、Spring Web、Spring Security、Validation |
| 数据 | MySQL 8、MyBatis-Plus 3.5.17、Flyway |
| 登录 | Session + Cookie、BCrypt 密码、CSRF Token |
| 图片 | 浏览器端 Canvas 压缩（最长边 1200px，JPEG），服务端存本地磁盘 |
| 部署 | Nginx、systemd、可执行 jar |

前端没有使用 vue-router、Pinia、TypeScript，保持轻量；后端是单体应用，没有引入微服务、Redis、消息队列等额外组件。

---

## 功能

- **每日菜单**：每天按「日期 + 账号」保存一桌「主菜 + 素菜 + 汤/甜」；刷新不变，换一桌会保存新搭配，不同账号看到不同菜单。
- **24 道预设菜谱 / 5 位预设用户**：首次启动通过 Flyway 自动写入。
- **菜谱详情**：食材清单可勾选、分步骤做法、小贴士、相关推荐、打印排版。
- **账号**：注册、登录、退出；登录状态通过服务端 Session 保持。
- **收藏**：首页、发现页、详情页收藏/取消收藏，收藏数写入数据库。
- **上传拿手菜**：菜名、分类、描述、时间、份量、难度、封面、食材、步骤、小贴士、标签；支持实时预览、草稿、未登录先写后登录。
- **发现**：按菜名、食材、作者、标签搜索；按分类、难度筛选；按最新、快手、人气排序。
- **我的厨房**：查看自己上传的菜谱和收藏数量，删除自己的菜谱。
- **响应式**：桌面顶部导航 + 移动端底部标签栏，适配 1440 / 390 / 375 宽度。

---

## 本地运行

### 0. 环境要求

- Node.js **20.19+**（推荐 22 / 24）
- JDK **21**
- Maven **3.9+**（也可以用项目内 `server/.tools/apache-maven-3.9.11`）
- MySQL **8.0+**

### 1. 创建数据库

在 MySQL 中执行（密码请按需修改）：

```sql
CREATE DATABASE IF NOT EXISTS shiguang
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'shiguang'@'127.0.0.1' IDENTIFIED BY 'shiguang123';
GRANT ALL PRIVILEGES ON shiguang.* TO 'shiguang'@'127.0.0.1';
FLUSH PRIVILEGES;
```

表结构和预设数据由 Flyway 在第一次启动时自动创建：

- `server/src/main/resources/db/migration/V1__schema.sql`
- `server/src/main/resources/db/migration/V2__seed.sql`（5 位用户、24 道菜、标签、食材、步骤）

### 2. 启动后端

本机开发环境最简单的方式：

```powershell
cd D:\goz\shiguang\server
.\start-backend.ps1
```

脚本会自动：

- 检查 3307 开发 MySQL，没启动就拉起来；
- 检查 Java 21；
- 没有 jar 时自动用项目内 Maven 打包；
- 启动后端并等待 8080 就绪。

常用参数：

```powershell
.\start-backend.ps1 -Restart   # 重启后端
.\start-backend.ps1 -Rebuild   # 重新打包并重启
```

如果 PowerShell 提示禁止运行脚本，用：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-backend.ps1
```

日志默认在：

```text
C:\Users\你的用户名\AppData\Local\Temp\shiguang-backend.log
```

手动启动方式（适合已经装好 Java/Maven 的环境）：

```powershell
cd D:\goz\shiguang\server

# 首次需要打包；项目内已带一份 Maven
.\.tools\apache-maven-3.9.11\bin\mvn.cmd -DskipTests package

# 默认连接 127.0.0.1:3306/shiguang（用户 shiguang）
java -jar target\shiguang-server.jar
```

如果使用项目内已经初始化好的开发数据库（端口 **3307**）：

```powershell
java -jar target\shiguang-server.jar --spring.profiles.active=dev
```

启动成功后：

```text
http://127.0.0.1:8080/api/v1/bootstrap
```

应返回 `users`、`recipes`、`categories` 等 JSON。

### 3. 启动前端

本机开发环境推荐用项目内脚本（会使用自带的 Node 路径，不依赖系统 PATH）：

```powershell
cd D:\goz\shiguang
.\start-frontend.ps1
```

- 前台运行，按 `Ctrl + C` 停止。
- 如果 5173 已在运行，脚本会直接提示并退出。
- 要重启：

```powershell
.\start-frontend.ps1 -Restart
```

打开：

```text
http://127.0.0.1:5173/
```

也可以使用普通的 npm 命令（前提是系统已安装 Node.js 20.19+）：

```powershell
cd D:\goz\shiguang
npm install
npm run dev
```

Vite 已配置代理，把 `/api` 和 `/uploads` 转发到 `http://127.0.0.1:8080`，所以前端不需要单独处理跨域。

### 4. 体验账号

| 邮箱 | 密码 |
| --- | --- |
| `xiaoman@shiguang.app` | `123456` |

也可以点登录框里的「一键体验」。其他预设账号：`aze@shiguang.app`、`momo@shiguang.app`、`laozhou@shiguang.app`，密码同为 `123456`。

> 这些账号只用于演示。上线前请删除或修改这些账号，尤其是 `123456` 密码。

---

## 生产构建与预览

```powershell
cd D:\goz\shiguang
npm run build
npm run preview
```

`npm run preview` 会启动一个带 `/api`、`/uploads` 代理的本地静态服务器（默认 `http://127.0.0.1:4173/`），用于验证**构建后的 `dist/`**。

> **不要用 Live Server 预览完整功能。** Live Server 只能提供静态文件，不能把 `/api` 代理到 8080，登录、收藏、上传都会失败。请使用 `.\start-frontend.ps1`（开发模式）或 `npm run preview`（构建产物预览）。

构建产物：

```text
dist/
├─ index.html
├─ favicon.svg
└─ assets/
   ├─ index-*.js
   └─ style-*.css
```

---

## 部署到服务器（Nginx + jar）

下面以 Ubuntu、域名为 `example.com`、目录 `/opt/shiguang` 为例。

### 1. 准备目录和数据库

```bash
sudo useradd --system --home /opt/shiguang --shell /usr/sbin/nologin shiguang || true
sudo mkdir -p /opt/shiguang /var/www/shiguang /var/lib/shiguang/uploads /etc/shiguang
sudo chown -R shiguang:shiguang /opt/shiguang /var/lib/shiguang/uploads
```

数据库：

```sql
CREATE DATABASE shiguang CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'shiguang'@'127.0.0.1' IDENTIFIED BY '换成强密码';
GRANT ALL PRIVILEGES ON shiguang.* TO 'shiguang'@'127.0.0.1';
FLUSH PRIVILEGES;
```

### 2. 上传构建产物

在本地执行：

```powershell
cd D:\goz\shiguang
npm run build
```

把 `dist/` 里的内容上传到服务器：

```text
/var/www/shiguang/
├─ index.html
├─ favicon.svg
└─ assets/
```

把后端 jar 上传到：

```text
/opt/shiguang/shiguang-server.jar
```

### 3. 配置环境变量

复制模板并修改密码：

```bash
sudo cp deploy/shiguang.env.example /etc/shiguang/shiguang.env
sudo chmod 600 /etc/shiguang/shiguang.env
sudo editor /etc/shiguang/shiguang.env
```

至少修改：

```ini
DB_PASSWORD=你的数据库密码
SESSION_COOKIE_SECURE=true
UPLOAD_DIR=/var/lib/shiguang/uploads
```

如果前端和 API 不在同一个域名，需要额外设置：

```ini
ALLOWED_ORIGINS=https://你的前端域名
```

同源部署（Nginx 同时代理前端和 `/api`）时留空即可，后端不会注册 CORS，避免同源 POST 被误判。

### 4. 安装 systemd 服务

```bash
sudo cp deploy/shiguang.service.example /etc/systemd/system/shiguang.service
sudo systemctl daemon-reload
sudo systemctl enable --now shiguang
sudo systemctl status shiguang
sudo journalctl -u shiguang -f
```

### 5. 配置 Nginx

```bash
sudo cp deploy/nginx-shiguang.conf.example /etc/nginx/conf.d/shiguang.conf
sudo editor /etc/nginx/conf.d/shiguang.conf   # 修改 server_name
sudo nginx -t
sudo systemctl reload nginx
```

模板已经包含：

- 静态文件根目录 `/var/www/shiguang`
- `/api/` 反向代理到 `127.0.0.1:8080`
- `/uploads/` 反向代理到后端图片目录
- `client_max_body_size 12m`（后端限制单张图片 10MB）
- 静态资源长缓存、`index.html` 不缓存

### 6. HTTPS

用 Certbot 或云厂商证书配置 443，并确保：

```ini
SESSION_COOKIE_SECURE=true
```

如果使用 HTTPS，`PUBLIC_BASE_URL` 可以留空（图片用相对 `/uploads/...`），也可以设成：

```ini
PUBLIC_BASE_URL=https://example.com
```

### 7. 防火墙

只对外开放 80/443；MySQL 3306 和 Spring Boot 8080 不要暴露到公网。Nginx 和 jar 在同一台机器时，后端监听 `127.0.0.1:8080` 即可。

---

## 配置项

后端通过环境变量覆盖 `application.yml`：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | MySQL 地址 |
| `DB_PORT` | `3306` | MySQL 端口 |
| `DB_NAME` | `shiguang` | 数据库名 |
| `DB_USER` | `shiguang` | 数据库用户 |
| `DB_PASSWORD` | `shiguang123` | 数据库密码；生产必须修改 |
| `SERVER_PORT` | `8080` | 后端端口 |
| `UPLOAD_DIR` | `./uploads` | 图片保存目录 |
| `PUBLIC_BASE_URL` | 空 | 图片 URL 前缀；空则返回 `/uploads/...` |
| `ALLOWED_ORIGINS` | 本地 5173/4173 | 允许的跨域前端地址；同源部署留空 |
| `SESSION_COOKIE_SECURE` | `false` | HTTPS 环境设为 `true` |

前端开发/预览的代理地址写在 `vite.config.js`，默认指向 `127.0.0.1:8080`。

---

## API 一览

所有接口前缀为 `/api/v1`。除公开 GET 和登录/注册外，都需要 Session Cookie；写操作还需要 CSRF 请求头 `X-XSRF-TOKEN`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/auth/csrf` | 获取 CSRF Token，同时种下 Cookie |
| POST | `/auth/register` | 注册并登录 |
| POST | `/auth/login` | 登录 |
| GET | `/auth/me` | 当前登录用户；游客返回 `authenticated=false` |
| POST | `/auth/logout` | 退出并销毁 Session |
| GET | `/bootstrap` | 首页/发现页初始化数据（用户、菜谱、收藏、菜单、分类） |
| GET | `/meta` | 分类、标签、难度等元数据 |
| GET | `/recipes` | 全部菜谱 |
| GET | `/recipes/{id}` | 菜谱详情 |
| POST | `/recipes` | 发布菜谱 |
| DELETE | `/recipes/{id}` | 删除自己的菜谱 |
| POST | `/recipes/{id}/favorite` | 收藏 |
| DELETE | `/recipes/{id}/favorite` | 取消收藏 |
| GET | `/me/recipes` | 我的菜谱 |
| GET | `/me/favorites` | 我的收藏 |
| GET | `/menu/today` | 今日菜单 |
| POST | `/menu/shuffle` | 换一桌并保存 |
| POST | `/uploads/image` | 上传封面（multipart，字段名 `file`） |

错误响应统一为：

```json
{
  "status": 400,
  "message": "至少填写 2 种食材。",
  "fields": {},
  "timestamp": "2026-10-22T16:00:00"
}
```

---

## 数据与安全说明

- **数据表**：`users`、`recipes`、`ingredients`、`recipe_steps`、`tags`、`recipe_tags`、`favorites`、`daily_menus`。
- **图片**：默认保存在 `UPLOAD_DIR`，数据库只存 `/uploads/xxx.jpg` 路径；生产要备份这个目录。
- **密码**：BCrypt 哈希，不返回给前端。
- **会话**：HttpOnly + SameSite=Lax Cookie；登录后轮换 Session ID。
- **CSRF**：Cookie + `X-XSRF-TOKEN` 双提交校验。
- **上传限制**：JPG / PNG / WebP，单张 ≤10MB；校验文件头/图片内容，随机文件名，避免路径穿越。
- **草稿**：只有未发布草稿保存在浏览器 `localStorage` 的 `shiguang.draft.v1`，不会上传到服务器。
- **演示账号**：5 个预设账号共用 `123456`，仅用于演示；上线前请删除或改密码。
- 这是一个可运行的全栈示例，不包含邮箱验证、找回密码、举报/审核、限流、对象存储直传等生产能力；正式运营前需要补齐。

### 备份与重置

```bash
# 备份数据库
mysqldump -u shiguang -p shiguang > shiguang.sql

# 备份图片
tar czf uploads.tar.gz -C /var/lib/shiguang uploads
```

重置演示数据：删除并重建数据库，再重启后端让 Flyway 重新执行 `V1`/`V2`；同时清空 `UPLOAD_DIR`。

---

## 目录结构

```text
goz/
├─ index.html                    # Vite 开发入口
├─ package.json
├─ start-frontend.ps1            # 本机一键启动前端
├─ vite.config.js                # 端口、/api 与 /uploads 代理、构建输出
├─ src/
│  ├─ main.js
│  ├─ App.vue
│  ├─ styles.css
│  ├─ data/seed.js               # 预设数据源（生成 SQL 用）
│  ├─ lib/
│  │  ├─ api.js                  # fetch 封装、CSRF、错误处理
│  │  ├─ store.js                # 后端数据 + 草稿状态
│  │  ├─ router.js
│  │  ├─ ui.js
│  │  └─ format.js
│  ├─ components/
│  └─ views/
├─ server/
│  ├─ pom.xml
│  ├─ src/main/java/com/shiguang/
│  │  ├─ web/                    # Controller
│  │  ├─ service/                # 业务逻辑
│  │  ├─ mapper/                 # MyBatis-Plus Mapper
│  │  ├─ domain/                 # 实体
│  │  ├─ dto/
│  │  ├─ security/
│  │  ├─ config/
│  │  └─ common/
│  ├─ src/main/resources/
│  │  ├─ application.yml
│  │  ├─ application-dev.yml
│  │  ├─ application-prod.yml
│  │  └─ db/migration/
│  ├─ scripts/generate-seed.mjs
│  ├─ start-backend.ps1          # 本机一键启动/重启后端
│  └─ target/shiguang-server.jar
├─ deploy/
│  ├─ nginx-shiguang.conf.example
│  ├─ shiguang.service.example
│  └─ shiguang.env.example
├─ dist/                         # 已构建的前端静态文件
└─ README.md
```

---

## 已验证

在 Edge headless + Playwright 下对**接入后端后的版本**做过：

- 前端主流程 19/19：登录、刷新保持、账号菜单、收藏持久化、搜索、带图片发布、详情回显、删除、退出。
- 生产构建 12/12：`dist/` 通过反向代理登录、发布、图片 `/uploads` 访问、删除、无资源错误。
- 注册与多账号 10/10：新用户注册、空厨房、菜单隔离、刷新保持。
- 后端安全 17/17：CSRF、未登录拦截、Session 轮换、伪造图片拒绝、越权删除拒绝、重复邮箱、CORS、退出失效。

另外人工检查了桌面 1440px 与移动 390px 的首页、发现、详情、上传、登录/注册弹窗。

---

## 常见问题

**登录返回 403 / `Invalid CORS request`？**  
确认前端不是直接请求 `8080`，而是通过 Vite 代理或 Nginx 同源代理访问。开发环境用 `npm run dev`；预览构建用 `npm run preview`。如果前后端确实跨域，在 `ALLOWED_ORIGINS` 里加上前端地址并重启后端。

**登录后刷新又变成游客？**  
检查浏览器是否禁用 Cookie，以及反向代理是否转发 `Cookie` 和 `Set-Cookie`。HTTPS 环境要把 `SESSION_COOKIE_SECURE` 设为 `true`；HTTP 本地调试保持 `false`。

**图片上传后 404？**  
确认 `UPLOAD_DIR` 存在且可写，Nginx 的 `/uploads/` 已代理到后端；如果设置了 `PUBLIC_BASE_URL`，确认它和实际访问域名一致。

**数据库连不上？**  
本项目默认 `127.0.0.1:3306`；`dev` profile 使用 `127.0.0.1:3307`。确认 MySQL 已启动、库和用户已创建，并检查 `DB_PORT`。

**为什么不用 Live Server？**  
Live Server 只提供静态文件，不能代理 `/api` 和 `/uploads`，完整功能会 401/404。开发用 `npm run dev`，验证构建用 `npm run preview`，生产用 Nginx。

**旧版 localStorage 数据能迁移吗？**  
不能自动迁移。新版账号、菜谱、收藏以 MySQL 为准；旧浏览器里的演示数据不会导入。
