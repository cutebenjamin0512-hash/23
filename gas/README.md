# Google Apps Script 部署指南

## 目錄

1. [步驟 1：準備 Google Sheet](#步驟-1準備-google-sheet)
2. [步驟 2：創建 Google Apps Script 項目](#步驟-2創建-google-apps-script-項目)
3. [步驟 3：部署為 Web App](#步驟-3部署為-web-app)
4. [步驟 4：配置前端應用](#步驟-4配置前端應用)
5. [故障排除](#故障排除)

---

## 步驟 1：準備 Google Sheet

### 1.1 創建試算表

1. 訪問 [Google Sheets](https://sheets.google.com/)
2. 點擊「+ 建立新試算表」
3. 命名為「動漫追蹤記錄」（或任意名稱）
4. 記下試算表 ID（URL 中的 ID）：
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
   ```

### 1.2 創建工作表

1. 在試算表底部，點擊「+」符號添加新工作表
2. 命名為「動漫紀錄」
3. 讓腳本自動創建表頭（第一次運行時）

---

## 步驟 2：創建 Google Apps Script 項目

### 2.1 開啟 Apps Script 編輯器

1. 在 Google Sheet 中，點擊左上角「延伸應用」
2. 選擇「Apps Script」
3. 這會打開一個新的 Apps Script 項目

### 2.2 複製代碼

1. 刪除 `Code.gs` 中的默認代碼
2. 複製 `/gas/Code.js` 中的所有代碼
3. 粘貼到 `Code.gs` 中
4. 保存（Ctrl+S 或 Cmd+S）

### 2.3 設置屬性

在 Apps Script 編輯器中：

1. 點擊「專案設定」
2. 在腳本屬性部分，如果需要，可以添加試算表 ID：
   - 點擊「新增指令碼屬性」
   - 鍵：`SPREADSHEET_ID`
   - 值：你的試算表 ID（實際上腳本會自動使用當前試算表）

---

## 步驟 3：部署為 Web App

### 3.1 創建新部署

1. 在 Apps Script 編輯器中，點擊右上角「部署」
2. 點擊「建立新的部署」
3. 選擇類型：**新 Web 應用**

### 3.2 配置部署設置

- **類型**：Web 應用
- **執行身份**：選擇你的 Google 帳戶
- **存取權限**：選擇「任何人」（允許前端調用）

### 3.3 複製部署 URL

1. 點擊「部署」
2. 複製「新部署的網址」
3. 格式如下：
   ```
   https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallable
   ```

---

## 步驟 4：配置前端應用

### 4.1 設置環境變數

在 `frontend/.env.local` 中添加：

```bash
# 從 apps.google.com/dev 的部署 URL
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercallable

# 你的試算表 ID
VITE_SPREADSHEET_ID={SPREADSHEET_ID}

# TMDB API Key（見 API_KEYS.md）
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

### 4.2 測試連接

1. 啟動前端應用：`npm run dev`
2. 添加一部動漫
3. 檢查 Google Sheet 是否更新

---

## 故障排除

### 問題 1：「權限被拒絕」

**原因**：部署時權限設置不正確

**解決方案**：
1. 回到 Apps Script 編輯器
2. 點擊「部署」
3. 編輯現有的部署
4. 確保「存取權限」設置為「任何人」

### 問題 2：「找不到工作表」

**原因**：工作表名稱錯誤或不存在

**解決方案**：
1. 確認工作表名稱為「動漫紀錄」
2. 檢查 `Code.js` 中的 `SHEET_NAME` 是否正確
3. 修改後保存並重新部署

### 問題 3：「無法連接到 GAS」

**原因**：部署 URL 錯誤或未配置

**解決方案**：
1. 複製正確的部署 URL
2. 檢查 `.env.local` 中的 URL 是否完整
3. 確保有互聯網連接
4. 檢查瀏覽器控制台的錯誤信息

### 問題 4：表頭未自動創建

**原因**：可能是權限問題或腳本錯誤

**解決方案**：
1. 手動添加表頭到「動漫紀錄」工作表：
   ```
   TMDB ID | 標題 | 當前集數 | 總集數 | 狀態 | 評分 | 備註 | 添加日期 | 最後更新 | 下一集上映日期 | 完成日期
   ```
2. 在 Apps Script 編輯器中點擊「執行」 > 「執行函數」 > 選擇 `test`
3. 檢查日誌（Ctrl+Enter）

---

## 更新部署

如果修改了 GAS 代碼：

1. 在 Apps Script 編輯器中修改代碼
2. 保存更改
3. 點擊「部署」
4. 編輯現有部署
5. 點擊「部署」確認

新的版本將立即生效。

---

## 安全提示

⚠️ **重要**：

- 部署 URL 本質上是公開的，任何人都可以調用它
- 不要在 URL 中包含敏感信息
- 考慮在生產環境中添加簡單的身份驗證（如 API Key）
- 定期檢查試算表中的數據

---

## 高級配置

### 添加自定義表頭

修改 `formatRowData()` 函數以添加更多字段：

```javascript
case '自定義字段':
  value = animeData.customField || ''
  break
```

### 設置觸發器（可選）

在 Apps Script 中設置定時觸發器以清理舊數據：

1. 點擊「觸發器」（時鐘圖標）
2. 點擊「建立新的觸發器」
3. 選擇要執行的函數
4. 設置時間表

---

更多幫助見 [GAS 設定指南](../docs/GAS_SETUP.md)
