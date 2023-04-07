import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header id="navbar"> 
        <div class="nav-elements">

        <label id="burger-menu" for="check">
            <input type="checkbox" id="check"/> 
            <span></span>
            <span></span>
            <span></span>
        </label>

        </div>
        <div class="nav-elements nav-title">NOTRE PONG</div>
        <div class="nav-elements avatar"></div>
      </header>

        <section id="main-content">
      <aside>
        <div>
        
          <span>LEADERBOARD</span>
        </div>
        <div>
          <i class="fa-solid fa-user-group"></i>
          <span>FRIENDS</span>
        </div>
        <div>
          <i class="fa-regular fa-address-card"></i>
          <span>PROFILE</span>
        </div>
      </aside>


      <div id="play-screen">
        <video id="video" autoplay="true" loop="true" src="../assets/gaming.mp4"></video>
        <button>PRESS TO PLAY</button>
      </div>
      <div id="chat">
        <h5>CHAT</h5>
        <label for="story">Write your message here:</label>
        <textarea id="story" name="story" rows="5" cols="33">
        GL HF!
        </textarea>
      </div>
    </section>
    
    <footer> Crédits baby</footer>
    </div>
  );
}

export default App;
