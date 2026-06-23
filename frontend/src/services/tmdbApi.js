import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.themoviedb.org/3'

// TMDB API 客戶端
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'zh-TW'
  }
})

/**
 * 搜尋動漫和電視劇
 * @param {string} query - 搜尋關鍵字
 * @param {string} type - 'tv' 或 'multi'
 * @returns {Promise<Array>} 搜尋結果
 */
export const searchMedia = async (query, type = 'multi') => {
  try {
    const response = await tmdbClient.get('/search/' + type, {
      params: {
        query,
        page: 1
      }
    })
    return response.data.results || []
  } catch (error) {
    console.error('搜尋失敗：', error)
    return []
  }
}

/**
 * 獲取電視劇詳細資訊
 * @param {number} tvId - 電視劇 ID
 * @returns {Promise<Object>} 電視劇詳情
 */
export const getTvDetails = async (tvId) => {
  try {
    const response = await tmdbClient.get(`/tv/${tvId}`)
    return response.data
  } catch (error) {
    console.error('獲取電視劇詳情失敗：', error)
    return null
  }
}

/**
 * 獲取電視劇下一季上映日期
 * @param {number} tvId - 電視劇 ID
 * @returns {Promise<Object>} 季度資訊
 */
export const getNextEpisodeAirDate = async (tvId) => {
  try {
    const details = await getTvDetails(tvId)
    if (!details || !details.next_episode_to_air) {
      return null
    }
    return {
      episode: details.next_episode_to_air.episode_number,
      season: details.next_episode_to_air.season_number,
      airDate: details.next_episode_to_air.air_date,
      name: details.next_episode_to_air.name
    }
  } catch (error) {
    console.error('獲取下一集資訊失敗：', error)
    return null
  }
}

/**
 * 獲取媒體的海報 URL
 * @param {string} posterPath - 海報路徑
 * @param {string} size - 尺寸 ('w200', 'w500', 'original')
 * @returns {string} 完整的海報 URL
 */
export const getPosterUrl = (posterPath, size = 'w500') => {
  if (!posterPath) return null
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

/**
 * 格式化日期
 * @param {string} dateStr - 日期字符串 (YYYY-MM-DD)
 * @returns {string} 格式化後的日期
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export default {
  searchMedia,
  getTvDetails,
  getNextEpisodeAirDate,
  getPosterUrl,
  formatDate
}
