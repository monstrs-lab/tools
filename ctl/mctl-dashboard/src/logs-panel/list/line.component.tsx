import React        from 'react'

import { Severity } from './severity.component'
import { Body }     from './body.component'
import { Name }     from './name.component'

export const Line = ({ top, index, selectedIndex, severity, body, name = '' }: any) => {
  const isSelected = index === selectedIndex

  return (
    <blessed-box top={top} height={1} left={0} width='100%'>
      <Severity left={0} width={6} isSelected={isSelected}>
        {severity}
      </Severity>
      <Name left={6} width={24} isSelected={isSelected}>
        {name}
      </Name>
      <Body left={30} fill isSelected={isSelected}>
        {body}
      </Body>
    </blessed-box>
  )
}
