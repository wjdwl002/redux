import React from 'react'
import {translate} from '@docusaurus/Translate'

export const DetailedExplanation = ({
  children,
  title = translate({message:'Detailed Explanation'})
}) => {
  return (
    <details className="detailed-explanation">
      <summary>
        <h4>{title}</h4>
      </summary>
      {children}
    </details>
  )
}
