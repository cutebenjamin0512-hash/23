# 部署到生產環境指南

## 目錄

1. [準備部署](#準備部署)
2. [構建生產版本](#構建生產版本)
3. [部署選項](#部署選項)
4. [驗證部署](#驗證部署)

---

## 準備部署

### 步驟 1：環境檢查

部署前，確保：

```bash
# 1. 所有依賴已安裝
npm install
cd frontend
npm install
cd ..

# 2. 沒有構建錯誤
npm run build

# 3. 環境變數已配置
cat frontend/.env.local

# 4. 代碼已提交到 Git（如使用）
git status
```

### 步驟 2：最終測試

```bash
# 啟動開發服務器進行最後測試
cd frontend
npm run dev
```

測試檢查清單：
- [ ] 搜尋功能正常
- [ ] 可以添加動漫
- [ ] 可以更新進度
- [ ] 可以刪除記錄
- [ ] 數據同步到 Google Sheets
- [ ] 應用響應式設計工作正常

### 步驟 3：構建生產版本

```bash
cd frontend
npm run build
```

生成的文件將在 `frontend/dist/` 目錄中

檢查：
```bash
ls frontend/dist/
# 應該看到：
# - index.html
# - assets/
```

---

## 部署選項

### 選項 1：GitHub Pages（推薦 - 免費）

#### A. 準備 GitHub 倉庫

1. 在 GitHub 上建立新倉庫
2. 名稱：`anime-tracker` 或任意名稱

#### B. 推送代碼

```bash
# 初始化 Git（如未初始化）
git init

# 添加 GitHub 倉庫
git remote add origin https://github.com/你的用戶名/anime-tracker.git

# 推送代碼
git branch -M main
git push -u origin main
```

#### C. 配置 GitHub Pages

1. 在 GitHub 倉庫中，進入「Settings」
2. 在左側找到「Pages」
3. 在「Source」中選擇「Deploy from a branch」
4. 選擇 `main` 分支和 `/ (root)` 文件夾
5. 或選擇 `gh-pages` 分支（需要設置 CI/CD）

#### D. 設置自動部署（使用 GitHub Actions）

創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install
          cd frontend && npm install

      - name: Build
        run: cd frontend && npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

#### E. 驗證部署

1. 等待 GitHub Actions 完成
2. 訪問 `https://你的用戶名.github.io/anime-tracker/`
3. 應該看到應用運行

---

### 選項 2：Netlify（推薦 - 簡單）

#### A. 連接 Netlify

1. 訪問 [Netlify](https://www.netlify.com/)
2. 點擊「Sign up」並用 GitHub 登入
3. 授予 Netlify 訪問 GitHub 的權限

#### B. 建立新站點

1. 點擊「New site from Git」
2. 選擇倉庫
3. 填寫構建設置：
   - **Build command**：`cd frontend && npm run build`
   - **Publish directory**：`frontend/dist`

#### C. 環境變數設置

1. 進入「Site settings」
2. 找到「Build & deploy」 > 「Environment」
3. 添加環境變數：
   - `VITE_TMDB_API_KEY`
   - `VITE_GAS_DEPLOYMENT_URL`

#### D. 部署

點擊「Deploy」，Netlify 將自動構建並部署應用

---

### 選項 3：Vercel

#### A. 連接 Vercel

1. 訪問 [Vercel](https://vercel.com/)
2. 點擊「Continue with GitHub」
3. 授予權限

#### B. 導入項目

1. 點擊「Import Project」
2. 選擇你的倉庫
3. 配置項目：
   - **Framework Preset**：`Vite`
   - **Root Directory**：`frontend`
   - **Build Command**：`npm run build`
   - **Output Directory**：`dist`

#### C. 環境變數

在「Environment Variables」中添加：
- `VITE_TMDB_API_KEY`
- `VITE_GAS_DEPLOYMENT_URL`

#### D. 部署

點擊「Deploy」

---

### 選項 4：傳統服務器（Apache/Nginx）

#### A. 構建應用

```bash
cd frontend
npm run build
```

#### B. 上傳文件

```bash
# 上傳 frontend/dist 中的所有文件到服務器
# 例如使用 SCP：
scp -r frontend/dist/* user@server.com:/var/www/html/anime-tracker/
```

#### C. 配置 Web 服務器

**Nginx 配置示例**：

```nginx
server {
    listen 80;
    server_name anime.example.com;

    root /var/www/html/anime-tracker;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 緩存靜態文件
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache 配置示例**：

```apache
<VirtualHost *:80>
    ServerName anime.example.com
    DocumentRoot /var/www/html/anime-tracker

    <Directory /var/www/html/anime-tracker>
        AllowOverride All
        Require all granted

        # React Router 支持
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>

    # 緩存配置
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
</VirtualHost>
```

---

## 驗證部署

### 檢查清單

- [ ] 應用在部署的 URL 可訪問
- [ ] 搜尋功能正常
- [ ] 可以添加和更新動漫
- [ ] 數據同步到 Google Sheets
- [ ] 本地存儲工作正常
- [ ] 應用在移動設備上響應
- [ ] 沒有控制台錯誤

### 性能檢查

使用 Google PageSpeed Insights：

1. 訪問 https://pagespeed.web.dev/
2. 輸入你的部署 URL
3. 檢查性能分數

目標：
- 桌面：> 90
- 移動：> 80

### SEO 檢查

1. 檢查 `frontend/index.html` 中的元標籤
2. 確保有合適的 `<title>` 和 `<meta description>`
3. 添加圖標和 OG 標籤

---

## 後續優化

### 1. 添加 SSL 証書

確保所有部署都使用 HTTPS：
- GitHub Pages：自動
- Netlify：自動
- Vercel：自動
- 傳統服務器：使用 Let's Encrypt

```bash
# Let's Encrypt（免費）
sudo certbot --nginx -d anime.example.com
```

### 2. 設置 CDN

使用 CDN 加速靜態文件傳遞：
- Cloudflare（免費）
- AWS CloudFront
- Bunny CDN

### 3. 監控和分析

添加分析工具：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 4. 性能優化

- 啟用 Gzip 壓縮
- 優化圖像
- 使用代碼分割
- 啟用緩存

---

## 故障排除

### 部署後搜尋不工作

**原因**：環境變數未正確設置

**解決**：
1. 檢查部署平台的環境變數設置
2. 確保 `VITE_TMDB_API_KEY` 已設置
3. 重新部署

### 樣式或 JavaScript 丟失

**原因**：路徑問題

**解決**：
1. 檢查 `frontend/vite.config.js` 中的 base 路徑
2. 確保所有資源使用相對路徑
3. 檢查網絡標籤中的 404 錯誤

### Google Sheets 同步不工作

**原因**：GAS URL 過期或不正確

**解決**：
1. 檢查 GAS 部署是否仍然有效
2. 重新部署 GAS 腳本
3. 更新部署 URL 到新部署

---

## 回滾和更新

### 更新應用

```bash
# 1. 做出更改
git add .
git commit -m "Feature: 新功能"

# 2. 推送到 GitHub
git push

# 3. 部署平台自動更新
# （GitHub Pages/Netlify/Vercel）
```

### 回滾到之前的版本

```bash
# 查看提交歷史
git log --oneline

# 回滾到特定提交
git revert <commit-hash>
git push
```

---

## 完整檢查清單

部署前：
- [ ] 環境變數已設置
- [ ] 構建成功（無錯誤）
- [ ] 本地測試通過
- [ ] 代碼已提交

部署後：
- [ ] URL 可訪問
- [ ] 功能正常
- [ ] 性能良好（PageSpeed > 80）
- [ ] 無控制台錯誤
- [ ] 移動版本正常

---

## 相關資源

- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [React 部署檢查清單](https://react.dev/learn/start-a-new-react-project)
- [Netlify 文檔](https://docs.netlify.com/)
- [Vercel 文檔](https://vercel.com/docs)

---

祝部署順利！🚀
