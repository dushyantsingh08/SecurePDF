import React from 'react';

export type PDFActionType = 
  | 'merge' | 'split' | 'compress' | 'protect' | 'unlock' 
  | 'rotate' | 'delete' | 'reorder' | 'watermark' | 'repair' 
  | 'flatten' | 'pdf-to-jpg' | 'pdf-to-png' | 'pdf-to-docx' 
  | 'pdf-to-xlsx' | 'pdf-to-txt' | 'edit';

export interface PDFOperationData {
  id: string;
  operation: PDFActionType;
  title: string;
  description: string;
  tag: string;
  isPopular?: boolean;
}

interface PDFCardProps {
  data: PDFOperationData;
  index?: number;
  onClick: (operation: PDFActionType) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ data, index = 0, onClick }) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={() => onClick(data.operation)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? 'rgba(255,215,0,0.04)' : 'rgba(20,18,14,0.8)',
        border: `1px solid ${hovered ? 'rgba(255,215,0,0.35)' : 'rgba(255,215,0,0.1)'}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        padding: '40px',
        height: '100%',
        transition: 'all 0.25s ease',
        boxShadow: 'none',
        overflow: 'hidden'
      }}
    >
      {/* dot-grid on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,215,0,0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />

      {/* Top row: index + tag */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '48px',
          fontWeight: 700,
          color: hovered ? 'rgba(255,215,0,0.15)' : 'rgba(255,215,0,0.06)',
          lineHeight: 1,
          transition: 'color 0.25s ease'
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: hovered ? '#FFD700' : '#888',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          fontWeight: 700,
          borderBottom: `2px solid ${hovered ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.1)'}`,
          paddingBottom: '6px',
          transition: 'all 0.25s ease'
        }}>
          {data.tag}
        </span>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          color: hovered ? '#FFD700' : '#e8e8e8',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          marginBottom: '12px',
          transition: 'color 0.25s ease'
        }}>
          {data.title}
        </h3>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: hovered ? '#ddd' : '#aaa',
          lineHeight: 1.7,
          marginBottom: '32px',
          flex: 1,
          transition: 'color 0.25s ease'
        }}>
          {data.description}
        </p>

        {/* Action line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '20px',
          borderTop: `1px solid ${hovered ? 'rgba(255,215,0,0.2)' : 'rgba(255,215,0,0.07)'}`,
          transition: 'border-color 0.25s ease'
        }}>
          <span style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            color: hovered ? '#FFD700' : '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: 700,
            transition: 'color 0.25s ease'
          }}>
            Execute Protocol →
          </span>
          <div style={{
            width: '8px',
            height: '8px',
            background: hovered ? '#FFD700' : 'rgba(255,215,0,0.2)',
            transition: 'background 0.25s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

export default PDFCard;