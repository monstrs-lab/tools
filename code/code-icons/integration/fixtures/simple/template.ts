export default (variables, { tpl }): string => tpl`
  import React from 'react'

  import { vars } from '@fixtures/icons-theme'
  
  export const ${variables.componentName} = ({ $color, ...props }) => (
    ${variables.jsx}
  );
  `
