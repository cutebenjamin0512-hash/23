import React, { useState } from 'react'
import './SearchBar.css'

/**
 * SearchBar 組件 - 搜尋和添加新動漫
 */
const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setQuery('')
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="搜尋動漫或影集... (例：進擊的巨人)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="search-btn"
        disabled={isLoading}
      >
        {isLoading ? '搜尋中...' : '搜尋'}
      </button>
    </form>
  )
}

export default SearchBar
