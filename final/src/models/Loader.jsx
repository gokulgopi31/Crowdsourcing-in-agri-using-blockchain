import React from 'react'
import { CircularProgress } from '@mui/material';

function Loader() {



  return (
    <div className='load-model'>
      <div style={{color:'gold'}}>
        <CircularProgress color='inherit'/>
        
      </div>
      MetaMask Transaction InProgress&#129418;
    </div>
  )
}

export default Loader