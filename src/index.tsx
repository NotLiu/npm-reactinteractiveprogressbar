import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs'

const moveProgress = (progressPercentage: string, oldPercentage: string) => {
  return keyframes`
    from {
      width: ${100 - parseFloat(oldPercentage.slice(0, -1)) + '%'};
    }
    to {
      width: ${100 - parseFloat(progressPercentage.slice(0, -1)) + '%'};
    }
  `
}

const RoundedBarCSS = styled.div<{
  secondaryColor: string
  primaryColor: string
  barWidth: string
  tertiaryColor: string
}>`
  position: absolute;
  border-width: 5px;
  border-color: ${({ secondaryColor, tertiaryColor }) =>
    tertiaryColor !== undefined
      ? tertiaryColor || 'black'
      : secondaryColor || 'black'};
  border-radius: 5em;
  border-style: solid;
  height: 1em;
  z-index: 10;
  width: ${({ barWidth }) => barWidth || '50rem'};
`

const BarInsideCSS = styled.div<{
  secondaryColor: string
  primaryColor: string
  progressEmpty: boolean
  tertiaryColor: string
}>`
  position: absolute;
  top: -2px;
  left: -2px;
  border-radius: 10em;
  border-width: 3.5px;
  background-color: ${({ progressEmpty, primaryColor, secondaryColor }) =>
    progressEmpty ? primaryColor || 'white' : secondaryColor || 'black'};
  border-style: solid;
  border-color: ${({ secondaryColor, tertiaryColor }) =>
    tertiaryColor !== undefined
      ? tertiaryColor || 'black'
      : secondaryColor || 'black'};
  width: calc(100% - 2px);
  height: 80%;
  z-index: 1;
`

const BarInsideNegCSS = styled.div<{
  progressPercentage: string
  primaryColor: string
  oldPercentage: string
  secondaryColor: string
  tertiaryColor: string
}>`
  position: absolute;
  background-color: ${({ primaryColor }) => primaryColor || 'white'};

  border-top-right-radius: 5em;
  border-bottom-right-radius: 5em;
  border-bottom-left-radius: ${({ progressPercentage }) =>
    (progressPercentage === '0%' && '5em') || 0};
  border-top-left-radius: ${({ progressPercentage }) =>
    (progressPercentage === '0%' && '5em') || 0};
  /* top: -5%; */
  height: 100%;
  z-index: 2;
  right: 0px;
  width: ${({ progressPercentage }) =>
    100 - parseFloat(progressPercentage.slice(0, -1)) + '%' || '90%'};
  animation: ${(props) =>
      moveProgress(props.progressPercentage, props.oldPercentage)}
    0.25s ease-out;
  color: ${(props: any) => props.primaryColor || 'white'};
`

const ProgressNotch = styled.div<{
  progressPercentage: string
  secondaryColor: string
  primaryColor: string
  tertiaryColor: string
}>`
  position: absolute;
  left: ${({ progressPercentage }) => progressPercentage || '0%'};
  top: -50%;
  background-color: ${({ secondaryColor, tertiaryColor }) =>
    tertiaryColor !== undefined
      ? tertiaryColor || 'black'
      : secondaryColor || 'black'};
  /* border-style: solid; */
  border-radius: 2em;
  border-color: ${({ primaryColor }) => primaryColor || 'white'};
  border-width: 3px;
  width: 5px;
  height: 200%;
  z-index: 5;
`

const ProgressButton = styled.div<{ numSegments: number; segment: number }>`
  position: absolute;
  /* background-color: green; */
  width: ${({ numSegments }) => 100 / numSegments + '%'};
  margin-left: ${({ numSegments, segment }) =>
    (segment - 1) * (100 / numSegments) + '%'};
  top: -100%;
  height: 300%;
  z-index: 9;
`
const ProgressUlCSS = styled.ul`
  margin: 0 0;
  padding: 0 0;
  display: inline-flex;
  flex-direction: row;
  width: 100%;
`

const ProgressLiCSS = styled.li`
  width: 100%;
  padding: 0 0;
  list-style: none;
  /* padding-left: 2em; */
  z-index: 8;
`

export const ArrowsCSS = styled.div<{
  secondaryColor: string
  tertiaryColor: string
}>`
  /* position: absolute; */
  /* margin-left: 20.5em; */
  padding-top: 0.25em;
  width: 2em;
  color: ${({ secondaryColor, tertiaryColor }) =>
    tertiaryColor !== undefined
      ? tertiaryColor || 'black'
      : secondaryColor || 'black'};
  z-index: 1;
`

interface props {
  segments?: number
  fill?: number
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  edit?: boolean
  width?: string
}

export default function ProgressBar({
  segments = 4,
  fill = 1,
  primaryColor = 'white',
  secondaryColor = 'black',
  tertiaryColor = 'black',
  edit = true,
  width = '20rem',
}: props) {
  const [percentage, setPercentage] = useState(fill * (100 / segments) + '%')
  const [lastPercentage, setLastPercentage] = useState(
    fill * (100 / segments) + '%'
  )
  const [progressEmpty, setProgressempty] = useState(false)
  const [lastSegment, setlastSegment] = useState(fill)
  const [secondlastSegment, setSecondlastSegment] = useState(fill)
  const numSegments = segments

  function handleProgress(segment: number) {
    setlastSegment(segment)
    setSecondlastSegment(lastSegment)
    setLastPercentage(percentage)
    if (segment === lastSegment && segment === 1 && progressEmpty === false) {
      // setProgressempty(true);
    } else {
      setProgressempty(false)
    }

    //logic for making sure clicking progress bar functions properly, e.g. clicking lit section unlights it, after unlighting a section you can unlight the next lit section in one click, you can light and unlight sections repeatedly
    if (
      (segment === lastSegment &&
        progressEmpty === false &&
        lastSegment !== secondlastSegment) ||
      segment * (100 / numSegments) + '%' === percentage
    ) {
      setPercentage((segment - 1) * (100 / numSegments) + '%')
    } else {
      setPercentage(segment * (100 / numSegments) + '%')
    }
  }

  function handleArrows(change) {
    setlastSegment(
      (parseFloat(percentage.slice(0, -1)) + change) / (100 / numSegments)
    )
    setSecondlastSegment(lastSegment)
    setLastPercentage(percentage)
    if (
      !(parseFloat(percentage.slice(0, -1)) + change > 100) &&
      !(parseFloat(percentage.slice(0, -1)) + change < 0)
    ) {
      if (parseFloat(percentage.slice(0, -1)) + change + '%' === '0%') {
        // setProgressempty(true);
      } else {
        setProgressempty(false)
      }
      setPercentage(parseFloat(percentage.slice(0, -1)) + change + '%')
    } else {
      console.log('ARROW CHANGE OUT OF BOUNDS')
    }
  }

  function generateNotches() {
    const notches: JSX.Element[] = []
    for (let i = 1; i < numSegments; i++) {
      notches.push(
        <ProgressNotch
          progressPercentage={(100 / numSegments) * i + '%'}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          tertiaryColor={tertiaryColor}
          key={i}
        />
      )
    }
    return notches
  }

  function generateButtons() {
    const buttons: JSX.Element[] = []
    for (let i = 1; i <= numSegments; i++) {
      buttons.push(
        <ProgressButton
          segment={i}
          onClick={() => {
            handleProgress(i)
          }}
          numSegments={numSegments}
          key={i}
        />
      )
    }
    return buttons
  }

  return (
    <ProgressUlCSS>
      <ProgressLiCSS>
        <RoundedBarCSS
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          tertiaryColor={tertiaryColor}
          barWidth={width}
        >
          {generateNotches()}
          {edit && generateButtons()}

          <BarInsideCSS
            progressEmpty={progressEmpty}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            tertiaryColor={tertiaryColor}
          >
            <BarInsideNegCSS
              progressPercentage={percentage}
              oldPercentage={lastPercentage}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              tertiaryColor={tertiaryColor}
            ></BarInsideNegCSS>
          </BarInsideCSS>
        </RoundedBarCSS>
      </ProgressLiCSS>
      <ProgressLiCSS
        style={{ position: 'absolute', left: `calc(${width} + 2rem)` }}
      >
        {edit && (
          <ArrowsCSS
            secondaryColor={secondaryColor}
            tertiaryColor={tertiaryColor}
          >
            <BsCaretLeftFill
              onClick={() => {
                handleArrows(-(100 / numSegments))
              }}
            />
            <BsCaretRightFill
              onClick={() => {
                handleArrows(100 / numSegments)
              }}
            />
          </ArrowsCSS>
        )}
      </ProgressLiCSS>
    </ProgressUlCSS>
  )
}
