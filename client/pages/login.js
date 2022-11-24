import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../helpers/auth";

const Login = () => {
    const [state, setState] = useState({
        email: "",
        password: "",
        error: "",
        success: "",
        buttonText: "Login",
    });

    useEffect(() => {
        isAuth() && Router.push("/"); // if the user is already logged in, redirect to home page directly without showing the login page
    }, []);

    const { email, password, error, success, buttonText } = state;

    const handleChange = (name) => (e) => {
        setState({
            ...state,
            [name]: e.target.value,
            error: "",
            success: "",
            buttonText: "Login",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, buttonText: "Logging in" });
        try {
            const response = await axios.post(`${API}/login`, {
                email,
                password,
            });
            // console.log(response); // here this response contains the user and the token

            authenticate(response, () => {
                isAuth() && isAuth().role === "admin"
                    ? Router.push("/admin")
                    : Router.push("/user");
            });

            // we need to pass this information to helper methods which can store the token into cookies and use them for later purposes.
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: "Login",
                error: error.response.data.error,
            });
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    value={email}
                    onChange={handleChange("email")}
                    type="email"
                    className="form-control"
                    placeholder="Type your email"
                    required
                />
            </div>
            <div className="form-group">
                <input
                    value={password}
                    onChange={handleChange("password")}
                    type="password"
                    className="form-control"
                    placeholder="Type your password"
                    required
                />
            </div>
            <div className="form-group">
                <button className="btn btn-outline-warning">
                    {buttonText}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <h1>Login</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {loginForm()}
            </div>
        </Layout>
    );
};

export default Login;
