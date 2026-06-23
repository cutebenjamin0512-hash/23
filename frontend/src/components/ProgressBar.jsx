import React from 'react'
import './ProgressBar.css'

/**
 * ProgressBar 組件 - 顯示動畫進度條
 * @param {number} current - 當前進度
 * @param {number} total - 總進度
 */
const ProgressBar = ({ current = 0, total = 1 }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="progress-text">
        {current}/{total}
      </span>
    </div>
  )
}

export default ProgressBar
