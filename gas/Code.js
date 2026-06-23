/**
 * Google Apps Script - 動漫追蹤系統後端
 * 
 * 此腳本處理與 Google Sheets 的所有交互
 * 包括讀取、寫入和更新觀看紀錄
 */

// 配置常量
const SHEET_ID = PropertiesService.getUserProperties().getProperty('SPREADSHEET_ID')
const SHEET_NAME = '動漫紀錄'

/**
 * doPost - 處理 POST 請求的入口點
 * 由前端應用調用
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents)
    const action = payload.action

    let response = {}

    switch (action) {
      case 'updateProgress':
        response = updateProgress(payload.data)
        break
      case 'getData':
        response = getData()
        break
      case 'deleteRecord':
        response = deleteRecord(payload.id)
        break
      default:
        response = { success: false, error: '未知的操作' }
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    Logger.log('錯誤：' + error.toString())
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * updateProgress - 更新動漫進度記錄
 * @param {Object} animeData - 動漫數據對象
 * @returns {Object} 操作結果
 */
function updateProgress(animeData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) {
      return { success: false, error: '工作表不存在' }
    }

    const headers = getOrCreateHeaders(sheet)
    const allData = sheet.getDataRange().getValues()

    // 尋找現有記錄
    let rowIndex = -1
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] == animeData.tmdbId) {
        rowIndex = i + 1 // Sheet 行數從 1 開始
        break
      }
    }

    const rowData = formatRowData(headers, animeData)

    if (rowIndex > 0) {
      // 更新現有記錄
      sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData])
    } else {
      // 添加新記錄
      sheet.appendRow(rowData)
    }

    return {
      success: true,
      message: '記錄已更新',
      tmdbId: animeData.tmdbId
    }
  } catch (error) {
    Logger.log('updateProgress 錯誤：' + error.toString())
    return { success: false, error: error.toString() }
  }
}

/**
 * getData - 獲取所有記錄
 * @returns {Object} 包含所有記錄的數據
 */
function getData() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) {
      return { success: false, error: '工作表不存在', data: [] }
    }

    const allData = sheet.getDataRange().getValues()
    const headers = allData[0]
    const records = []

    for (let i = 1; i < allData.length; i++) {
      const record = {}
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = allData[i][j]
      }
      records.push(record)
    }

    return {
      success: true,
      data: records
    }
  } catch (error) {
    Logger.log('getData 錯誤：' + error.toString())
    return { success: false, error: error.toString(), data: [] }
  }
}

/**
 * deleteRecord - 刪除一條記錄
 * @param {number} tmdbId - TMDB ID
 * @returns {Object} 操作結果
 */
function deleteRecord(tmdbId) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) {
      return { success: false, error: '工作表不存在' }
    }

    const allData = sheet.getDataRange().getValues()

    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] == tmdbId) {
        sheet.deleteRow(i + 1)
        return { success: true, message: '記錄已刪除' }
      }
    }

    return { success: false, error: '記錄未找到' }
  } catch (error) {
    Logger.log('deleteRecord 錯誤：' + error.toString())
    return { success: false, error: error.toString() }
  }
}

/**
 * getOrCreateHeaders - 獲取或創建表頭
 * @param {Sheet} sheet - Google Sheet 對象
 * @returns {Array<string>} 表頭數組
 */
function getOrCreateHeaders(sheet) {
  const headers = [
    'TMDB ID',
    '標題',
    '當前集數',
    '總集數',
    '狀態',
    '評分',
    '備註',
    '添加日期',
    '最後更新',
    '下一集上映日期',
    '完成日期'
  ]

  const firstRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]

  // 如果是新表，添加表頭
  if (!firstRow[0] || firstRow[0] === '') {
    sheet.appendRow(headers)
  }

  return headers
}

/**
 * formatRowData - 將動漫數據格式化為行數據
 * @param {Array<string>} headers - 表頭
 * @param {Object} animeData - 動漫數據
 * @returns {Array} 格式化後的行數據
 */
function formatRowData(headers, animeData) {
  const rowData = []

  for (const header of headers) {
    let value = ''

    switch (header) {
      case 'TMDB ID':
        value = animeData.tmdbId || ''
        break
      case '標題':
        value = animeData.title || ''
        break
      case '當前集數':
        value = animeData.currentEpisode || 0
        break
      case '總集數':
        value = animeData.totalEpisodes || 0
        break
      case '狀態':
        value = translateStatus(animeData.status)
        break
      case '評分':
        value = animeData.rating || 0
        break
      case '備註':
        value = animeData.notes || ''
        break
      case '添加日期':
        value = animeData.addedDate ? new Date(animeData.addedDate).toLocaleDateString('zh-TW') : new Date().toLocaleDateString('zh-TW')
        break
      case '最後更新':
        value = new Date().toLocaleString('zh-TW')
        break
      case '下一集上映日期':
        value = animeData.nextEpisodeAirDate || ''
        break
      case '完成日期':
        value = animeData.completedDate ? new Date(animeData.completedDate).toLocaleDateString('zh-TW') : ''
        break
    }

    rowData.push(value)
  }

  return rowData
}

/**
 * translateStatus - 將狀態代碼翻譯為中文
 * @param {string} status - 狀態代碼
 * @returns {string} 中文狀態
 */
function translateStatus(status) {
  const statusMap = {
    planned: '準備看',
    watching: '觀看中',
    completed: '已完結'
  }
  return statusMap[status] || status
}

/**
 * test - 測試函數（僅用於開發）
 */
function test() {
  Logger.log('GAS 腳本已部署並可工作')
}
