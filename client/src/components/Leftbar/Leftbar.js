import React,{ useState ,  useEffect } from "react";
import "./leftbar.scss";
import iconforaddstory from "../../assets/iconforaddstory.png";
import momentsicon1 from "../../assets/momentsicon.jpg";
import addposticon from "../../assets/addposticon.png";
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const Leftbar = ({connection, mobileSize}) => {
    const current = JSON.parse(localStorage.getItem("profile"))
    const navigate = useNavigate();

    const {authData} = useSelector(state=>state.auth);

    const currentUser = authData?.find(u => u.id === current?.user.id);
    console.log(currentUser)

    useEffect(()=>{
       
    },[authData]);

    console.log(mobileSize)

    const handleClick = (user) => {
        console.log(user)
        navigate("/profile", {state: {u : user}});
    }

    return(
        <div className={ mobileSize ? "mobileLeftBar" : "leftBar"}>
            <div className={ mobileSize ? "mobileContainer" : "container"}>
                <div className={ mobileSize ? "mobileMenu" : "menu"}>
                    <div className={ mobileSize ? "mobileUser" : "user"} onClick={()=>handleClick(currentUser)}>
                    <img src={currentUser?.profileImg} alt=""/>
                    <span>{currentUser?.firstName} {currentUser?.lastName}</span>
                    </div>
                    <Link to="/addStory"  style={{textDecoration:"none", color:"inherit"}}>
                        <div className={ mobileSize ? "mobileItem" : "item"}>
                            <img className="imgLeftBar" src={iconforaddstory} alt=""/>
                            <span>Add story</span>
                        </div>
                    </Link>
                    <Link to="/addPost"  style={{textDecoration:"none", color:"inherit"}}>
                        <div className={ mobileSize ? "mobileItem" : "item"}>
                            <img className="imgLeftBar" src={addposticon} alt=""/>
                            <span>Add post</span>
                        </div>
                    </Link>
                    <Link to="/moments"  style={{textDecoration:"none", color:"inherit"}}>
                        <div className={ mobileSize ? "mobileItem" : "item"}>
                            <img className="imgLeftBar" src={momentsicon1} alt=""/>
                            <span>Moments</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Leftbar;