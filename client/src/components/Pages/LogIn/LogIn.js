import React from "react";
import styles from "./stylesLogin.css";
import { useState } from "react";
import  config  from '../../../config';
import { useDispatch } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { signin } from "../../../actions/auth";
import './stylesLogin.css'

const initialState = {
    username:"",
    password:""
};


const LogIn = () => {
    const [data, setData] = useState(initialState);
    const [error, setError] = useState("")

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = ({currentTarget: input}) => {
        setData({...data,[input.name]:input.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        dispatch(signin(data, navigate));
    }

    return( 
        <div className="login_container" style={{backgroundColor: 'white'}}>
            <div className="login_form_container">
             <div className="left">
                <div style={{height: "5%"}}>
                    <h1 className="headerText" style={{color: "#7C567F"}}>Moments</h1>
                </div>
                <form className="form_container" onSubmit={handleSubmit}>
                        <div className="UsernamePasswordInputs">
                            <input
                                type="username"
                                placeholder="Username"
                                name='username'
                                onChange={handleChange}
                                value={data.email}
                                required
                                className="inputLogin"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name='password'
                                onChange={handleChange}
                                value={data.password}
                                required
                                className="inputLogin"
                            />
                        </div>
                        <button type="submit" className="green_btn" style={{color: "#7C567F"}}>
                            Log in
                        </button>
                    </form>
                </div>
                <div className="right">
                <h1 style={{color: "#7C567F"}}>Don't have an account?</h1>
                    <Link to="/register">
                        <button type='button' className="white_btn" style={{color: "#7C567F"}}>
                            Sign up
                        </button>
                    </Link>       
                </div>
            </div>
        </div>
    );
};

export default LogIn;

