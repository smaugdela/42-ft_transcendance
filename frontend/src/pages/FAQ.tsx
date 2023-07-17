import React, { useState } from 'react';
import "../styles/FAQ.css"

interface FaqItem{
  question :string;
  answer: string;

}

const faqs: FaqItem[] = [
  {
    question: 'What is Pong ?',
    answer: 'Pong is one of the first computer games that ever created. This simple "tennis like" game features two paddles and a ball.',
  },
  {
    question: 'How to play Pong?',
    answer: 'The goal of this game is to defeat your opponent by being the first one to gain 10 point. A player gets a point once the opponent misses a ball. The game can be played with two human players, or one player against a computer controlled paddle.',
  },
  {
    question: 'How to block or remove a friend ?',
    answer: 'Click the name of the friend you want to remove or block. Select BLOCK or UNFRIEND, and then click to confirm.',
  },
  {
    question: 'Can we save the game progress?',
    answer: 'srhshshshshshs',
  },
  {
    question: 'Blabloubli ?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra lorem eu dolor rhoncus, at scelerisque ligula gravida. Sed porta id mi sit amet convallis. Etiam iaculis massa sit amet lacus blandit sodales. Nulla ultrices velit a diam placerat congue. Pellentesque iaculis, ipsum quis eleifend dapibus, est dui eleifend ante, quis fermentum mi ligula quis nisl. Ut et ex dui. Integer id venenatis quam.',
  },
  {
    question: 'Booba ?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra lorem eu dolor rhoncus, at scelerisque ligula gravida. Sed porta id mi sit amet convallis. Etiam iaculis massa sit amet lacus blandit sodales. Nulla ultrices velit a diam placerat congue. Pellentesque iaculis, ipsum quis eleifend dapibus, est dui eleifend ante, quis fermentum mi ligula quis nisl. Ut et ex dui. Integer id venenatis quam.',
  },
  {
    question: 'Pong pong pong ?',
    answer: 'Poing ping.',
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
