import React from 'react';

const Quarter = ({ style }: { style: React.CSSProperties }) => {
  return (
    <div
      className="quarter"
      style={{
        width: '1px',
        height: '10px',
        margin: '0 6px',
        backgroundColor: 'rgb(217, 217, 217)',
        ...style,
      }}
    />
  );
};

export default Quarter;
