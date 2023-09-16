import React, { useEffect, useRef, useState } from 'react';

const GooseComponent = ({ fur1Color, fur2Color }) => {
  const [svgContent] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const fur1Group = svgElement.querySelector('#fur1');
      
      if (fur1Group) {
        fur1Group.childNodes.forEach((node) => {
          if (node.setAttribute) {
            node.setAttribute('fill', fur1Color);
          }
        });
      }
    }
  }, [fur1Color, fur2Color]);

  return <div ref={svgRef} dangerouslySetInnerHTML={{ __html: svgContent }} />;
};

export default GooseComponent;
