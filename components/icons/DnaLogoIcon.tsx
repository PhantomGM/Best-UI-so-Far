import React from 'react';

// This is a more faithful representation of the abstract logo provided.
// It uses a combination of paths to create the crucible and the chaotic "plume".
const DnaLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fill="currentColor">
      {/* The crucible/pot at the bottom */}
      <path d="M24,110 V92 C24,80 76,80 76,92 V110 H66 V92 C66,85 34,85 34,92 V110 Z" />
      
      {/* The abstract "plume" or explosion. This is a single complex path to capture the chaotic, overlapping nature. */}
      <path d="
        M50,85 L50,65
        M50,66 L59,63 L62,53 L54,55 L56,42 L67,40 L64,30 L54,35 L52,23 L48,23 L46,35 L36,30 L33,40 L44,42 L46,55 L38,53 L41,63 L50,66 Z
        M40,38 L31,36 L33,28 L39,32 Z
        M60,38 L69,36 L67,28 L61,32 Z
        M48,20 L50,10 L52,20 Z
        M45,60 L35,62 L38,70 L46,65 Z
        M55,60 L65,62 L62,70 L54,65 Z
      " />
    </g>
  </svg>
);

export default DnaLogoIcon;