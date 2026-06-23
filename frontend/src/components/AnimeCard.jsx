import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import './AnimeCard.css'

/**
 * AnimeCard 組件 - 顯示單個動漫/劇集卡片
 */
const AnimeCard = ({
  id,
  title,
  poster,
  currentEpisode,
  totalEpisodes,
  status,
  rating,
  nextEpisodeAirDate,
  onUpdateProgress,
  onStatusChange,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(currentEpisode)

  const handleUpdateProgress = () => {
    if (editValue >= 0 && editValue <= totalEpisodes) {
      onUpdateProgress(id, editValue)
      setIsEditing(false)
    }
  }

  const getStatusBadge = () => {
    const statusMap = {
      planned: { label: '準備看', color: 'status-planned' },
      watching: { label: '觀看中', color: 'status-watching' },
      completed: { label: '已完結', color: 'status-completed' }
    }
    return statusMap[status] || { label: status, color: 'status-default' }
  }

  const badge = getStatusBadge()

  return (
    <div className="anime-card">
      <div className="card-poster">
        {poster ? (
          <img src={poster} alt={title} className="poster-image" />
        ) : (
          <div className="poster-placeholder">無圖</div>
        )}
        <span className={`status-badge ${badge.color}`}>{badge.label}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title" title={title}>
          {title}
        </h3>

        <div className="card-progress">
          <ProgressBar current={currentEpisode} total={totalEpisodes} />
        </div>

        {nextEpisodeAirDate && status !== 'completed' && (
          <p className="next-episode">下一集：{nextEpisodeAirDate}</p>
        )}

        {rating > 0 && (
          <p className="card-rating">⭐ {rating.toFixed(1)}</p>
        )}

        <div className="card-actions">
          {isEditing ? (
            <div className="edit-progress">
              <input
                type="number"
                min="0"
                max={totalEpisodes}
                value={editValue}
                onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                className="edit-input"
              />
              <button
                onClick={handleUpdateProgress}
                className="btn btn-confirm"
              >
                確定
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-cancel"
              >
                取消
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                更新進度
              </button>
              <select
                value={status}
                onChange={(e) => onStatusChange(id, e.target.value)}
                className="btn btn-select"
              >
                <option value="planned">準備看</option>
                <option value="watching">觀看中</option>
                <option value="completed">已完結</option>
              </select>
              <button
                onClick={() => onDelete(id)}
                className="btn btn-danger"
                title="刪除"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimeCard
