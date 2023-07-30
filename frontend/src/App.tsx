import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Social } from './pages/Social';
import { Leaderboard } from './pages/Leaderboard';
import { UserProfile } from './pages/UserProfile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Settings from './pages/Settings';
import Chat from './components/Chat';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import { Socket } from 'socket.io-client';
import { Toaster } from 'react-hot-toast';
import DoubleFA from './pages/DoubleFA';
import Error from './pages/Error';
import PendingPage from './pages/DoubleFAPending';
import { IsLoggedInContext, SocketContext, ChatStatusContext } from './context/contexts';
import { IChannel } from './api/types';

function App() {

  // On initialise nos contexts (= nos variables globales)
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeConv, setActiveConv] = useState<IChannel | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [theme, setTheme] = useState('dark');

  // Si le user est déjà venu, on récupère le thème qu'il avait choisi
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  // Fonction pour changer de thème et le garder dans le LocalStorage
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'kawaii' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div id='app' className={`App ${theme}`}>
      <section id="main-content">
        <ChatStatusContext.Provider value={ {activeTab, setActiveTab, activeConv, setActiveConv, isExpanded, setIsExpanded}}>
      <SocketContext.Provider value={socket}>
      <IsLoggedInContext.Provider value={isLoggedIn}>
        <Navbar theme={theme} toggleTheme={toggleTheme} setLoggedIn={setLoggedIn} setSocket={setSocket} />
          {/* <video className='videobg' autoPlay loop muted content="width=device-width, initial-scale=1.0">
            <source src="./assets/bg-video.mp4" type='video/mp4' />
          </video> */}

          <audio className="music-bg" autoPlay loop >
            <source src="./assets/derezzed.mp3" type="audio/mpeg"/>
          </audio>
          <Toaster/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path='/faq' element={<FAQ />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/social" element={<Social />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/login' element={<Login setLoggedIn={setLoggedIn} setSocket={setSocket} />} />
			      <Route path='/2fa' element={<DoubleFA/>} />
			      <Route path='/2fa/pending' element={<PendingPage/>} />
            <Route path='/user' element={<UserProfile />} />
	    	    <Route path='/gamepage' element ={<GamePage/>}/>
			      <Route path='/error/:status' element={<Error/>} />
			      <Route path='*' element={<Error/>} />
            <Route path={`/user/:nickname`}  element={<UserProfile />} />
          </Routes>
          {
            isLoggedIn &&
            <Chat/>
          }
        <footer> This website was not generated by an AI :) </footer>
      </IsLoggedInContext.Provider>
      </SocketContext.Provider>
      </ChatStatusContext.Provider>
      </section>
    </div>
  );
}

export default App;
