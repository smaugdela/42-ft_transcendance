import React, { useState } from 'react';
import "../styles/FAQ.css"

interface FaqItem{
  question :string;
  answer: string;
  open: boolean;
}


const faqs: FaqItem[] = [
  {
    question: 'How to ban a friend?',
    answer: 'kill him/her',
    open: false,
  },
  {
    question: 'How to play?',
    answer: 'with your brain',
    open: false,
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
      <div >
        <h1>Frequently Asked Questions</h1>
        <div >
          {faqs.map((faq, index) => (
            <div key={index}>
              <h2 className='faq' onClick={() => toggleActiveIndex(index)}>
                {faq.question} {activeIndex === index ? '-' : '+'}
              {activeIndex === index && <p>{faq.answer}</p>} </h2>
            </div>
        
      ))}</div>
    </div>
    );
  }
  

export default FAQ;
