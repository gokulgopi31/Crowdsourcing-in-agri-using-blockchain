import React from 'react'

function NavBar({currentTab,handleTabChange,setcurrentTab}) {
  
  const handleLocalChange = (tab) =>{
    // setcurrentTab(tab)
    handleTabChange(tab)
  }

  return (

    <div>
        <div className="navbar">
          <ul >
            <li className='title'> HeapChain </li>
            <li className={currentTab=="Home"? 'navbar-cont-active':'navbar-cont'} onClick={()=>{
              handleLocalChange("Home")
            }}>Home<span>&#127968;</span></li>
            <li className={currentTab=="My Posts"? 'navbar-cont-active':'navbar-cont'} onClick={()=>{
              handleLocalChange("My Posts")
            }}>My Posts<span>&#128204;</span></li>
            <li className={currentTab=="My Comments"? 'navbar-cont-active':'navbar-cont'} onClick={()=>{
              handleLocalChange("My Comments")
            }}>My Comments<span>&#128203;</span></li>
            <li className={currentTab=="Favorite"? 'navbar-cont-active':'navbar-cont'} onClick={()=>{
              handleLocalChange("Favorite")
            }}>Favorite<span>&#128150;</span></li>
          </ul>
        </div>
    </div>
  )
}

export default NavBar