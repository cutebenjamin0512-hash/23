/**
 * Google Apps Script 服務 - 與 GAS 通信
 */

const GAS_DEPLOYMENT_URL = import.meta.env.VITE_GAS_DEPLOYMENT_URL

const statusMap = {
  '準備看': 'planned',
  '觀看中': 'watching',
  '已完結': 'completed'
}

const normalizeSheetRecord = (record) => {
  const tmdbId = Number(record['TMDB ID']) || null
  return {
    id: tmdbId || Date.now(),
    tmdbId,
    title: record['標題'] || '',
    poster: record['海報'] || null,
    totalEpisodes: Number(record['總集數']) || 0,
    currentEpisode: Number(record['當前集數']) || 0,
    status: statusMap[record['狀態']] || 'planned',
    rating: Number(record['評分']) || 0,
    notes: record['備註'] || '',
    addedDate: record['添加日期'] || new Date().toISOString(),
    lastUpdated: record['最後更新'] || new Date().toISOString(),
    nextEpisodeAirDate: record['下一集上映日期'] || null,
    completedDate: record['完成日期'] || null
  }
}

/**
 * 向 Google Sheets 同步進度
 * @param {Object} animeData - 動漫/劇集數據
 * @returns {Promise<Object>} 同步結果
 */
export const syncToGoogleSheets = async (animeData) => {
  if (!GAS_DEPLOYMENT_URL) {
    console.warn('未設置 GAS_DEPLOYMENT_URL，無法同步到 Google Sheets')
    return { success: false, error: 'GAS URL 未配置' }
  }

  try {
    const response = await fetch(GAS_DEPLOYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'updateProgress',
        data: animeData
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('同步到 Google Sheets 失敗：', error)
    return { success: false, error: error.message }
  }
}

/**
 * 從 Google Sheets 獲取數據
 * @returns {Promise<Array>} 從 Sheets 讀取的數據
 */
export const getFromGoogleSheets = async () => {
  if (!GAS_DEPLOYMENT_URL) {
    console.warn('未設置 GAS_DEPLOYMENT_URL，無法從 Google Sheets 讀取')
    return []
  }

  try {
    const response = await fetch(GAS_DEPLOYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'getData'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return Array.isArray(result.data)
      ? result.data.map(normalizeSheetRecord)
      : []
  } catch (error) {
    console.error('從 Google Sheets 讀取失敗：', error)
    return []
  }
}

/**
 * 刪除 Google Sheets 中的記錄
 * @param {number} id - 記錄 ID
 * @returns {Promise<Object>} 刪除結果
 */
export const deleteFromGoogleSheets = async (id) => {
  if (!GAS_DEPLOYMENT_URL) {
    console.warn('未設置 GAS_DEPLOYMENT_URL')
    return { success: false }
  }

  try {
    const response = await fetch(GAS_DEPLOYMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'deleteRecord',
        id
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('刪除 Google Sheets 記錄失敗：', error)
    return { success: false, error: error.message }
  }
}

export default {
  syncToGoogleSheets,
  getFromGoogleSheets,
  deleteFromGoogleSheets
}
