import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Social } from './pages/Social';
import { Leaderboard } from './pages/Leaderboard';
import { UserProfile } from './pages/UserProfile';
import Login from './pages/Login';
import './App.css';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import Chat from './components/Chat';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import GamePage from './pages/GamePage';

export const IsLoggedInContext = React.createContext<boolean>(false);

function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []); // [] specifies the dependencies array (if empty : runs only when component mounts)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'kawaii' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div id='app' className={`App ${theme}`}>
      <section id="main-content">
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <Navbar theme={theme} toggleTheme={toggleTheme} setLoggedIn={setLoggedIn}/>
          <video className='videobg' autoPlay loop muted content="width=device-width, initial-scale=1.0">
            <source src="./assets/bg-video.mp4" type='video/mp4' />
          </video>
          <audio className="music-bg" controls autoPlay loop >
            <source src="./assets/derezzed.mp3" type="audio/mpeg"/>
          </audio>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/social" element={<Social />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/login' element={<Login setLoggedIn={setLoggedIn}/>} />
            <Route path='/user' element={<UserProfile />} />
			      <Route path='/gamepage' element ={<GamePage/>}/>
          </Routes>
          {
            isLoggedIn &&
            <Chat/>
          }
        <footer> This website was not generated by an AI :) </footer>
      </IsLoggedInContext.Provider>
      </section>
    </div>
  );
}

export default App;
