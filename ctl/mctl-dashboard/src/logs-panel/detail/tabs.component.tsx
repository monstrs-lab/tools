import React from 'react'

export const Tabs = ({ mode }) => (
  <>
    <blessed-box top={0} height={1} left={0} width='100%' style={{ bg: 'gray' }} />
    <blessed-box top={0} height={1} left={3} width={2} style={{ width: 10 }}>
      <blessed-text left={0} width={1} content='|' style={{ bg: '', fg: 'white' }} />
      <blessed-text
        left={1}
        width={14}
        content='  Detail [d]  '
        style={mode === 'formatted' ? { bg: 'blue', fg: 'white' } : { bg: 'gray', fg: 'white' }}
      />
      <blessed-text left={15} width={1} content='|' style={{ bg: '', fg: 'white' }} />
      <blessed-text
        left={16}
        width={14}
        content='    Raw [r]   '
        style={mode === 'raw' ? { bg: 'blue', fg: 'white' } : { bg: 'gray', fg: 'white' }}
      />
      <blessed-text left={30} width={1} content='|' style={{ bg: '', fg: 'white' }} />
    </blessed-box>
  </>
)
