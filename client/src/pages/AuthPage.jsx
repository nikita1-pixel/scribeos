import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const body = isLogin ? { email, password } : { name, email, password };

            const { data } = await api.post(endpoint, body);

            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="auth-wrap">
            <form className="auth-card card" onSubmit={handleSubmit}>
                <h1>Scribe<span className="brand-accent">OS</span></h1>
                <p>{isLogin ? "Welcome back" : "Create your account"}</p>

                {!isLogin && (
                    <input className="input" type="text" placeholder="Name"
                        value={name} onChange={(e) => setName(e.target.value)} />
                )}
                <input className="input" type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="input" type="password" placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)} />

                {error && <p className="error-text">{error}</p>}

                <button className="btn btn-primary" type="submit">
                    {isLogin ? "Log In" : "Sign Up"}
                </button>

                <button type="button" className="link-btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Need an account? Sign up" : "Have an account? Log in"}
                </button>
            </form>
        </div>
    );
}

export default AuthPage;