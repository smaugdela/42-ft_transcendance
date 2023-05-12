import React from 'react';
import "../styles/AboutUs.css";

interface Member {
  name: string;
  github: string;
  image: string;
}

const teamMembers: Member[] = [
  {
    name: 'Simon',
    github: 'https://github.com/smaugdela',
    image: '/assets/keanu.png',
  },
  {
    name: 'Anna',
    github: 'https://github.com/ajealcat',
    image: '/assets/punk3.png',
  },
  {
    name: 'Marine',
    github: 'https://github.com/marineks',
    image: '/assets/punk1.png',
  },
  {
    name: 'Fahima',
    github: 'https://github.com/fahima8897',
    image: '/assets/punk2.png',
  },
];

function AboutUs() {
  return (
    <div className='container_aboutus'>
      <div className='intro_aboutus'>
        <h1>Who are we ?<br /></h1>
        <p>We are four students of 42 school. Transcendence is the last project of our training course. It's a Web project whose goal is to recreate the historical Pong Game. Our team is composed of 4 people who combined their knowledge to build this project.</p>
      </div>
      <div className='div_staff'>
       {teamMembers.map((member, index) => (
        <div className='container_staff' key={index}>
          <img className='image' src={member.image} alt={member.name} />
        <div className='text'>
          <h2>{member.name}</h2>
          <p><a href={member.github} target="_blank">{member.github}</a></p>
        </div>
      </div>
    ))}
  </div>
  // </div>
  );
}

export default AboutUs;