import React from 'react';
import "../styles/AboutUs.css";

interface Member {
  name: string;
  position: string;
  description: string;
  image: string;
}

const teamMembers: Member[] = [
  {
    name: 'Simon',
    position: 'COO',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/assets/keanu.png',
  },
  {
    name: 'Anna',
    position: 'COO',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: '/assets/punk3.png',
  },
  {
    name: 'Marine',
    position: 'CTO',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    image: '/assets/punk1.png',
  },
  {
    name: 'Fahima',
    position: 'CTO',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: '/assets/punk2.png',
  },
];

function AboutUs() {
  return (
    <div className='container'>
      <div className='aboutus'>
        <h1>Who are we ?<br /></h1>
        <p>We are four students of 42 school. Transcendence is the last project of our training course. It's a Web project whose goal is to recreate the historical Pong Game. Our team is composed of 4 people who combined their knowledge to build this project. We hope you enjoy our game.</p>
      </div>
      <div className='div_staff container'>
      {/* <section className=''> */}
       {teamMembers.map((member, index) => (
      <div  className='container_staff' key={index}>
        <img className='image' src={member.image} alt={member.name} />
        <div className='text'>
          <h2>{member.name}</h2>
          <p>{member.position}</p>
        </div>
        
        {/* <p>{member.description}</p> */}
      </div>
    ))}
      {/* </section> */}
  </div>
  // </div>
  );
}

export default AboutUs;