import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function FeedbackPanel({isDemo}) {
    const [feedbacks, setFeedbacks] = useState([]);
    const [text, setText] = useState("");
    const [source, setSource] = useState("other");
    const [loading, setLoading] = useState(false);

    const loadFeedbacks = async () => {
        try {
            const { data } = await api.get("/feedback");
            setFeedbacks(data);
        } catch (err) {
            console.error("Failed to load feedback:", err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await api.post("/feedback", { text, source });
            setText("");
            await loadFeedbacks();
        } catch (err) {
            console.error("Failed to add feedback:", err);
        } finally {
            setLoading(false);
        }
    };

    const badgeClass = (sentiment) => {
        if (sentiment === "positive") return "badge badge-positive";
        if (sentiment === "negative") return "badge badge-negative";
        if (sentiment === "neutral") return "badge badge-neutral";
        return "badge badge-pending";
    };

    const total = feedbacks.length;
    const positive = feedbacks.filter((f) => f.sentiment === "positive").length;
    const negative = feedbacks.filter((f) => f.sentiment === "negative").length;
    const neutral = feedbacks.filter((f) => f.sentiment === "neutral").length;

    return (
        <section>
            <div className="stats">
                <div className="stat-tile">
                    <span className="stat-num">{total}</span>
                    <span className="stat-label">Total feedback</span>
                </div>
                <div className="stat-tile stat-positive">
                    <span className="stat-num">{positive}</span>
                    <span className="stat-label">Positive</span>
                </div>
                <div className="stat-tile stat-negative">
                    <span className="stat-num">{negative}</span>
                    <span className="stat-label">Negative</span>
                </div>
                <div className="stat-tile stat-neutral">
                    <span className="stat-num">{neutral}</span>
                    <span className="stat-label">Neutral</span>
                </div>
            </div>

            <div className="section-head">
                <h2>Feedback</h2>
                <button className="btn" onClick={loadFeedbacks}>Refresh</button>
            </div>

            {isDemo ? (
                <div className="card locked-card">
                    🔒 Adding feedback is disabled in the demo.{" "}
                    <Link to="/login">Create a free account</Link> to analyze your own.
                </div>
            ) : (
                <form className="card feedback-form" onSubmit={handleSubmit}>
                    <textarea
                        className="textarea"
                        placeholder="Paste a piece of customer feedback..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                    />
                    <div className="feedback-form-row">
                        <select className="select" value={source} onChange={(e) => setSource(e.target.value)}>
                            <option value="email">Email</option>
                            <option value="review">Review</option>
                            <option value="chat">Chat</option>
                            <option value="survey">Survey</option>
                            <option value="other">Other</option>
                        </select>
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add feedback"}
                        </button>
                    </div>
                </form>
            )}


            {feedbacks.length === 0 && (
                <p className="empty-state">No feedback yet. Add the first one above.</p>
            )}

            {feedbacks.map((f) => (
                <div key={f._id} className="card card-hover feedback-item">
                    <p className="feedback-text">{f.text}</p>
                    <div className="meta-row">
                        <span className={badgeClass(f.sentiment)}>{f.sentiment || "pending"}</span>
                        <span className="status-text">{f.status}</span>
                        {f.tags && f.tags.map((tag) => (
                            <span key={tag} className="tag">#{tag}</span>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default FeedbackPanel;