import './Signup.css';

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import constants from '../constant';


function Signup (){
  let navigate = useNavigate();
  const [name, changeName] = useState("");
  const [email, changeEmail] = useState("");
  const [password, changePassword] = useState("");
  const [confirmPassword, changeConfirmPassword] = useState("");
  const [validationMsg , changeValidationMsg] = useState(null);

  const handleSignup = ()=> {
    if(!name || !email || !password || !confirmPassword){
      changeValidationMsg('please fill all values');
      return;
    }

    if (password !== confirmPassword) {
      changeValidationMsg("password doesn't match with confirm password");
    }

    const urlToCall = `${constants.backendUrl}signup`;
    console.log(urlToCall);
    axios
      .post(urlToCall, { email, password })
      .then((res) => {
        console.log("hello");
        changeValidationMsg(
          "signup successful... please login with your credentials"
        );
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        changeValidationMsg(error.message);
        console.log(error);
      });

  }

  console.log("signup");

  return (
    <div className="container">
      <div className="form signup" id="signup">
        <h2>Sign up</h2>
        <div className="inputBox">
          <input
            type="text"
            required="required"
            value={name}
            onChange={(e) => changeName(e.target.value)}
          />
          <i className="fa-regular fa-user" />
          <span>Name</span>
        </div>
        <div className="inputBox">
          <input
            type="email"
            required="required"
            value={email}
            onChange={(e) => changeEmail(e.target.value)}
          />
          <i className="fa-regular fa-envelope" />
          <span>Email Id</span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            required="required"
            value={password}
            onChange={(e) => changePassword(e.target.value)}
          />
          <i className="fa-solid fa-lock" />
          <span>create password</span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            required="required"
            value={confirmPassword}
            onChange={(e) => changeConfirmPassword(e.target.value)}
          />
          <i className="fa-solid fa-lock" />
          <span>confirm password</span>
        </div>
        <div className="inputBox">
          <input type="submit" defaultValue="Create Account" onClick={handleSignup}/>
        </div>
        ({validationMsg}  && <p> {validationMsg} </p>)
      </div>
    </div>
  );
}

export default Signup;