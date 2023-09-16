import Link from 'next/link';  // Import Link from Next.js
import React, { useEffect } from 'react';

// Generates a random HEX color
const randomHexColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const changeColorOfGroups = (groupIds: string[]): void => {
  groupIds.forEach((id: string) => {
    // Skip the 'white' ID if you don't want to change its color
    if (id === 'white') {
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      console.log("Found element:", element);
      element.childNodes.forEach((child) => {
        if (child instanceof Element) {
          console.log("Changing color for:", child);
          child.setAttribute('fill', randomHexColor());
        }
      });
    } else {
      console.log("Element not found for ID:", id);
    }
  });
};


// Your GeeseComponent
const GeeseComponent: React.FC = () => {
  useEffect(() => {
    fetch('geese.svg') // Replace with the actual path to your SVG
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById('geese-container');
        if (container) {
          container.innerHTML = data;
 

  const whiteGroup = document.getElementById('white');
          if (whiteGroup) {
            whiteGroup.childNodes.forEach((child) => {
              if (child instanceof Element) {
                child.setAttribute('fill', '#FFFFFF');
              }
            });
          }
        }
      });
  }, []);


  return (
    <div>
      <div id="geese-container" style={{ backgroundColor: 'white' }}></div>
  
      {/* Button to change the color of the SVG group with id 'fur1' */}
      <button onClick={() => changeColorOfGroups(['fur1', 'fur2', 'shadow'])}>
        Generate Geese
      </button>
  
      {/* Button to navigate to the GameStart page */}
      <Link href="/gamestart">
        <button>Start Game</button>
      </Link>
    </div>
  );
}
  

export default GeeseComponent;
