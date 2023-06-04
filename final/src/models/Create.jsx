import React,{useState} from 'react';
import { getContract } from '../App';
import axios from 'axios';

function Create({setcreateModelHandler,handleRefresh,account,handleLoad}) {
  const [postedData,setPostedData] = useState([{"title":"","desc":"","img":"","sugg":"","pred":"",reward:0}])
  const [load,setload] = useState(false)

  const handleChange = (e) =>{
    let x = [...postedData];
    x[0][e.target.name] = e.target.value;
    setPostedData(x);
  }

  const handleImage = (e) =>{
    setload(true)
    let reader = new FileReader();
    if(e.target.files[0]){
      reader.readAsDataURL(e.target.files[0]);
    reader.onload = () =>{
      let x = [...postedData];
      x[0]['img'] = reader.result;
      axios.post("http://localhost:5000/predict",{image:reader.result}).then((data) => {
        console.log(data.data)
        x[0]['pred'] = data.data;
      })
      setPostedData(x);
      setload(false)
    }
    }
    
  }

  const handleSubmit = async() =>{
    await handleLoad(true,1)
    await axios.post("http://localhost:5000/uploadImage",{image:postedData[0]['img']})
    .then((resp)=>
    { 
      getContract().methods.createPost(postedData[0]['title'],postedData[0]['desc'],resp.data[0].path,postedData[0]['reward'],postedData[0]['sugg'],postedData[0]['pred'])
      .send({from:account})
      .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber+receipt)
        handleRefresh()
        setcreateModelHandler(false);
        handleLoad(false,1)
    })
    .on('error',function(error){
      handleLoad(false,2)
    })
    })  
  }


  return (
    <div className='create-model'>
    <div className='create'>
        <div className='create-head'>Add a Post &#127806;</div>
        
        <div className='create-title'>
            <div className='create-key'>
                Title : 
            </div>
            <div className='create-value'>
              <input className='create-value-input' name="title" value={postedData[0]['title']} onChange={(e)=>{handleChange(e)}} type='text' placeholder='title..'/>
            </div>
        </div>
        <div className='create-desc'>
          <div className='create-key'>
                Description : 
          </div>
          <div className='create-value'>
            <textarea  rows="5" name="desc" value={postedData[0]['desc']} onChange={(e)=>{handleChange(e)}} cols="70"></textarea>
          </div>
        </div>
        <div style={{display:"flex",margin:"20px 0 0 0"}}>
          <div>
          <input className=""  onChange={(e)=>{handleImage(e)}}  type="file"/>
          <img className="create-uploaded" alt="No Images Uploaded" src={postedData[0]['img']}/>
          </div>
          <div>
          <div className='create-pred'>
            <div className='create-key'>
                  Pred.Disease:&#128201;
            </div>
            <div className='create-value'>
            <input className='create-value-input' name="pred" value={postedData[0]['pred']} onChange={(e)=>{handleChange(e)}} type='text' placeholder='predicted disease..' readOnly/>
            </div>
          </div>
          <div className='create-pred'>
            <div className='create-key'>
                  Sugg.Disease : 
            </div>
            <div className='create-value'>
            <input className='create-value-input' name="sugg" value={postedData[0]['sugg']} onChange={(e)=>{handleChange(e)}} type='text' placeholder='suggested disease..'/>
            </div>
          </div>
          <div className='create-pred'>
            <div className='create-key'>
                  Reward : 
            </div>
            <div className='create-value'>
            <input className='create-value-input' name="reward" value={postedData[0]['reward']} onChange={(e)=>{handleChange(e)}} type='number' placeholder='reward in ether..'/>
            </div>
          </div>
          </div>
        </div>

        <div className='create-button'>
          <div className='create-cancel' onClick={()=>{setcreateModelHandler(false)}}>Cancel</div>
          <div className='create-post' onClick={()=>{
            handleSubmit()
          }}>Post</div>
        </div>
    </div>
    </div>
  )
}

export default Create