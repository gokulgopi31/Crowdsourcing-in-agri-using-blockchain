pragma solidity ^0.8.17;

contract Posts{
    int current_post_ID;
    mapping (address => uint) balances;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    struct Post{
        int post_id;
        int current_comment_ID;
        address posted_by;
        string title;
        string description;
        string image;
        string suggested_disease;
        string predicted_disease;
        Comment[] comments ;
        int reward;
        string status;
        int best_comment_ID;
        address[] liked_by;
    }
    struct Comment{
        int comment_id;
        string comment;
        address commented_by;
        
    }
    Post[] public posts;

    constructor(){
        current_post_ID = 0;
    }


    function createPost(string memory title,string memory description,string memory image,int reward,string memory suggested_disease,string memory predicted_disease) external{
        Post storage p = posts.push();
        p.post_id = current_post_ID;
        p.current_comment_ID = 0;
        p.posted_by = msg.sender;

        p.title = title;
        p.description = description;
        p.image = image;
        p.suggested_disease = suggested_disease;
        p.predicted_disease = predicted_disease;
        p.reward = reward;
        p.status = "Open";
        p.best_comment_ID = -1;
        current_post_ID+=1;
    }

    function addComment(string memory comment,int post_id) external{
        for(uint i=0; i<posts.length; i++){
        if(posts[i].post_id == post_id){
            Comment storage c = posts[i].comments.push();
            c.comment = comment;
            c.commented_by = msg.sender;
            c.comment_id = posts[i].current_comment_ID;
            posts[i].current_comment_ID+=1;
        }
     }
    }

    function likeorRemoveLike(int post_id) external {
        for(uint i=0;i<posts.length;i++){
            if(posts[i].post_id == post_id){
                bool isPres = false;
                for(uint k=0;k<posts[i].liked_by.length;k++){
                    if(msg.sender == posts[i].liked_by[k]){
                        isPres = true;
                        posts[i].liked_by[k] = posts[i].liked_by[posts[i].liked_by.length-1];
                        posts[i].liked_by.pop();
                        break;
                    }
                }
                if(!isPres){
                    posts[i].liked_by.push(msg.sender);
                }
                break;
            }
        }
    }
        

    

    function removePost(int post_id) external {
        for(uint i=0;i<posts.length;i++){
            if(posts[i].post_id == post_id && posts[i].posted_by == msg.sender){
                posts[i] = posts[posts.length - 1];
                posts.pop();
                break;
            }
        }
    }

    function returnData() public view returns (Post[] memory) {
        return posts; 
    }
    
    function sendBal(int commentid,int post_id) payable external{
        address payable receiver;
        for(uint i=0;i<posts.length;i++){
            if(posts[i].post_id == post_id){
                posts[i].best_comment_ID = commentid;
                posts[i].status = "Closed";
            }
        }
        for(uint i=0;i<posts.length;i++){
            if(posts[i].post_id == post_id){
                for(uint j=0;j<posts[i].comments.length;j++){
                    if(posts[i].comments[j].comment_id == commentid){
                        receiver = payable(posts[i].comments[j].commented_by);
                    }
                }
            }
        }
        receiver.transfer(msg.value); 
}
}