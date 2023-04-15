import './Login.css';
import axios from 'axios';
import React, { useState } from 'react';
import constants from '../constant';
import { useNavigate } from "react-router-dom";

function Login (){
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userSession = localStorage.getItem('token');

  if(!userSession){
    navigate('/upload');
  }
const handleRegeister =()=>  {
  navigate("/signup")
}
  const handleLogin = ()=> {
    console.log(email, password);
    const urlToCall = `${constants.backendUrl}login`;
    console.log(urlToCall);

    axios
      .post(urlToCall, { email, password })
      .then((res) => {
        console.log("hello");
        console.log(JSON.stringify(res.data.token));
        localStorage.setItem('token', res.data.token);

        navigate('/upload');
      })
      .catch((error) => console.log(error));

  }

  return (
    <div className="container">
      <div className="  form signin" id="signin">
        <h2>Login </h2>

        <div className="inputBox">
          <input type="text" required="required" value={email} onChange={(e)=> setEmail(e.target.value) }/>
          <i className="fa-regular fa-user" />
          <span>Email</span>
        </div>

        <div className="inputBox">
          <input type="password" required="required" value={password} onChange={(e)=> setPassword(e.target.value)} />
          <i className="fa-solid fa-lock" />
          <span> password</span>
          <div className="inputBox">
            <input type="submit" defaultValue="Login" onClick={handleLogin}/>
          </div>
          <p>Not Registered ?<a href="#" className="create" onClick={handleRegeister}>create an account</a></p>
        </div>
      </div>
    </div>
  );
}


export default Login;