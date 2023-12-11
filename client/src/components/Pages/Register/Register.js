//import styles from "./stylesSingup.css";
import { useState } from "react";
//import  config  from '../../../config';
import {Link, useNavigate} from 'react-router-dom';
import { signup } from "../../../actions/auth";
import { useDispatch } from 'react-redux';
import FileBase from 'react-file-base64';
//import FormLabel from '@material-ui/core/FormLabel';
import './stylesSingup.css';

const initialState = {
        firstName: "",
        lastName: "",
        username: "",
        email:"",
        password:"",
        role:"User",
        city: "",
        phoneNumber: "",
        profileImg: ""
    };

const Register = () => {
    const [data, setData] = useState(initialState);
    const dispatch = useDispatch();

    const [error, setError] = useState("")

    const navigate = useNavigate();
   // const navigate = "";

    const handleChange = ({currentTarget: input}) => {
        setData({...data,[input.name]:input.value});
    };

    console.log(data);

    const handleSubmit = async(e) => {
        e.preventDefault();

        
        dispatch(signup(data, navigate));
           
        
    };

    return(
        <div className="signup_container" style={{backgroundColor: 'white'}}>
            <div className="signup_form_container">
                <div className="left_register">
                <h1 style={{color: "#7C567F"}}>Have an account?</h1>
                        <button type='button' className="white_btn_register" style={{color: "#7C567F"}}>
                    <Link to="/login" style={{textDecoration:"none",color: "#7C567F"}}>
                            <h1 >Log in</h1>
                    </Link>
                        </button>
                </div>
                <div className="right_register">
                    <form className="form_container_register" onSubmit={handleSubmit}>
                        <h1 className="headerMoments" style={{color: "#7C567F"}}>Moments</h1>
                        <input
                            type="text"
                            placeholder="First name"
                            name='firstName'
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className="input_register"

                        />
                         <input
                            type="text"
                            placeholder="Last name"
                            name='lastName'
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className="input_register"

                        />
                        <input
                            type="text"
                            placeholder="Username"
                            name='username'
                            onChange={handleChange}
                            value={data.username}
                            required
                            className="input_register"

                        />
                          
                           <input
                            type="email"
                            placeholder="Email"
                            name='email'
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input_register"

                        />
                           <input
                            type="password"
                            placeholder="Password"
                            name='password'
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="input_register"

                        />
                         <input
                            type="city"
                            placeholder="City"
                            name='city'
                            onChange={handleChange}
                            value={data.city}
                            required
                            className="input_register"

                        />
                         <input
                            type="phoneNumber"
                            placeholder="Phone number"
                            name='phoneNumber'
                            onChange={handleChange}
                            value={data.phoneNumber}
                            required
                            className="input_register"

                        />
                        
                        <label style={{color: 'white'}}>Choose photo</label>
                    <div className='container mr-60'>
             <FileBase type="file" multiple={false} onDone={({base64})=>setData({...data,profileImg:base64})}/>
             </div> 
                        {error && <div className="error_msg">{error}</div>}
                        <button type="submit" className="violet_btn_register" style={{color: "#7C567F"}}>
                        <h2> Sign up </h2>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
};

export default Register;



