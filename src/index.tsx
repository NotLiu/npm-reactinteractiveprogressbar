import * as React from 'react'
import ProgressBar from './package'

function Package(
  accesscolor: string,
  primarycolor: string,
  segments: number,
  fill: number,
  edit: boolean,
  progressEmpty: boolean
) {
  return (
    <>
      <ProgressBar
        primarycolor={primarycolor}
        accesscolor={accesscolor}
        segments={segments}
        edit={edit}
        fill={fill}
        progressEmpty={progressEmpty}
      />
    </>
  )
}

export default Package
