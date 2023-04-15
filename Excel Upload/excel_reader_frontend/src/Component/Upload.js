import './Upload.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import constants from '../constant';
function Upload (){
  let navigate = useNavigate();
  const [excel, changeExcel] = useState(null);

  localStorage.removeItem('token');

  const userSession = localStorage.getItem('token');

  // if(!userSession){
  //   navigate('/login');
  // }
  const handleFileUpload = (event)=>{
    console.log('hello');
    const file = event.target.files[0];
    // console.log('hello');
    // const reader = new FileReader();
    // reader.onload = (event) => {
    //   const data = event.target.result;
    //   changeExcel(data)
    //   // Do something with the file data here
    // };
    // reader.readAsArrayBuffer(file);
    changeExcel(file);
  }

  const handleSubmit = ()=> {
    console.log('handleSubmit');
    console.log(typeof excel);
    console.log(excel);

    const formData = new FormData();
    formData.append('file', excel, '');

    const urlToCall = `${constants.backendUrl}upload`;
    console.log(urlToCall);

    axios.post(urlToCall, formData)
      .then(response => {
        console.log(response);
        // Do something with the response data here
      })
      .catch(error => {
        console.error(error);
        // Handle the error here
      });

  }

  return (
    <div >
    <label htmlFor="file-upload" className="upload-btn">Choose file</label>
    <input type="file" name='excelFile' accept=".xlsx, .xls" id="file-upload" onChange={handleFileUpload} />
    <button type="submit" onClick={handleSubmit}>Upload</button>
  </div>
  )
}

export default Upload;