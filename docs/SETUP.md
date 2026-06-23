# 完整設置指南

## 目錄

1. [系統要求](#系統要求)
2. [安裝步驟](#安裝步驟)
3. [配置 TMDB API](#配置-tmdb-api)
4. [配置 Google Sheets & GAS](#配置-google-sheets--gas)
5. [啟動應用](#啟動應用)
6. [驗證安裝](#驗證安裝)

---

## 系統要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- 現代瀏覽器（Chrome、Firefox、Safari、Edge）
- Google 帳戶
- 互聯網連接

檢查版本：
```bash
node --version
npm --version
```

---

## 安裝步驟

### 1. 克隆或下載項目

```bash
# 如果使用 Git
git clone <repository-url>
cd 23

# 或直接進入項目目錄
cd /workspaces/23
```

### 2. 安裝依賴

```bash
# 安裝根目錄依賴
npm install

# 安裝前端依賴
cd frontend
npm install
cd ..
```

### 3. 驗證安裝

```bash
# 檢查所有依賴是否正確安裝
npm list --depth=0
```

---

## 配置 TMDB API

### 步驟 1：訪問 TMDB 網站

1. 訪問 [TMDB 官網](https://www.themoviedb.org/)
2. 點擊右上角「登入」

### 步驟 2：註冊或登入

- 如果沒有帳號，點擊「註冊」
- 填寫必要信息
- 驗證郵件

### 步驟 3：獲取 API Key

1. 登入後，進入「設定」（左側菜單或右上角個人菜單）
2. 在左側找到「API」
3. 接受用戶協議
4. 選擇「API Key」類型
5. 複製 **API Key (v3 auth)**

### 步驟 4：配置到項目

在 `frontend/.env.local` 中添加：

```bash
VITE_TMDB_API_KEY=你的_API_KEY_此處
```

**示例**：
```bash
VITE_TMDB_API_KEY=abcdef1234567890abcdef1234567890
```

### 驗證 API

在前端應用中：
1. 啟動應用
2. 嘗試搜尋「進擊的巨人」或任何動漫
3. 應該看到搜尋結果

---

## 配置 Google Sheets & GAS

### 完整步驟見：[GAS_SETUP.md](GAS_SETUP.md)

快速概述：

1. **創建 Google Sheet**
   - 訪問 Google Sheets
   - 建立新試算表
   - 記下試算表 ID

2. **創建 Google Apps Script**
   - 在 Google Sheet 中開啟 Apps Script
   - 複製 `/gas/Code.js` 代碼
   - 保存

3. **部署為 Web App**
   - 點擊「部署」
   - 選擇「新 Web 應用」
   - 複製部署 URL

4. **配置環境變數**

在 `frontend/.env.local` 中：

```bash
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallable
VITE_SPREADSHEET_ID={SPREADSHEET_ID}
```

---

## 啟動應用

### 開發模式

```bash
cd frontend
npm run dev
```

應用將在 `http://localhost:5173` 打開（自動）。

### 生產構建

```bash
cd frontend
npm run build
```

生成的文件在 `frontend/dist/` 目錄中。

### 預覽生產版本

```bash
cd frontend
npm run preview
```

---

## 驗證安裝

### 1. 檢查前端

- [ ] 應用在瀏覽器中打開
- [ ] 能看到「🎬 動漫追蹤系統」標題
- [ ] 搜尋欄可以輸入

### 2. 檢查 TMDB API

- [ ] 在搜尋欄輸入「進擊的巨人」
- [ ] 看到搜尋結果（帶圖片和信息）
- [ ] 點擊「添加」按鈕

### 3. 檢查 Google Sheets 同步

- [ ] 動漫卡片出現在應用中
- [ ] 檢查 Google Sheet 是否添加了新記錄
- [ ] 更新進度後，Google Sheet 也更新

### 4. 檢查本地存儲

- [ ] 刷新頁面後，添加的動漫仍然存在
- [ ] 打開瀏覽器開發工具（F12）
- [ ] 檢查 Application > Local Storage

---

## 常見問題

### Q1：搜尋不返回結果

**可能原因**：
- API Key 不正確
- 互聯網連接問題

**解決**：
1. 檢查 `.env.local` 中的 API Key
2. 嘗試重啟開發服務器

### Q2：GAS 無法同步

**可能原因**：
- 部署 URL 不正確
- 工作表權限問題

**解決**：
1. 檢查 `.env.local` 中的部署 URL
2. 確保工作表共享給「任何人」

### Q3：樣式不顯示

**可能原因**：
- CSS 文件未加載

**解決**：
1. 清除瀏覽器快取
2. 硬刷新頁面（Ctrl+Shift+R 或 Cmd+Shift+R）

### Q4：「找不到文件」錯誤

**可能原因**：
- 依賴未安裝

**解決**：
```bash
cd frontend
npm install
npm run dev
```

---

## 下一步

1. [部署到生產環境](DEPLOYMENT.md)
2. [自定義應用](../README.md#自定義)
3. [貢獻代碼](../README.md#貢獻)

---

## 技術支持

如果遇到問題：

1. 檢查 [故障排除](#常見問題)
2. 查看瀏覽器控制台錯誤（F12 > Console）
3. 查看 [API 密鑰指南](API_KEYS.md)
4. 提交 Issue 或 PR

---

**設置完成！祝你使用愉快！** 🎉
