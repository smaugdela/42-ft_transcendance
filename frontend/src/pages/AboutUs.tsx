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
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Anna',
    position: 'COO',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Marine',
    position: 'CTO',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    image: 'https://via.placeholder.com/200',
  },
  {
    name: 'Fahima',
    position: 'CTO',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: 'https://via.placeholder.com/200',
  },
];

function AboutUs() {
  return (
    <div className='background_aboutus'>
      <section className='aboutus'>
        <h1>Who are we ?</h1>
      </section>
      <section className='container'>
       {teamMembers.map((member, index) => (
      <div  className='container_staff' key={index}>
        <img src={member.image} alt={member.name} />
        <h2>{member.name}</h2>
        <p>{member.position}</p>
        {/* <p>{member.description}</p> */}
      </div>
    ))}
    </section>
      <section>
        <p>We are the super team that created the best game online called Pong Game </p>
      </section>
  </div>
  );
}

export default AboutUs;