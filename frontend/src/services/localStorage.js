/**
 * 本地存儲服務 - 管理 LocalStorage 中的數據
 */

const STORAGE_KEY = 'animeTracker_data'

/**
 * 獲取所有動漫/劇集數據
 * @returns {Array} 存儲的數據列表
 */
export const getAllAnime = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('讀取本地存儲失敗：', error)
    return []
  }
}

/**
 * 保存動漫/劇集數據
 * @param {Array} animeList - 要保存的數據列表
 */
export const saveAnime = (animeList) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(animeList))
    return true
  } catch (error) {
    console.error('保存本地存儲失敗：', error)
    return false
  }
}

/**
 * 添加新的動漫/劇集
 * @param {Object} anime - 動漫/劇集數據對象
 * @returns {Array} 更新後的列表
 */
export const addAnime = (anime) => {
  const list = getAllAnime()
  const newAnime = {
    id: Date.now(), // 使用時間戳作為本地 ID
    tmdbId: anime.tmdbId,
    title: anime.title,
    poster: anime.poster,
    totalEpisodes: anime.totalEpisodes,
    currentEpisode: 0,
    status: 'planned', // 'planned', 'watching', 'completed'
    rating: 0,
    notes: '',
    addedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    nextEpisodeAirDate: anime.nextEpisodeAirDate || null,
    ...anime
  }
  list.push(newAnime)
  saveAnime(list)
  return list
}

/**
 * 更新動漫/劇集進度
 * @param {number} id - 本地 ID
 * @param {Partial<Object>} updates - 要更新的字段
 * @returns {Array} 更新後的列表
 */
export const updateAnime = (id, updates) => {
  let list = getAllAnime()
  list = list.map(item => {
    if (item.id === id) {
      return {
        ...item,
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    }
    return item
  })
  saveAnime(list)
  return list
}

/**
 * 刪除動漫/劇集
 * @param {number} id - 本地 ID
 * @returns {Array} 更新後的列表
 */
export const deleteAnime = (id) => {
  let list = getAllAnime()
  list = list.filter(item => item.id !== id)
  saveAnime(list)
  return list
}

/**
 * 按狀態獲取動漫/劇集列表
 * @param {string} status - 'planned', 'watching', 'completed'
 * @returns {Array} 過濾後的列表
 */
export const getAnimeByStatus = (status) => {
  const list = getAllAnime()
  return list.filter(item => item.status === status)
}

/**
 * 清空所有數據
 * @warning 此操作不可撤銷
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清空數據失敗：', error)
    return false
  }
}

/**
 * 導出數據為 JSON
 * @returns {string} JSON 字符串
 */
export const exportData = () => {
  const data = getAllAnime()
  return JSON.stringify(data, null, 2)
}

/**
 * 導入數據
 * @param {string} jsonString - JSON 字符串
 * @returns {boolean} 是否成功
 */
export const importData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString)
    if (Array.isArray(data)) {
      saveAnime(data)
      return true
    }
    return false
  } catch (error) {
    console.error('導入數據失敗：', error)
    return false
  }
}

export default {
  getAllAnime,
  saveAnime,
  addAnime,
  updateAnime,
  deleteAnime,
  getAnimeByStatus,
  clearAllData,
  exportData,
  importData
}
