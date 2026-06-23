# 🎬 動漫/影集追蹤系統 (AnimeTracker)

一個功能完整的動漫及影集進度追蹤應用，幫助你管理多部同時追蹤的劇集。

## 🎯 核心功能

- **卡片式追番牆**：以卡片方式展示追蹤的作品
- **看板切換**：「準備看」、「觀看中」、「已完結」三個看板，支持滑動切換
- **進度條動畫**：視覺化顯示當前觀看進度
- **自動資料抓取**：串接 TMDB API，輸入劇名自動填入封面、集數、上映日期
- **Google Sheets 同步**：透過 GAS 自動更新試算表中的觀看紀錄

## 📁 專案結構

```
├── frontend/                 # React 前端應用
│   ├── src/
│   │   ├── components/      # React 組件
│   │   │   ├── AnimeCard.jsx
│   │   │   ├── Board.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── ProgressBar.jsx
│   │   ├── services/        # API 和外部服務
│   │   │   ├── tmdbApi.js
│   │   │   ├── gasService.js
│   │   │   └── localStorage.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── gas/                      # Google Apps Script
│   ├── Code.js              # GAS 主要邏輯
│   ├── updateProgress.js    # 更新進度函數
│   └── README.md            # GAS 部署指南
│
├── docs/                     # 文檔
│   ├── SETUP.md             # 詳細設置指南
│   ├── GAS_SETUP.md         # GAS 和 Google Sheets 設定
│   ├── API_KEYS.md          # API 密鑰取得指南
│   └── DEPLOYMENT.md        # 部署指南
│
└── README.md                # 本文件
```

## 🚀 快速開始

### 1. 環境準備
```bash
# 安裝 Node.js 和 npm（如果未安裝）
# https://nodejs.org/

# 克隆/初始化專案
cd /workspaces/23
```

### 2. 前端設置
```bash
cd frontend
npm install
npm run dev
```

### 3. API 密鑰設置
- 見 [API_KEYS.md](docs/API_KEYS.md)

### 4. GAS 部署
- 見 [GAS_SETUP.md](docs/GAS_SETUP.md)

## 🔑 需要的 API 密鑰

- **TMDB API Key**：用於獲取動漫/影集資料
- **Google Apps Script 部署 URL**：用於 Google Sheets 同步

## 📚 詳細文檔

- [完整設置指南](docs/SETUP.md)
- [GAS 和 Google Sheets 配置](docs/GAS_SETUP.md)
- [API 密鑰取得](docs/API_KEYS.md)
- [部署到生產環境](docs/DEPLOYMENT.md)

## 🛠 技術棧

- **前端**：React 18 + Vite
- **樣式**：CSS3（支持動畫和響應式設計）
- **API**：TMDB API
- **後端/資料存儲**：Google Sheets + Google Apps Script
- **存儲**：LocalStorage（本地快取）

## 📱 功能演示

### 添加新劇集
1. 在搜尋欄輸入劇名
2. 系統自動從 TMDB 抓取資料
3. 點擊「添加」將其添加到「準備看」看板

### 更新進度
1. 點擊卡片上的「觀看」按鈕
2. 輸入目前觀看的集數
3. 系統自動同步到 Google Sheets

### 管理看板
1. 使用左右箭頭或滑動切換看板
2. 拖拽卡片在看板之間移動（未來版本）
3. 點擊「已完結」自動紀錄完成時間

## 🐛 故障排除

| 問題 | 解決方案 |
|------|--------|
| TMDB API 返回空結果 | 檢查 API Key 是否正確，確保輸入有效的劇名 |
| GAS 無法連接 | 確保部署 URL 正確，檢查 Google Sheets 共享設置 |
| LocalStorage 滿了 | 清除瀏覽器快取，移除舊的紀錄 |

## 📝 使用授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

---

**最後更新**：2026-06-23