import FeedbackPanel from "../components/FeedBackPanel";
import AskPanel from "../components/AskPanel";
import { useNavigate, Navigate, Link } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (!token) {
        return <Navigate to="/" />;
    }

    const isDemo = localStorage.getItem("isDemo") === "true";
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("isDemo");
        navigate("/");
    };

    return (
        <div className="dash">
            <nav className="navbar">
                <span className="brand">Scribe<span className="brand-accent">OS</span></span>
                <div className="nav-right">
                    <span className="nav-user">Hi, {name}</span>
                    <button className="btn" onClick={handleLogout}>Log out</button>
                </div>
            </nav>

            <main className="container stack">
                <header className="dash-header">
                    <h1 className="dash-greeting">Welcome back, <span className="brand-accent">{name}</span></h1>
                    <p className="dash-sub">Here's what your customers are telling you.</p>
                </header>

                {isDemo && (
                    <div className="demo-banner">
                        <span>🎭 You're exploring a read-only demo — changes won't be saved.</span>
                        <Link to="/login" className="btn btn-primary">Sign up to save →</Link>
                    </div>
                )}

                <AskPanel />
                <FeedbackPanel isDemo={isDemo} />
            </main>
        </div>
    );
}

export default Dashboard;
