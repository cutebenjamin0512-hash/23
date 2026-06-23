# 快速開始指南 🚀

**完成時間：約 15 分鐘**

## 5 分鐘快速設置

### 1️⃣ 取得 TMDB API Key（2 分鐘）

1. 訪問 https://www.themoviedb.org/
2. 註冊帳號（如無）
3. 進入 Settings > API
4. 複製 **API Key (v3 auth)**

### 2️⃣ 設置 Google Sheets & GAS（5 分鐘）

1. 建立 Google Sheet：https://sheets.google.com/
2. 記下試算表 ID（URL 中的 ID）
3. 在 Sheet 中點擊「延伸應用」> 「Apps Script」
4. 複製 `/gas/Code.js` 代碼到編輯器
5. 保存並點擊「部署」> 「新 Web 應用」
6. 複製部署 URL

### 3️⃣ 配置前端應用（3 分鐘）

```bash
# 進入項目目錄
cd /workspaces/23

# 安裝依賴
npm install
cd frontend && npm install

# 創建環境文件
cat > .env.local << EOF
VITE_TMDB_API_KEY=你的_API_KEY
VITE_GAS_DEPLOYMENT_URL=https://script.google.com/macros/d/YOUR_ID/usercallable
VITE_SPREADSHEET_ID=你的_Sheet_ID
EOF

# 啟動應用
npm run dev
```

訪問 http://localhost:5173 🎉

---

## 完整項目結構

```
23/
├── frontend/                    # React 前端應用
│   ├── src/
│   │   ├── components/         # React 組件
│   │   │   ├── AnimeCard.jsx   # 動漫卡片
│   │   │   ├── Board.jsx       # 看板
│   │   │   ├── SearchBar.jsx   # 搜尋欄
│   │   │   ├── ProgressBar.jsx # 進度條
│   │   │   └── *.css          # 樣式文件
│   │   ├── services/           # API 服務
│   │   │   ├── tmdbApi.js     # TMDB API
│   │   │   ├── localStorage.js # 本地存儲
│   │   │   └── gasService.js   # Google Apps Script
│   │   ├── App.jsx            # 主應用
│   │   ├── main.jsx           # 入口
│   │   └── *.css              # 全局樣式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── gas/                         # Google Apps Script
│   ├── Code.js                # GAS 主邏輯
│   └── README.md              # GAS 部署指南
│
├── docs/                        # 文檔
│   ├── SETUP.md               # 完整設置指南
│   ├── GAS_SETUP.md           # GAS 詳細指南
│   ├── API_KEYS.md            # API 密鑰指南
│   └── DEPLOYMENT.md          # 部署指南
│
├── README.md                    # 項目概覽
├── package.json                # 根 package.json
└── .gitignore                  # Git 忽略文件
```

---

## 核心功能

### ✅ 已實現

- ✨ **卡片式追番牆** - 美觀的動漫展示
- 🎯 **三看板系統** - 準備看/觀看中/已完結
- 📊 **進度條動畫** - 視覺化進度
- 🔍 **TMDB API 搜尋** - 自動獲取劇集信息
- 💾 **Google Sheets 同步** - 通過 GAS 存儲數據
- 📱 **響應式設計** - 支持桌面和移動
- 🎨 **現代 UI** - 漸變、動畫、流暢過渡

### 🎯 可選功能（未來版本）

- 🔐 用戶登入（Google 登入）
- 📅 看板日期提醒
- ⭐ 評分和評論
- 📥 數據導入/導出
- 🌙 暗黑模式
- 📖 離線模式

---

## 故障排除

### 搜尋返回空結果

```bash
# 檢查 API Key
echo $VITE_TMDB_API_KEY

# 重啟開發服務器
npm run dev
```

### 無法同步到 Google Sheets

```bash
# 檢查部署 URL 是否正確
cat frontend/.env.local | grep GAS_DEPLOYMENT_URL

# 確保工作表名稱為「動漫紀錄」
```

### 樣式不顯示

```bash
# 清除快取並硬刷新
# Ctrl+Shift+R（Windows）或 Cmd+Shift+R（Mac）
```

---

## 下一步

1. **完整設置**：閱讀 [docs/SETUP.md](docs/SETUP.md)
2. **自定義**：修改 `frontend/src/App.css` 調整樣式
3. **部署**：遵循 [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
4. **擴展**：添加新功能或自定義字段

---

## 技術棧

```
React 18 + Vite        → 快速構建
TMDB API              → 動漫數據
Google Sheets + GAS   → 數據存儲
CSS3 動畫             → 流暢體驗
LocalStorage          → 本地快取
```

---

## 需要幫助？

- 🔍 檢查 [API_KEYS.md](docs/API_KEYS.md) 了解如何取得密鑰
- 🔧 查看 [GAS_SETUP.md](docs/GAS_SETUP.md) 進行 GAS 部署
- 📚 閱讀 [SETUP.md](docs/SETUP.md) 完整指南

---

## 開發命令

```bash
# 開發
npm run dev

# 構建
npm run build

# 預覽生產版本
npm run preview

# 整體安裝
npm run setup
```

---

**現在就開始追蹤你的動漫吧！** 🎬✨

有任何問題或建議，歡迎提交 Issue！
