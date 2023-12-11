import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../actions/posts";

const Form = () => {
    const [postData, setPostData] = useState({});
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(createPost(postData));
    }
    return (
        <h1>Form</h1>
    );
}

export default Form;