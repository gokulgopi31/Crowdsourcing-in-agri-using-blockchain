import React from 'react'

function SearchBar({searchText,setSearchText,handleSearch}) {
  return (
    <div className='searchBar'>
        <input type='text' className='searchBar-input' placeholder='Search' value={searchText} 
        onChange={(e)=>{
            handleSearch(e.target.value);
        }}/>
    </div>
  )
}

export default SearchBar