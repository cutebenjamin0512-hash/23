import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import Board from './components/Board'
import { searchMedia, getPosterUrl, getNextEpisodeAirDate, formatDate } from './services/tmdbApi'
import { getAllAnime, addAnime, updateAnime, deleteAnime } from './services/localStorage'
import { syncToGoogleSheets } from './services/gasService'
import './App.css'

function App() {
  const [animeList, setAnimeList] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [currentBoard, setCurrentBoard] = useState(0) // 0: planned, 1: watching, 2: completed
  const [isLoading, setIsLoading] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // 初始化數據
  useEffect(() => {
    const saved = getAllAnime()
    setAnimeList(saved)
  }, [])

  // 搜尋動漫
  const handleSearch = async (query) => {
    setIsLoading(true)
    try {
      const results = await searchMedia(query, 'tv')
      const enrichedResults = await Promise.all(
        results.slice(0, 8).map(async (item) => {
          const nextAir = await getNextEpisodeAirDate(item.id)
          return {
            tmdbId: item.id,
            title: item.name || item.title,
            poster: getPosterUrl(item.poster_path),
            totalEpisodes: item.episode_count || 0,
            nextEpisodeAirDate: nextAir
              ? formatDate(nextAir.airDate)
              : null
          }
        })
      )
      setSearchResults(enrichedResults)
      setShowSearchResults(true)
    } catch (error) {
      console.error('搜尋失敗：', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // 添加動漫
  const handleAddAnime = (searchResult) => {
    const newList = addAnime(searchResult)
    setAnimeList(newList)
    setShowSearchResults(false)
  }

  // 更新進度
  const handleUpdateProgress = (id, episode) => {
    const newList = updateAnime(id, { currentEpisode: episode })
    setAnimeList(newList)

    // 同步到 Google Sheets
    const anime = newList.find((a) => a.id === id)
    if (anime) {
      syncToGoogleSheets(anime).catch(err => console.log('GAS 同步失敗（可選）:', err))
    }
  }

  // 更改狀態
  const handleStatusChange = (id, newStatus) => {
    const updates = { status: newStatus }
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString()
    }
    const newList = updateAnime(id, updates)
    setAnimeList(newList)

    // 同步到 Google Sheets
    const anime = newList.find((a) => a.id === id)
    if (anime) {
      syncToGoogleSheets(anime).catch(err => console.log('GAS 同步失敗（可選）:', err))
    }
  }

  // 刪除動漫
  const handleDelete = (id) => {
    if (confirm('確定要刪除這部動漫嗎？')) {
      const newList = deleteAnime(id)
      setAnimeList(newList)
    }
  }

  // 按狀態分類
  const plannedList = animeList.filter((a) => a.status === 'planned')
  const watchingList = animeList.filter((a) => a.status === 'watching')
  const completedList = animeList.filter((a) => a.status === 'completed')

  const boards = [
    { title: '準備看', data: plannedList },
    { title: '觀看中', data: watchingList },
    { title: '已完結', data: completedList }
  ]

  const handlePrevBoard = () => {
    setCurrentBoard((prev) => (prev === 0 ? boards.length - 1 : prev - 1))
  }

  const handleNextBoard = () => {
    setCurrentBoard((prev) => (prev === boards.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 動漫追蹤系統</h1>
          <p>管理你的追番進度</p>
        </div>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results-modal">
            <div className="modal-overlay" onClick={() => setShowSearchResults(false)} />
            <div className="modal-content">
              <div className="modal-header">
                <h2>搜尋結果</h2>
                <button className="modal-close" onClick={() => setShowSearchResults(false)}>
                  ✕
                </button>
              </div>
              <div className="results-grid">
                {searchResults.map((result) => (
                  <div key={result.tmdbId} className="result-card">
                    {result.poster ? (
                      <img src={result.poster} alt={result.title} />
                    ) : (
                      <div className="result-placeholder">無圖</div>
                    )}
                    <div className="result-info">
                      <h3>{result.title}</h3>
                      <p>全 {result.totalEpisodes} 集</p>
                      {result.nextEpisodeAirDate && (
                        <p className="next-air">下一集：{result.nextEpisodeAirDate}</p>
                      )}
                      <button
                        className="btn-add"
                        onClick={() => handleAddAnime(result)}
                      >
                        添加
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="boards-section">
          <div className="boards-controls">
            <button onClick={handlePrevBoard} className="nav-btn nav-btn-prev">
              ← 上一個
            </button>
            <div className="board-indicator">
              {boards.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator-dot ${idx === currentBoard ? 'active' : ''}`}
                  onClick={() => setCurrentBoard(idx)}
                />
              ))}
            </div>
            <button onClick={handleNextBoard} className="nav-btn nav-btn-next">
              下一個 →
            </button>
          </div>

          <div className="boards-container">
            {boards.map((board, idx) => (
              <div
                key={idx}
                className={`board-slide ${idx === currentBoard ? 'active' : ''}`}
              >
                <Board
                  title={board.title}
                  animeList={board.data}
                  onUpdateProgress={handleUpdateProgress}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  isEmpty={board.data.length === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>動漫追蹤系統 v1.0 | 使用 TMDB API</p>
      </footer>
    </div>
  )
}

export default App
