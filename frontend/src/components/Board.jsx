import React from 'react'
import AnimeCard from './AnimeCard'
import './Board.css'

/**
 * Board 組件 - 看板容器，顯示特定狀態的動漫
 */
const Board = ({
  title,
  animeList,
  onUpdateProgress,
  onStatusChange,
  onDelete,
  isEmpty
}) => {
  return (
    <div className="board">
      <div className="board-header">
        <h2 className="board-title">{title}</h2>
        <span className="board-count">{animeList.length}</span>
      </div>

      {isEmpty ? (
        <div className="board-empty">
          <p>暫無內容</p>
          <p className="empty-hint">在上面的搜尋欄中添加新劇集</p>
        </div>
      ) : (
        <div className="cards-grid">
          {animeList.map((anime) => (
            <AnimeCard
              key={anime.id}
              {...anime}
              onUpdateProgress={onUpdateProgress}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Board
