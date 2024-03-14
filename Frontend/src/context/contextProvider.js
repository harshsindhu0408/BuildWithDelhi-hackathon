import { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import LoginContext from "./context";

const ContextProvider = ({children})=>{
    const [loggedIn,setLoggedIn] = useState(false);

    useEffect(()=>{
        const isuser = Cookie.get('uid') || Cookie.get('userid');
        if(isuser){
            setLoggedIn(true);
        }
    },[])
    function login(){
        setLoggedIn(true);
    }
    function logout(){
        setLoggedIn(false);
    }

    return (
        <LoginContext.Provider value={{login,logout,loggedIn}} >
            {children}
        </LoginContext.Provider>
    )
}

export default ContextProvider