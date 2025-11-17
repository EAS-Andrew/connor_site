/**
 * BumperOverlay Component
 * SVG overlay showing bumper outline guide for photo capture
 */

interface BumperOverlayProps {
  type: 'front' | 'rear';
}

export default function BumperOverlay({ type }: BumperOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark overlay background */}
        <defs>
          <mask id="bumperMask">
            <rect width="100" height="100" fill="white" />
            {/* Bumper cutout area */}
            <rect x="15" y="35" width="70" height="30" rx="3" fill="black" />
          </mask>
        </defs>
        
        {/* Semi-transparent dark overlay */}
        <rect
          width="100"
          height="100"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#bumperMask)"
        />
        
        {/* Bumper guide outline */}
        <rect
          x="15"
          y="35"
          width="70"
          height="30"
          rx="3"
          fill="none"
          stroke="#ff3333"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
        
        {/* Center guidelines */}
        <line
          x1="50"
          y1="33"
          x2="50"
          y2="67"
          stroke="#ff3333"
          strokeWidth="0.3"
          strokeDasharray="1,1"
          opacity="0.5"
        />
        <line
          x1="13"
          y1="50"
          x2="87"
          y2="50"
          stroke="#ff3333"
          strokeWidth="0.3"
          strokeDasharray="1,1"
          opacity="0.5"
        />
        
        {/* Corner markers */}
        <circle cx="15" cy="35" r="0.8" fill="#ff3333" />
        <circle cx="85" cy="35" r="0.8" fill="#ff3333" />
        <circle cx="15" cy="65" r="0.8" fill="#ff3333" />
        <circle cx="85" cy="65" r="0.8" fill="#ff3333" />
      </svg>
      
      {/* Instruction text */}
      <div className="absolute top-4 left-0 right-0 text-center px-4">
        <div className="bg-black/70 inline-block px-4 py-2 rounded">
          <p className="text-white text-sm font-heading tracking-wider">
            {type === 'front' ? 'FRONT BUMPER' : 'REAR BUMPER'}
          </p>
          <p className="text-radar-grey-light text-xs mt-1">
            Center bumper in frame
          </p>
        </div>
      </div>
      
      {/* Bottom tips */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="bg-black/70 px-4 py-2 rounded max-w-md mx-auto">
          <p className="text-radar-grey-light text-xs text-center">
            💡 Ensure good lighting • Keep camera straight • Capture full bumper width
          </p>
        </div>
      </div>
    </div>
  );
}

