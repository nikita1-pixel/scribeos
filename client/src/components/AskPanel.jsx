import { useState } from "react";
import api from "../api";

function AskPanel() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;
        setLoading(true);
        setAnswer("");
        setSources([]);
        try {
            const { data } = await api.post("/feedback/ask", { question });
            setAnswer(data.answer);
            setSources(data.sources);
        } catch (err) {
            setAnswer("Something went wrong — try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="ask-panel">
            <h2 className="ask-title">💬 Ask Your Data</h2>
            <p className="ask-sub">
                Ask a question in plain English — answered from your real feedback.
            </p>

            <form className="ask-form" onSubmit={handleAsk}>
                <input
                    className="input"
                    type="text"
                    placeholder="e.g. What are customers unhappy about?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? "Thinking..." : "Ask"}
                </button>
            </form>

            {answer && (
                <div className="ask-answer">
                    <p className="ask-answer-text">{answer}</p>

                    {sources.length > 0 && (
                        <div>
                            <p className="sources-head">Sources</p>
                            {sources.map((s, i) => (
                                <div key={i} className="source-card">
                                    <span className="source-meta">
                                        {s.sentiment} · {(s.score * 100).toFixed(1)}% match
                                    </span>
                                    <p className="source-text">{s.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default AskPanel;