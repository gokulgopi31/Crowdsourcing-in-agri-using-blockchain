import React,{useEffect} from 'react'
import { FaHeart} from 'react-icons/fa';
import { getContract } from '../App';

function Post({setviewModelHandler,postID,title,desc,pred,sugg,reward,posted_by,img,account,handleRefresh,liked_by,setcurrentPost,handleLoad}) {
  
  return (
    <div className='post'>

      <div className='post-title'>{title}</div>
      <div className='post-desc'>{desc}</div>
      <div className='post-image'>
        <img src={img} className='post-image-img'/>
      </div>
      <div className='post-dis'>
          <div className='post-key'>
            Pred. Disease
          </div>
          <div className='post-value'>
            {pred}
          </div>
        </div>
        <div className='post-dis'>
          <div className='post-key'>
            Sugg. Disease
          </div>
          <div className='post-value'>
          {sugg}
          </div>
          
      </div>
      <div className='post-dis'>
      <div className='post-key'>
            Reward
          </div>
          <div className='post-value'>
          {reward}<i className='fab' style={{fontSize:"15px"}}>&#xf42e;</i>
          </div>
        </div>
      <div className='post-buttons'>
            <FaHeart className={!liked_by.map(likes => likes.toLowerCase()).includes(account)?"post-icons":"post-icons-active"} size={20} 
            onClick={()=>{
              handleLoad(true,1)
            getContract().methods.likeorRemoveLike(postID)
            .send({from:account})
            .on('confirmation', function(confirmationNumber, receipt){
              handleRefresh()
              handleLoad(false,1)
          }).on('error',function(error){
            handleLoad(false,2)
        })
          
          }}/>
            <div className='post-comment' onClick={()=>{
              setcurrentPost(postID)
              setviewModelHandler(true)
            }}>Comment Section</div>
      </div>
      <div className='post-footer'>
        <div className='post-posted'> posted by &#127752;</div>
        <div className='post-by'>{posted_by}</div>
      </div>
    </div>
  )
}

export default Post