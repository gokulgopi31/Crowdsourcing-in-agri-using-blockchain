import React from 'react'

function Comment({comment,bestCommentID}) {
  return (
    <div className={bestCommentID!=comment['comment_id']? 'comment':'best-comment'}>
        
        
        <div className='comment-msg'>
        {comment['comment']}
        </div>
        <div className='comment-by'>
        {comment['commented_by']}
        </div>
    </div>
  )
}

export default Comment