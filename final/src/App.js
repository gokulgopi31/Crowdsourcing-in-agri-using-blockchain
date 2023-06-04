import NavBar from './models/NavBar';
import Post from './models/Post';
import SearchBar from './models/SearchBar';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import ContractBuild from "./Contracts/Posts.json";
import Create from './models/Create';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import View from './models/View';
import Loader from './models/Loader'
import { Snackbar,Alert,Badge } from '@mui/material';

let selectedAccount;
let contract;
let w3;


function App() {

  const [searchText, setSearchText] = useState("");
  const [account, setAccount] = useState("");
  const [posts, setPosts] = useState([]);
  const [createModelHandler, setcreateModelHandler] = useState(false);
  const [currentTab, setCurrentTab] = useState("Home");
  const [viewModelHandler, setviewModelHandler] = useState(false)
  const [currentPost, setCurrentPost] = useState(-1);
  const [load, setLoad] = useState(false)
  const [warn,setwarn] = useState(false)
  const [succ,setsucc] = useState(false)

  const getData = async () => {
    getPosts().then((resp) => {
      let varPosts = [];
      for (let i = 0; i < resp.length; i++) {
        if (currentTab == "Home") {
          varPosts.push({ postID: resp[i].post_id, title: resp[i].title, desc: resp[i].description, img: resp[i].image, pred: resp[i].predicted_disease, sugg: resp[i].suggested_disease, rew: resp[i].reward, status: resp[i].status, comments: resp[i].comments, liked_by: resp[i].liked_by, posted_by: resp[i].posted_by,best_comment_ID: resp[i].best_comment_ID });
        }
        else if (currentTab == "My Posts" && resp[i].posted_by.toLowerCase() == account.toLowerCase()) {
          varPosts.push({ postID: resp[i].post_id, title: resp[i].title, desc: resp[i].description, img: resp[i].image, pred: resp[i].predicted_disease, sugg: resp[i].suggested_disease, rew: resp[i].reward, status: resp[i].status, comments: resp[i].comments, liked_by: resp[i].liked_by, posted_by: resp[i].posted_by,best_comment_ID: resp[i].best_comment_ID });
        }
        else if (currentTab == "Favorite" && resp[i].liked_by.map(likes => likes.toLowerCase()).includes(account.toLowerCase())) {
          varPosts.push({ postID: resp[i].post_id, title: resp[i].title, desc: resp[i].description, img: resp[i].image, pred: resp[i].predicted_disease, sugg: resp[i].suggested_disease, rew: resp[i].reward, status: resp[i].status, comments: resp[i].comments, liked_by: resp[i].liked_by, posted_by: resp[i].posted_by,best_comment_ID: resp[i].best_comment_ID });
        }
        else if (currentTab == "My Comments" && resp[i].comments.map(comments => comments['commented_by'].toLowerCase()).includes(account.toLowerCase())) {
          varPosts.push({ postID: resp[i].post_id, title: resp[i].title, desc: resp[i].description, img: resp[i].image, pred: resp[i].predicted_disease, sugg: resp[i].suggested_disease, rew: resp[i].reward, status: resp[i].status, comments: resp[i].comments, liked_by: resp[i].liked_by, posted_by: resp[i].posted_by,best_comment_ID: resp[i].best_comment_ID });
        }
      }
      setPosts(varPosts)
    })
      .catch((err) => {
        console.log(err)
      }).finally(() => {
        
      })
  }

  useEffect(() => {
    init(setAccount).then(() => {
      getData();
    })
  }, [currentTab, searchText])


  return (
      <div style={load ? { pointerEvents: 'none' }:{pointerEvents:'auto'}}>
      <div className="App" style={(createModelHandler || viewModelHandler || load) ? { pointerEvents: 'none', filter: 'blur(2px)', position: 'fixed' } : { filter: 'blur(0px)' }}>

        <NavBar currentTab={currentTab} handleTabChange={(tab) => {


          setCurrentTab(tab)

          getData()
        }} />
        <div>
          {/* <SearchBar searchText={searchText}  handleSearch={(searchText) => {
              setSearchText(searchText)
          }} /> */}
          <div className='content'>

            {!posts.length == 0 ? posts.map(({ postID, title, desc, pred, sugg, rew, posted_by, img, liked_by,status }) => {

              return (
                <Badge badgeContent={""} overlap="circular"  color={status!="Closed"?"primary":"success"} >
                <Post postID={postID} title={title} setcurrentPost={setCurrentPost} desc={desc} pred={pred} sugg={sugg} reward={rew} posted_by={posted_by} img={img} account={account} liked_by={liked_by} setviewModelHandler={setviewModelHandler} handleRefresh={() => {
                  getData()
                }}
                handleLoad={(flag,msg) => {
                  setLoad(flag)
                  if(!flag){
                    if(msg == 1){
                      setsucc(true)
                    }else if(msg == 2){
                      setwarn(true)
                    }
                  }
                  
                }} />
                </Badge>
              )
            }) : <div className='no-post'>{currentTab == "Home" ? "No Posts Available":currentTab == "My Posts" ? "You haven't created a post":currentTab == "My Comments" ? "You didn't comment anywhere":"You have no favorites"}</div>}

          </div>

        </div>

      </div>
      {load && <Loader/>}

      {!load && <div >
      <div className='create-icon' style={(createModelHandler || viewModelHandler || load) ? { pointerEvents: 'none', filter: 'blur(2px)', fontSize: "80px" } : { filter: 'blur(0px)', fontSize: "80px" }} onClick={() => {
        window.scrollTo(0, 0, "smooth")
        setcreateModelHandler(true)
      }}>
        <AddCircleIcon fontSize='inherit' />
      </div>
      {createModelHandler && <Create setcreateModelHandler={setcreateModelHandler} account={account} handleRefresh={() => {

        getData()

      }}
      handleLoad={(flag,msg) => {
        setLoad(flag)
        if(!flag){
          if(msg == 1){
            setsucc(true)
          }else if(msg == 2){
            setwarn(true)
          }
        }
        
      }}
      />}
      
      {viewModelHandler && <View  post={posts[currentPost]} account={account} post_id={currentPost} handleClose={() => {
        window.scrollTo(0, 0, "smooth")
        setviewModelHandler(false)
      }}
        handleComment={() => {
          getData()
        }}
        handleLoad={(flag,msg) => {
          setLoad(flag)
          console.log(flag+"/"+msg);
          if(!flag){
            if(msg == 1){
              setsucc(true)
            }else if(msg == 2){
              setwarn(true)
            }
          }
          
        }}
      />}
      </div>}
      
    
    
    
      <Snackbar open={succ} autoHideDuration={5000}  onClose={()=>{
        setsucc(false)
      }}>
        <Alert severity="success" sx={{ width: '100%' }} onClose={()=>{
        setsucc(false)
      }}>
          Metamask Transaction Confirmed
        </Alert>
      </Snackbar>
      <Snackbar open={warn} autoHideDuration={5000} onClose={()=>{
        setwarn(false)
      }}>
        <Alert severity="warning" sx={{ width: '100%' }} onClose={()=>{
        setwarn(false)
      }}>
          Metamask Transaction Rejected
        </Alert>
      </Snackbar>
    </div>
  );
}





export const init = async (setAccount) => {
  let provider = window.ethereum;

  if (typeof provider !== 'undefined') {
    provider.request({ method: 'eth_requestAccounts' }).then(accounts => {

      selectedAccount = accounts[0];
      console.log(selectedAccount)
      setAccount(selectedAccount);
      console.log("Logged in")
    })
    window.ethereum.on('accountsChanged', function (accounts) {
      if (!accounts.length) {
      } else {
        selectedAccount = accounts[0];
        setAccount(selectedAccount);
      }
    })
    window.ethereum.on('chainChanged', function (chain) {
    })
  } else {
  }
  w3 = new Web3(provider);
  const networkid = await w3.eth.net.getId();
  console.log(ContractBuild.abi)
  console.log(ContractBuild.networks[networkid].address)
  contract = new w3.eth.Contract(
    ContractBuild.abi,
    ContractBuild.networks[networkid].address
  );
  console.log(contract)
}

export const getPosts = async () => {
  return await contract.methods.returnData().call()
}

export const getContract = () => {
  return contract;
}

export default App;
