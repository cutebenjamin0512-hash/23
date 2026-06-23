# API 密鑰取得指南

## TMDB API

### 簡介

TMDB (The Movie Database) 提供豐富的動漫、電影和電視劇信息，包括：
- 標題和描述
- 海報和背景圖
- 集數信息
- 上映日期
- 評分和評論

### 獲取步驟

#### 1. 訪問 TMDB

在瀏覽器中打開：https://www.themoviedb.org/

#### 2. 創建帳戶

如果還沒有帳戶：
1. 點擊右上角「JOIN TMDB」
2. 填寫註冊表格
3. 同意條款
4. 驗證郵件地址

#### 3. 進入設定

- 點擊右上角的個人頭像
- 選擇「Settings」

#### 4. 導航到 API

- 在左側菜單找到「API」
- 點擊進入

#### 5. 同意條款

如果是第一次：
1. 閱讀並同意用戶協議和開發者協議
2. 選擇你的使用情況（個人、教育、商業等）
3. 點擊「ACCEPT」

#### 6. 複製 API Key

頁面上將顯示：
- **API Key (v3 auth)** ← **複製這個**
- API Read Access Token (v4 auth)（可選）

### 配置到項目

創建 `frontend/.env.local` 文件：

```bash
VITE_TMDB_API_KEY=你的API密鑰
```

示例：
```bash
VITE_TMDB_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### 測試 API

在開發工具中測試（打開瀏覽器控制台）：

```javascript
// 測試搜尋功能
const response = await fetch(
  'https://api.themoviedb.org/3/search/tv?api_key=YOUR_API_KEY&query=進擊的巨人&language=zh-TW'
)
const data = await response.json()
console.log(data)
```

---

## Google APIs

### 簡介

Google APIs 用於：
- Google Sheets：存儲追蹤數據
- Google Apps Script：執行後端邏輯

### Google Sheets API（可選）

通常不需要直接配置，因為：
- 我們使用 Google Apps Script 作為中介
- Apps Script 擁有自動權限

如果需要直接訪問 Sheets：

#### 1. 進入 Google Cloud Console

https://console.cloud.google.com/

#### 2. 創建新項目

1. 點擊「Select a Project」
2. 點擊「NEW PROJECT」
3. 輸入項目名稱
4. 點擊「CREATE」

#### 3. 啟用 Sheets API

1. 搜尋「Google Sheets API」
2. 點擊進入
3. 點擊「ENABLE」

#### 4. 創建憑證

1. 進入「Credentials」
2. 點擊「+ CREATE CREDENTIALS」
3. 選擇「Service Account」（用於後端）或 「OAuth 2.0」（用於前端）

---

## 安全最佳實踐

### ⚠️ 重要注意事項

1. **不要提交密鑰到 Git**
   ```bash
   # .gitignore 應該包含
   .env.local
   .env*.local
   ```

2. **使用環境變數**
   ```javascript
   // ✅ 正確
   const apiKey = import.meta.env.VITE_TMDB_API_KEY
   
   // ❌ 錯誤 - 不要硬編碼
   const apiKey = 'a1b2c3d4e5f6...'
   ```

3. **前端 vs 後端**
   - TMDB API Key：可以在前端使用（無需隱藏）
   - Google Apps Script URL：公開的（任何人都可以看到）
   - 數據庫連接字符串：必須隱藏

4. **定期更新密鑰**
   - 如果懷疑洩露，立即重新生成
   - TMDB：進入設定 > API，點擊「REGENERATE」
   - 自動定期輪轉（如可能）

---

## 故障排除

### API Key 無效

**症狀**：搜尋返回「Unauthorized」或「Invalid API Key」

**解決**：
1. 複製 API Key 時是否完整
2. 檢查是否複製了空格
3. 嘗試重新生成 API Key
4. 確保在正確的 .env 文件中

### API 額度用盡

**症狀**：搜尋停止工作，返回「quota exceeded」

**解決**：
1. 檢查 TMDB API 的調用限制（通常每 10 秒 40 次請求）
2. 實現請求節流
3. 升級到付費計劃（如需要）

### Google Sheets 權限錯誤

**症狀**：無法同步到 Google Sheets

**解決**：
1. 確保 Google Sheet 存在
2. 檢查 Apps Script 部署設置
3. 確保 Sheet 共享給「任何人」（或特定帳戶）

---

## 有效期和限制

### TMDB API

- **有效期**：無限制（需要保持帳戶活跃）
- **請求限制**：40 requests / 10 seconds
- **免費使用**：是，無需付費

### Google APIs

- **有效期**：無限制
- **免費額度**：取決於具體 API
- **Google Sheets**：無額度限制（免費使用）
- **Apps Script**：6 分鐘/天（免費層）

---

## 驗證配置

### 檢查清單

- [ ] TMDB API Key 已複製
- [ ] `.env.local` 中有 `VITE_TMDB_API_KEY`
- [ ] 搜尋功能正常工作
- [ ] Google Sheets 已創建
- [ ] Google Apps Script 已部署
- [ ] `.env.local` 中有部署 URL
- [ ] 同步到 Sheets 正常工作

---

## 更多資源

- [TMDB API 文檔](https://www.themoviedb.org/settings/api)
- [Google Apps Script 文檔](https://developers.google.com/apps-script)
- [Google Sheets API 文檔](https://developers.google.com/sheets/api)

---

需要幫助？查看 [SETUP.md](SETUP.md) 或 [GAS_SETUP.md](GAS_SETUP.md)。
