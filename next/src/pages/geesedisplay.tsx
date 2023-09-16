import Link from 'next/link';
import React, { useEffect } from 'react';

const randomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const changeColorOfGroups = (groupIds) => {
  groupIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.childNodes.forEach((child) => {
        if (child instanceof Element) {
          if (id === 'white') {
            child.setAttribute('fill', '#FFFFFF');
          } else {
            child.setAttribute('fill', randomHexColor());
          }
        }
      });
    }
  });
};

const changeBackgroundColor = () => {
  document.body.style.backgroundColor = randomHexColor();
};

const GeeseComponent = () => {
  useEffect(() => {
    fetch('geese.svg')
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById('geese-container');
        if (container) {
          container.innerHTML = data;
          
          // Change colors and background immediately upon loading
          changeColorOfGroups(['fur1', 'fur2', 'shadow', 'white', 'feet', 'svg-background']);
          changeBackgroundColor();
          
        }
      });
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
   <button      
    onClick={() => { 
      changeColorOfGroups(['fur1', 'fur2', 'shadow', 'white', 'feet', 'svg-background']); 
      changeBackgroundColor();
    }}
      >
        Generate Geese
      </button>
      
      <div id="geese-container" style={{ backgroundColor: 'white' }}></div>
  
      <Link href="/gamestart">
        <button>Start Game</button>
      </Link>
    </div>
  );
};

export default GeeseComponent;
