import React, { useState } from 'react'
import { FaHeart, FaPenSquare, FaGift } from 'react-icons/fa';
import Comment from './Comment';
import { getContract } from '../App';


function View({ handleClose, post, account, handleComment, handleLoad,post_id }) {
    const [comment, setcomment] = useState("");

    return (
        <div className='view-model'>
            <div className='view'>
                <div className='view-cont'>
                    <div className='view-posted-by'>
                        <div className='view-posted'>posted by &#127752;</div>
                        <div className='view-by'>{post['posted_by']}</div>
                    </div>
                    <div className='view-title'>
                        {post['title']}
                    </div>
                    <div className='view-desc'>
                        {post['desc']}
                    </div>
                    <div className='view-image-dis'>
                        <img src={post['img']} className='view-image-img' />
                        <div className='view-props'>
                            <div className='view-pairs'>
                                <div className='view-key'>
                                    Pred. Disease
                                </div>
                                <div className='view-value'>
                                    {post['pred']}
                                </div>
                            </div>
                            <div className='view-pairs'>
                                <div className='view-key'>
                                    Sugg. Disease
                                </div>
                                <div className='view-value'>
                                    {post['sugg']}
                                </div>
                            </div>
                            <div className='view-pairs'>
                                <div className='view-key'>
                                    Reward
                                </div>
                                <div className='view-value'>
                                    {post['rew']}<i className='fab' style={{ fontSize: "15px" }}>&#xf42e;</i>
                                </div>
                            </div>

                        </div>
                    </div>
                    <FaHeart className={!post['liked_by'].map(likes => likes.toLowerCase()).includes(account) ? "view-icons" : "view-icons-active"} size={25} onClick={() => {
                        console.log("commented")
                        handleLoad(true, 1)
                        getContract().methods.likeorRemoveLike(post['postID'])
                            .send({ from: account })
                            .on('confirmation', function (confirmationNumber, receipt) {
                                handleClose(false)
                                handleComment()
                                handleLoad(false, 1)
                            }).on('error', function (error) {
                                handleLoad(false, 2)
                            })

                    }} />
                </div>
                <div className='view-comment'>
                    <div className='view-close' onClick={() => {
                        handleClose()
                    }}>x</div>
                    <div className='view-comment-text'>
                        {post['comments'].map((nev, index, comment) => {

                            console.log(post['comments'][index]['comment_id']);
                            console.log(post['best_comment_ID']);
                            console.log(post['comments'][index]['comment_id'] == post['best_comment_ID']);

                            return (
                                <div style={{ display: 'flex' }}>
                                    <Comment comment={post['comments'][index]} bestCommentID={post['best_comment_ID']}/>
                                    <div style={{paddingTop:'20px'}}>
                                        {(account.toLowerCase() == post['posted_by'].toLowerCase() && post['status']!="Closed") && <FaGift className='gift' onClick={()=>{
                                            console.log(post['comments'][index]['comment_id']);
                                            console.log(post_id);
                                            console.log(post['rew'])
                                            handleLoad(true, 1)
                            getContract().methods.sendBal(post['comments'][index]['comment_id'], post_id)
                                .send({ from: account,value: post['rew']*1000000000000000000})
                                .on('confirmation', function (confirmationNumber, receipt) {

                                    handleComment()
                                    handleClose()
                                    handleLoad(false, 1)
                                }).on('error', function (error) {
                                    handleLoad(false, 2)
                                })
                                        }}/>}
                                    </div>
                                </div>
                            )
                        })}


                    </div>
                    <div className='view-comment-input'>
                        <textarea className='view-comment-area' rows="3" name="desc" cols="30" value={comment} onChange={(e) => {
                            setcomment(e.target.value);
                        }}></textarea>
                        <FaPenSquare className="view-icon-write" size={25} onClick={() => {
                            handleLoad(true, 1)
                            getContract().methods.addComment(comment, post['postID'])
                                .send({ from: account })
                                .on('confirmation', function (confirmationNumber, receipt) {

                                    handleComment()
                                    handleClose()
                                    handleLoad(false, 1)
                                }).on('error', function (error) {
                                    handleLoad(false, 2)
                                })
                        }} />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default View