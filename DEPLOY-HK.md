# 香港 VPS 上线教程（从零开始）

适合：**大陆 + 台湾 + 美国** 宾客都能访问。  
技术栈：GitHub → 香港 VPS → Docker → SQLite（RSVP 数据）→ Nginx HTTPS。

预计时间：**2–3 小时**（含买域名、等 DNS 生效）。

---

## 总览

```
你的 Mac  ──push──▶  GitHub（私有仓库）
                         │
香港 VPS  ◀──clone───────┘
    │
    ├─ Docker 跑 Next.js（端口 3000）
    ├─ ./data/rsvp.db 存 RSVP
    └─ Nginx + HTTPS（需要域名）
```

**没有域名可以先部署**，用 `http://服务器IP:3000` 测试（仅你自己），  
**正式发给宾客前必须买域名并开 HTTPS**（微信分享、手机浏览器都需要）。

---

## 第一步：买香港 VPS（约 15 分钟）

推荐任选一家，选 **香港 (Hong Kong)** 机房：

| 商家 | 说明 |
|------|------|
| [阿里云国际](https://www.alibabacloud.com) | 选 Hong Kong，轻量 2核2G 够用 |
| [腾讯云国际](https://www.tencentcloud.com) | 选 Hong Kong |
| [Vultr](https://www.vultr.com) | Location 选 Hong Kong |

**配置建议**：2 核 CPU / 2GB 内存 / 40GB 磁盘 / Ubuntu 22.04 或 24.04

创建后记下：

- **公网 IP**：例如 `123.45.67.89`
- **SSH 密码** 或 **SSH 密钥**

本地终端测试能否登录：

```bash
ssh root@你的公网IP
```

---

## 第二步：买域名（约 10 分钟，~$10/年）

推荐 **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** 或 Namecheap：

1. 注册 Cloudflare 账号
2. **Domain Registration** → 搜索想要的域名，例如：
   - `wangwedding2027.com`
   - `zheandsabrina.com`
3. 付款完成

后面 DNS 也在 Cloudflare 管理（免费）。

---

## 第三步：把代码推到 GitHub（约 15 分钟）

### 3.1 在 GitHub 创建私有仓库

1. 打开 [https://github.com/new](https://github.com/new)
2. Repository name：`wedding-invitation`
3. 选 **Private**（婚礼信息、RSVP 逻辑不公开）
4. **不要**勾选 README / .gitignore（本地已有）
5. 点 **Create repository**

### 3.2 在 Mac 上推送代码

在项目目录执行（把 `YOUR_GITHUB_USERNAME` 换成你的 GitHub 用户名）：

```bash
cd /Users/zhewang/Documents/wedding-invitation

git add .
git commit -m "Initial commit — wedding invitation ready for HK VPS deploy"

git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/wedding-invitation.git
git push -u origin main
```

第一次 push 会要求 GitHub 登录（浏览器或 Personal Access Token）。

> **仓库约 150MB+**（含视频），push 可能需要几分钟。

---

## 第四步：域名 DNS 指向 VPS（约 5 分钟 + 等待生效）

在 **Cloudflare** → 你的域名 → **DNS** → **Records**：

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | 你的 VPS 公网 IP | DNS only（灰云） |
| A | `www` | 你的 VPS 公网 IP | DNS only（灰云） |

保存后等 **5–30 分钟**（有时 up to 2 小时）。

检查是否生效：

```bash
ping 你的域名.com
# 应显示 VPS 的 IP
```

---

## 第五步：在香港 VPS 上部署（约 20 分钟）

SSH 登录 VPS：

```bash
ssh root@你的公网IP
```

### 5.1 安装 Docker 并拉代码

```bash
apt-get update && apt-get install -y git

git clone https://github.com/YOUR_GITHUB_USERNAME/wedding-invitation.git /var/www/wedding-invitation
cd /var/www/wedding-invitation

cp .env.production.example .env
nano .env
```

在 `.env` 里把 `ADMIN_PASSWORD` 改成**你自己记得住的强密码**（`/admin` 登录用）。

然后一键安装：

```bash
chmod +x deploy/*.sh
bash deploy/install-vps.sh
```

或手动：

```bash
docker compose build
docker compose up -d
```

检查是否运行：

```bash
curl http://127.0.0.1:3000/api/rsvp/health
# 期望: {"ok":true,"driver":"sqlite",...}
```

### 5.2 配置 HTTPS（需要域名已解析到本机）

```bash
bash deploy/setup-ssl.sh 你的域名.com
```

按提示输入邮箱（Let's Encrypt 用）。完成后访问：

```
https://你的域名.com
https://你的域名.com/admin
```

---

## 第六步：三地测试清单

- [ ] **美国**：浏览器打开首页、视频、RSVP 提交
- [ ] **台湾**：Line / iMessage 发链接给亲友试开
- [ ] **大陆**：微信发链接，4G 网络打开（关 WiFi 试）
- [ ] `/api/rsvp/health` 返回 `ok: true`
- [ ] `/admin` 能登录，能看到测试 RSVP
- [ ] 导出 CSV 正常

---

## 日常运维

### 更新网站（改完代码后）

**Mac 上：**

```bash
git add .
git commit -m "Update content"
git push
```

**VPS 上：**

```bash
cd /var/www/wedding-invitation
git pull
docker compose build
docker compose up -d
```

### 备份 RSVP 数据

```bash
# VPS 上
cp /var/www/wedding-invitation/data/rsvp.db ~/rsvp-backup-$(date +%Y%m%d).db
```

定期下载到 Mac 保存。

### 查看日志

```bash
cd /var/www/wedding-invitation
docker compose logs -f web
```

---

## 常见问题

### 大陆打不开或很慢？

- 确认 VPS 在 **香港**（不是美国）
- 视频太大（共 ~58MB），可考虑压缩后重新 deploy
- 首页视频是 HEVC 格式，部分 Android 不播 → 建议转成 H.264

### 没有域名能先测吗？

可以，VPS 上临时改 `docker-compose.yml` 端口映射为 `"3000:3000"`，  
访问 `http://公网IP:3000`。  
**不要把这个链接发给宾客**（无 HTTPS、微信可能拦截）。

### RSVP 数据存在哪？

`/var/www/wedding-invitation/data/rsvp.db`（SQLite 文件）。

### 忘记 admin 密码？

```bash
nano /var/www/wedding-invitation/.env
# 改 ADMIN_PASSWORD
docker compose up -d
```

---

## 费用估算（年）

| 项目 | 大约 |
|------|------|
| 香港 VPS | $60–120 / 年 |
| 域名 .com | $10–15 / 年 |
| GitHub 私有仓库 | 免费 |
| **合计** | **约 $70–135 / 年** |

---

## 你现在要做的顺序

1. ✅ 本地代码已准备好 Docker 部署文件
2. ⬜ 买香港 VPS，记下 IP
3. ⬜ 买域名（Cloudflare）
4. ⬜ GitHub 建私有仓库 + `git push`
5. ⬜ Cloudflare DNS 指到 VPS IP
6. ⬜ VPS 上 `git clone` + `install-vps.sh`
7. ⬜ `setup-ssl.sh 你的域名.com`
8. ⬜ 三地测试后发链接给宾客

有任何一步卡住，把**卡在哪一步 + 报错截图/文字**发给我，我帮你看。
