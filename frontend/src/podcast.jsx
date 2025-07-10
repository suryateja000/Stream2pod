import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './podcast.css';
import LoadingSteps from './LoadingSteps.jsx';
import AudioPlayer from './AudioPlayer.jsx';

const ArrowRightIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
const YouTubeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.267,4,12,4,12,4S5.733,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.733,2,12,2,12s0,4.267,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.733,20,12,20,12,20s6.267,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.267,22,12,22,12S22,7.733,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>;

const initialSteps = [
  { name: 'Extracting Transcript...', status: 'pending' },
  { name: 'Crafting Podcast Script...', status: 'pending' },
  { name: 'Synthesizing Audio...', status: 'pending' },
  { name: 'Finalizing Podcast...', status: 'pending' }
];

function Podcast() {
    const [appState, setAppState] = useState('idle');
    const [promptUrl, setPromptUrl] = useState('');
    const [audioSrc, setAudioSrc] = useState(null);
    const [loadingSteps, setLoadingSteps] = useState(initialSteps);
    const [question, setQuestion] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [answerAudio, setAnswerAudio] = useState(null);
    const audioRef = useRef(null);

    const handleReset = () => {
        setAppState('idle');
        setAudioSrc(null);
        setPromptUrl('');
        setQuestion('');
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.src = '';
    };

    const updateStepStatus = (index, status) => {
        setLoadingSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[index] = { ...newSteps[index], status };
            return newSteps;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAppState('loading');
        setLoadingSteps(initialSteps);

        try {
            updateStepStatus(0, 'in-progress');
            const { data: scriptData } = await axios.post("http://127.0.0.1:8000/getscript", { user_id: "1", prompt: promptUrl });
            const scriptText = scriptData?.script || scriptData?.data?.script;
            if (!scriptText) throw new Error("Script not received");
            updateStepStatus(0, 'complete');
            
            updateStepStatus(1, 'in-progress');
            await new Promise(resolve => setTimeout(resolve, 500));
            updateStepStatus(1, 'complete');

            updateStepStatus(2, 'in-progress');
            const audioResponse = await axios.post("http://127.0.0.1:8000/url", { user_id: "1", prompt: scriptText }, { responseType: 'blob' });
            const audioBlob = new Blob([audioResponse.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            updateStepStatus(2, 'complete');
            
            updateStepStatus(3, 'in-progress');
            setAudioSrc(audioUrl);
            await new Promise(resolve => setTimeout(resolve, 500));
            updateStepStatus(3, 'complete');
            
            setTimeout(() => setAppState('loaded'), 500);
        } catch (err) {
            console.error("Error during podcast generation:", err);
            handleReset();
        }
    };
    
    const handleAsk = async () => {
        if (!question.trim() || !audioRef.current) return;
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        setAppState('asking');

        try {
            const { data } = await axios.post("http://127.0.0.1:8000/askquestion", { user_id: "1", question, script: "" });
            const answerAudioRes = await axios.post("http://127.0.0.1:8000/url", { user_id: "1", prompt: data.ans }, { responseType: 'blob' });
            
            const answerBlob = new Blob([answerAudioRes.data], { type: 'audio/mpeg' });
            const answerUrl = URL.createObjectURL(answerBlob);
            const newAnswerAudio = new Audio(answerUrl);
            setAnswerAudio(newAnswerAudio);
            
            newAnswerAudio.play();
            newAnswerAudio.onended = () => {
                setAppState('loaded');
                if (wasPlaying) {
                    audioRef.current?.play();
                }
            };
        } catch (err) {
            console.error("Error asking question:", err);
            setAppState('loaded');
        }
    };
    
    useEffect(() => {
        return () => {
            if (answerAudio) {
                answerAudio.pause();
                URL.revokeObjectURL(answerAudio.src);
            }
        };
    }, [answerAudio]);

    return (
        <div className="podcast-container">
            <header className="app-header">
                <h1 className="main-title">
                    <span className="red">Stream</span>2<span className="blue">Pod</span>
                </h1>
                {(appState === 'loaded' || appState === 'asking') && (
                    <button onClick={handleReset} className="start-new-btn">
                        Generate New Podcast
                    </button>
                )}
            </header>
            
            <main className={`content-grid ${appState}`}>
                <div className="left-column">
                    {appState === 'idle' && (
                        <div className="hero-section">
                            <h2>Streamline Video-to-Audio Conversion</h2>
                            <p>Paste a URL to get started. Our AI will transcribe, summarize, and generate a natural-sounding audio experience.</p>
                            <form className="url-form" onSubmit={handleSubmit}>
                                <YouTubeIcon />
                                <input
                                    type="text"
                                    value={promptUrl}
                                    onChange={(e) => setPromptUrl(e.target.value)}
                                    placeholder="Enter YouTube URL..."
                                    disabled={appState !== 'idle'}
                                />
                                <button type="submit" disabled={!promptUrl || appState !== 'idle'}><ArrowRightIcon /></button>
                            </form>
                        </div>
                    )}
                    
                    {(appState === 'loaded' || appState === 'asking') && audioSrc && (
                        <AudioPlayer 
                            src={audioSrc} 
                            audioRef={audioRef}
                            isPlaying={isPlaying}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            disabled={appState === 'asking'}
                        />
                    )}
                </div>

                <div className="right-column">
                    {appState === 'loading' && <LoadingSteps steps={loadingSteps} />}

                    {(appState === 'loaded' || appState === 'asking') && (
                        <div className="ask-container">
                            <h3>Ask a Question</h3>
                            <p>Get instant answers about the content. The podcast will pause while the AI responds.</p>
                            <div className="ask-group">
                                <input
                                    type="text"
                                    placeholder="e.g., 'What were the main points?'"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    disabled={appState === 'asking'}
                                />
                                <button onClick={handleAsk} disabled={!question.trim() || appState === 'asking'}>
                                    {appState === 'asking' ? 'answering...' : 'Ask'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Podcast;
