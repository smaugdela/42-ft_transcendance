import React, { useState } from 'react';
import "../styles/FAQ.css"

interface FaqItem{
  question :string;
  answer: string;

}

const faqs: FaqItem[] = [
  {
    question: 'What is Transcendence ?',
    answer: 'Transcendence is the final project of the common-core of the school 42-Paris. The purpose of this project is to create a website with a pong game including all matchmaking, ranking, and chat features.',
  },
  {
    question: 'How to play Pong?',
    answer: 'The goal of this game is to defeat your opponent by being the first one to gain 10 point. A player gets a point once the opponent misses a ball. You can play the classic mode or the custom which add a powerup that can change the paddles directions arrows !',
  },
  {

    question: 'How to block or remove a friend ?',
    answer: 'Click the name of the friend you want to remove or block. Select BLOCK or UNFRIEND, and then click to confirm.',
  },
  {
    question: 'How to create a chat channel ?',
    answer: 'Go PM Marine.',
  },
  {
    question: 'How to use the two-factor authentification ?',
    answer: 'Simply by adding your email in the settings.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleActiveIndex = (index: number) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } 
    else {
      setActiveIndex(index);
    }
  
  };
    return (
      <div className='background_faq'>
        <div className='faq'>
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2 className='faq_box' onClick={() => toggleActiveIndex(index)}>
                {faq.question} 
                  <span className='symbol'>{activeIndex === index ? '-' : '+'}</span>
                {activeIndex === index && <p className='answer'>{faq.answer}</p>} 
              </h2>
            </div>
      ))}
        </div>
      </div>
    );
  }
  

export default FAQ;
