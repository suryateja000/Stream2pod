# 🎧 Stream2Podcast

**Stream2Podcast** turns YouTube videos into podcast episodes with an AI Assistant that answers your questions mid-playback and resumes the audio seamlessly. It also updates outdated information from the original video using the latest data, so you always hear the most accurate and up-to-date content.

**Demo video** :https://drive.google.com/file/d/1KTOGBhXtBl7g3h2ui8NXUdLS3pFvTOTz/view?usp=sharing
---

## 🚀 Features

- 🔗 Convert any YouTube video into a podcast-style audio stream
- 🎧 Clean, minimal audio player with stream controls
- 🤖 **AI Ask Feature**
  - Ask a question at any time while listening
  - AI (powered by Google Gemini via LangChain) generates a relevant answer
  - Answer is converted to speech using `edge-tts` and streamed back to the player
  - Original podcast resumes automatically after response playback
- 📝 Automatic transcription using `youtube-transcript-api`
- 🔊 Voice synthesis with Microsoft Edge TTS for a natural response
- 💡 Fast and responsive frontend using React + Vite
-  youtube video -> transceipt  -> up to date podcast

---
## Usage
1. Clone the repository
3. Run `run.bat`

## 🧠 How It Works

1. User pastes a YouTube URL
2. Backend fetches the transcript
3. Audio is streamed using `StreamingResponse`
4. When user asks a question:
   - The transcript is fed to an AI agent (LangChain + Gemini)
   - Response is generated and synthesized to speech
   - AI audio plays between the paused podcast
   - Podcast resumes after the answer

---


## 🛠️ Tech Stack

| Area           | Technology |
|----------------|------------|
| Frontend       | React.js, Vite, Axios, HTML5 Audio |
| Backend        | FastAPI, Uvicorn |
| AI         | Google Gemini (`google.generativeai`), LangChain |
| Speech Synthesis | `edge-tts` (Microsoft Edge TTS) |
| Transcription  | `youtube-transcript-api` |
| Audio Streaming| FastAPI `StreamingResponse`, `io.BytesIO` |
| Styling        | Custom CSS |

