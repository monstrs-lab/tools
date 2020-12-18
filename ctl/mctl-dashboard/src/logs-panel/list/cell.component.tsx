import React from 'react'

export const Cell = ({ isSelected, left = 0, width, offset = 0, fill, color, children }: any) => {
  const cellWidth = fill ? `100%-${left + offset}` : width
  const styleWith = fill ? `100%-${left + offset + 1}` : width

  return (
    <blessed-box
      left={left}
      width={cellWidth}
      content={children}
      style={{
        bg: isSelected ? 'blue' : '',
        fg: isSelected ? 'white' : color || 'white',
        bold: false,
        left,
        width: styleWith,
      }}
    />
  )
}
