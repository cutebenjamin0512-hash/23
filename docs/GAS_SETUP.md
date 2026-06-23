# 詳細 Google Sheets & GAS 配置指南

## 目錄

1. [Google Sheets 設置](#google-sheets-設置)
2. [Google Apps Script 部署](#google-apps-script-部署)
3. [連接測試](#連接測試)
4. [高級配置](#高級配置)

---

## Google Sheets 設置

### 第 1 步：建立試算表

#### A. 在線方式

1. 訪問 [Google Drive](https://drive.google.com/)
2. 點擊「+ 建立」> 「Google 試算表」
3. 命名為「動漫追蹤記錄」或任意名稱
4. 試算表自動建立並保存

#### B. 通過 Google Sheets 主頁

1. 訪問 [Google Sheets](https://sheets.google.com/)
2. 點擊「+ 建立新試算表」
3. 選擇「空白試算表」
4. 命名並建立

### 第 2 步：複製試算表 ID

在 Google Sheet 中：

```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0
                                        ↑ 複製這個部分 ↑
```

示例 ID：
```
1qpyC0XzvTcKT6EISrx3IQwyZv-G3vLXUq1xqaFjWFA
```

### 第 3 步：建立工作表

1. 在試算表底部，右鍵點擊「Sheet1」
2. 選擇「重新命名」
3. 改為「動漫紀錄」
4. 確認

現在試算表結構如下：

```
試算表
└── 動漫紀錄 (工作表)
    └── (空，將由腳本自動填充)
```

### 第 4 步：設置共享權限

1. 點擊試算表右上角「共享」
2. 設置權限：
   - **個人使用**：選擇「限制存取權限」，添加 Google 帳號
   - **與他人共享**：選擇「擁有連結的所有人都能存取」
3. 確認共享設置

⚠️ **重要**：確保 Apps Script 部署設置中的用戶有權訪問此試算表

---

## Google Apps Script 部署

### 第 1 步：開啟 Apps Script 編輯器

#### 方法 1：從 Google Sheet

1. 在 Google Sheet 中，點擊上方菜單「延伸應用」
2. 選擇「Apps Script」
3. 新頁面打開編輯器

#### 方法 2：直接訪問

1. 訪問 [script.google.com](https://script.google.com/)
2. 點擊「+ 新增專案」
3. 將其與現有 Google Sheet 關聯（可選）

### 第 2 步：複製 GAS 代碼

1. 刪除編輯器中的默認代碼（`function myFunction() {...}`）
2. 打開 `/gas/Code.js`（本項目中）
3. 複製所有代碼
4. 粘貼到 Apps Script 編輯器中

代碼結構：

```javascript
// Code.js
function doPost(e) { ... }          // 入口點
function updateProgress(animeData) { ... }
function getData() { ... }
function deleteRecord(tmdbId) { ... }
// ... 其他輔助函數
```

### 第 3 步：保存代碼

1. 按 Ctrl+S（Windows）或 Cmd+S（Mac）
2. 出現保存提示
3. 點擊「保存」

提示：每次修改後都要保存

### 第 4 步：部署為 Web 應用

#### A. 打開部署菜單

1. 在 Apps Script 編輯器中，點擊右上角「部署」按鈕
2. 選擇「建立新的部署」

#### B. 配置部署設置

在彈出窗口中：

1. **部署類型**：選擇「Web 應用」
2. **執行身份**：選擇你的 Google 帳戶
   - 這決定了腳本以誰的身份執行
   - 選擇擁有 Google Sheet 的帳戶
3. **存取權限**：選擇「任何人」
   - 這允許前端應用調用此 Web App
   - ⚠️ 確保你理解安全含義

#### C. 部署並複製 URL

1. 點擊「部署」
2. 授權 Google 帳戶（如需要）
3. 複製生成的網址

部署 URL 格式：

```
https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallable
```

**保存此 URL** - 在配置前端時需要

### 第 5 步：配置前端應用

創建 `frontend/.env.local` 文件：

```bash
# 複製上一步的部署 URL
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/AKfycbxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/usercallable

# 複製第 2 步的試算表 ID
VITE_SPREADSHEET_ID=1qpyC0XzvTcKT6EISrx3IQwyZv-G3vLXUq1xqaFjWFA

# 從 API_KEYS.md 取得
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

---

## 連接測試

### 測試 1：Google Apps Script 功能

在 Apps Script 編輯器中：

1. 點擊左側「執行」按鈕
2. 選擇函數 `test`
3. 檢查執行日誌（Ctrl+Enter）
4. 應該看到：「GAS 腳本已部署並可工作」

### 測試 2：端對端連接

#### A. 啟動前端應用

```bash
cd frontend
npm run dev
```

#### B. 打開應用

訪問 `http://localhost:5173`

#### C. 添加動漫

1. 在搜尋欄輸入「進擊的巨人」
2. 點擊「搜尋」
3. 點擊結果中的「添加」按鈕

#### D. 檢查 Google Sheet

1. 回到 Google Sheet
2. 刷新頁面
3. 檢查「動漫紀錄」工作表
4. 應該看到新添加的記錄

如果成功，Google Sheet 應該包含：

| TMDB ID | 標題 | 當前集數 | 總集數 | 狀態 | 評分 | ... |
|---------|------|---------|--------|------|------|-----|
| 37854   | 進擊的巨人 | 0 | 139 | 準備看 | 0 | ... |

### 測試 3：數據同步

1. 在應用中更新進度（點擊「更新進度」）
2. 輸入集數，點擊「確定」
3. 回到 Google Sheet 並刷新
4. 「當前集數」應該更新

---

## 高級配置

### 自定義字段

要添加新字段（例如「評論」）：

#### 1. 修改 GAS 代碼

在 `formatRowData()` 函數中添加：

```javascript
case '評論':
  value = animeData.comment || ''
  break
```

在 `getOrCreateHeaders()` 中添加：

```javascript
const headers = [
  'TMDB ID',
  '標題',
  // ... 現有字段
  '評論'  // ← 添加此行
]
```

#### 2. 修改前端代碼

在 `frontend/src/services/localStorage.js` 中：

```javascript
const newAnime = {
  // ... 現有字段
  comment: anime.comment || '',  // ← 添加此行
}
```

#### 3. 更新部署

在 Apps Script 編輯器中：
1. 修改代碼
2. 保存
3. 點擊「部署」> 編輯現有部署
4. 點擊「部署」

### 設置自動觸發器（可選）

定期清理舊數據：

1. 在 Apps Script 編輯器中，點擊「觸發器」
2. 點擊「建立新的觸發器」
3. 配置：
   - **要執行的函數**：選擇一個清理函數
   - **部署類型**：Head
   - **時間**：例如「每天的上午 2:00」
4. 保存

### 限制部署訪問（安全）

⚠️ 當前設置為「任何人」可訪問。如果想限制訪問：

1. 回到部署設置
2. 編輯部署
3. 改變「存取權限」為「指定使用者」或「只有我」
4. 在前端代碼中添加身份驗證邏輯

---

## 故障排除

### 問題：「部署失敗」

**解決**：
1. 確保代碼語法正確（沒有紅色波浪線）
2. 保存代碼後再部署
3. 檢查是否有輸入錯誤

### 問題：「無法寫入 Sheet」

**解決**：
1. 檢查工作表名稱是否為「動漫紀錄」
2. 確保你對該 Sheet 有寫入權限
3. 在 Apps Script 中授予必要的權限

### 問題：「前端無法連接 GAS」

**解決**：
1. 驗證 `.env.local` 中的 URL 完整且正確
2. 確保部署 URL 已正確複製
3. 檢查瀏覽器控制台是否有 CORS 錯誤
4. 確保部署設置為「任何人」

### 問題：「表頭沒有自動創建」

**解決**：
1. 手動在「動漫紀錄」工作表第一行添加表頭
2. 刷新前端應用
3. 嘗試添加新記錄

---

## 監控和調試

### 查看 Apps Script 日誌

1. 在 Apps Script 編輯器中，按 Ctrl+Enter
2. 或點擊左側「執行日誌」
3. 查看函數執行過程中的 `Logger.log()` 輸出

### 查看前端錯誤

1. 打開瀏覽器開發工具（F12）
2. 進入「Console」選項卡
3. 查看是否有紅色錯誤消息

### 查看 Google Sheet 活動

1. 在 Google Sheet 中，點擊「工具」> 「版本歷史記錄」
2. 查看修改時間和內容

---

## 完整檢查清單

- [ ] Google Sheet 已創建
- [ ] 工作表名稱為「動漫紀錄」
- [ ] 試算表 ID 已複製
- [ ] Google Apps Script 編輯器已打開
- [ ] GAS 代碼已複製並保存
- [ ] Web App 已部署
- [ ] 部署 URL 已複製
- [ ] `.env.local` 已配置所有三個環境變數
- [ ] 前端應用可啟動
- [ ] 可以搜尋動漫
- [ ] 可以添加動漫到應用
- [ ] 新記錄出現在 Google Sheet
- [ ] 更新進度會同步到 Google Sheet

---

## 後續步驟

- 參考 [SETUP.md](SETUP.md) 進行完整設置
- 參考 [部署指南](DEPLOYMENT.md) 部署到生產環境
- 查看 [README.md](../README.md) 了解所有功能

---

需要幫助？提交 Issue 或檢查 [API 密鑰指南](API_KEYS.md)。
