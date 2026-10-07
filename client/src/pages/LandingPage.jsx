import Reveal from "../components/Reveal";
import Typewriter from "../components/Typewriter";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function LandingPage() {
    const navigate = useNavigate();

    const handleDemo = async () => {
        try {
            const { data } = await api.post("/auth/demo");
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            localStorage.setItem("isDemo", "true");
            navigate("/dashboard");
        } catch (err) {
            console.error("Demo login failed:", err);
        }
    };
    return (
        <div className="landing">
            <nav className="navbar">
                <span className="brand">Scribe<span className="brand-accent">OS</span></span>
                <div className="nav-right">
                    <div className="nav-right">
                        <Link to="/login" className="btn btn-primary">Get started</Link>
                    </div>
                </div>
            </nav>

            <header className="hero">
                <span className="pill reveal">✦ AI-powered feedback intelligence</span>

                <h1 className="hero-title reveal reveal-1">
                    <Typewriter text="Your customers are telling you everything. ScribeOS makes it make sense." />
                </h1>

                <p className="hero-sub reveal reveal-2">
                    ScribeOS reads every piece of customer feedback with AI — tagging sentiment
                    and themes automatically — then lets you ask questions in plain English and
                    get answers grounded in what your customers actually said.
                </p>

                <div className="hero-cta reveal reveal-3">
                    <button onClick={handleDemo} className="btn btn-primary btn-lg btn-glow">
                        Explore the demo →
                    </button>
                    <Link to="/login" className="btn btn-lg">
                        Create account
                    </Link>
                </div>

                <div className="hero-visual">
                    <Reveal>
                        <div className="mock-card">
                            <p className="mock-q">💬 "What are customers unhappy about?"</p>
                            <p className="mock-a">
                                Customers are frustrated with a slow, confusing checkout and
                                unhelpful support replies to refund requests.
                            </p>
                            <div className="meta-row">
                                <span className="badge badge-negative">negative</span>
                                <span className="source-meta">83.4% match · from 5 real sources</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </header>
            <section className="section">
                <Reveal>
                    <h2 className="section-title">Understand your customers, automatically</h2>
                    <p className="section-lead">From a pile of raw feedback to clear answers — without the manual work.</p>
                </Reveal>

                <div className="bento">
                    <Reveal delay={0}>
                        <div className="card card-hover bento-card">
                            <div className="bento-icon">🎯</div>
                            <h3>Automatic sentiment & themes</h3>
                            <p>Every piece of feedback is read, scored, and tagged the moment it lands — no manual labeling.</p>
                        </div>
                    </Reveal>
                    <Reveal delay={100}>
                        <div className="card card-hover bento-card">
                            <div className="bento-icon">💬</div>
                            <h3>Ask in plain English</h3>
                            <p>Ask “what are customers unhappy about?” and get an answer grounded in real feedback, with sources cited.</p>
                        </div>
                    </Reveal>
                    <Reveal delay={200}>
                        <div className="card card-hover bento-card">
                            <div className="bento-icon">⚡</div>
                            <h3>Built to scale</h3>
                            <p>An async job queue analyzes feedback in the background, so nothing blocks and nothing gets lost.</p>
                        </div>
                    </Reveal>
                    <Reveal delay={300}>
                        <div className="card card-hover bento-card">
                            <div className="bento-icon">🧠</div>
                            <h3>Semantic search</h3>
                            <p>Vector embeddings match by meaning, not keywords — “checkout is slow” finds “payment takes forever.”</p>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="section">
                <Reveal>
                    <h2 className="section-title">How it works</h2>
                </Reveal>
                <div className="steps">
                    <Reveal delay={0}>
                        <div className="step"><div className="step-num">1</div><h3>Drop in feedback</h3><p>Paste reviews, survey answers, or support chats — one at a
                            time or in bulk.</p></div>
                    </Reveal>
                    <Reveal delay={120}>
                        <div className="step"><div className="step-num">2</div><h3>AI analyzes & embeds</h3><p>Sentiment, themes, and a semantic fingerprint — generated
                            automatically in the background.</p></div>
                    </Reveal>
                    <Reveal delay={240}>
                        <div className="step"><div className="step-num">3</div><h3>Ask anything</h3><p>Query your feedback in plain English and get grounded answers
                            with real sources.</p></div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;