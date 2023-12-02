import React, { useEffect, useState,useContext } from "react";
import Register from "./components/Register";
import Header from "./components/Header";
import { UserContext } from "./context/UserContext";

const  App = () => {
  const [message, setMessage] = useState("")
  const [token, setToken] = useContext(UserContext);

  const getWelcomeMessage = async () =>{
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await fetch("/api/welcome", requestOptions)
    const data = await response.json();

    if(!response.ok) {
      console.log("Something went wrong")
    }else{
      setMessage(data.message)
    }
  }
  useEffect(()=>{
    getWelcomeMessage();
  },[])
  return (
    < >
      
      <Header title={"Awesome Leads Manager"}/>
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
            {
              !token ? (
                <div className="columns">
                  <Register/> <p>Login</p>
                </div>
              ) : (
                <p>Table</p>
              )
            }
        </div>
        <div className="column"></div>
      </div>
     
    </>
  );
}

export default App;
