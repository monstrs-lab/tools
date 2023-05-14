import type { FC }             from 'react'
import type { IndicatorProps } from 'ink-select-input'

import { Text }                from 'ink'
import { Box }                 from 'ink'
import React                   from 'react'
import figures                 from 'figures'

export const IndicatorComponent: FC<IndicatorProps> = ({ isSelected = false }) => (
  <Box marginRight={1}>
    {isSelected ? <Text color='cyanBright'>{figures.pointer}</Text> : <Text> </Text>}
  </Box>
)
