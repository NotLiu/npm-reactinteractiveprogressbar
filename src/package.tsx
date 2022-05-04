import * as React from 'react'
import styled, { keyframes } from 'styled-components'

export declare interface AppProps {
  segments: number
  fill: number
  progressEmpty: boolean
  primarycolor: string
  accesscolor: string
  edit: boolean
}

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
  accesscolor: string
  primaryColor: string
}>`
  position: absolute;
  border-width: 5px;
  border-color: ${({ accesscolor }) => accesscolor || 'black'};
  border-radius: 5em;
  border-style: solid;
  height: 1em;
  z-index: 10;
  width: inherit;
`

const BarInsideCSS = styled.div<{
  accesscolor: string
  primaryColor: string
  progressEmpty: boolean
}>`
  position: absolute;
  border-radius: 10em;
  background-color: ${({ progressEmpty, primaryColor, accesscolor }) =>
    progressEmpty ? primaryColor || 'white' : accesscolor || 'black'};
  border-style: solid;
  width: 99.5%;
  height: 80%;
  z-index: 1;
`

const BarInsideNegCSS = styled.div<{
  progressPercentage: string
  primaryColor: string
  oldPercentage: string
  accesscolor: string
}>`
  position: absolute;
  background-color: ${({ primaryColor }) => primaryColor || 'white'};
  border-top-right-radius: 5em;
  border-bottom-right-radius: 5em;
  border-bottom-left-radius: ${({ progressPercentage }) =>
    (progressPercentage == '0%' && '5em') || 0};
  border-top-left-radius: ${({ progressPercentage }) =>
    (progressPercentage == '0%' && '5em') || 0};
  top: -5%;
  height: 110%;
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
  accesscolor: string
  primaryColor: string
}>`
  position: absolute;
  left: ${({ progressPercentage }) => progressPercentage || '0%'};
  top: -100%;
  background-color: ${({ accesscolor }) => accesscolor || 'black'};
  /* border-style: solid; */
  border-radius: 2em;
  border-color: ${({ primaryColor }) => primaryColor || 'white'};
  border-width: 3px;
  width: 5px;
  height: 300%;
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
  width: inherit;
`

const ProgressLiCSS = styled.li`
  width: inherit;
  padding: 0 0;
  list-style: none;
  /* padding-left: 2em; */
  z-index: 8;
`

// export const ArrowsCSS = styled.div`
//   position: absolute;
//   margin-left: 20.5em;
//   padding-top: 0.25em;
//   width: 2em;
//   color: ${(props) => props.accesscolor || "black"};
//   z-index: 1;
// `;
export default function ProgressBar(props: AppProps) {
  const [percentage, setPercentage] = React.useState(
    props.fill * (100 / props.segments) + '%'
  )
  const [lastPercentage, setLastPercentage] = React.useState(
    props.fill * (100 / props.segments) + '%'
  )
  const [progressEmpty, setProgressempty] = React.useState(props.progressEmpty)
  const [lastSegment, setlastSegment] = React.useState(props.fill)
  const [secondlastSegment, setSecondlastSegment] = React.useState(props.fill)
  const numSegments = props.segments

  function handleProgress(segment: number) {
    setlastSegment(segment)
    setSecondlastSegment(lastSegment)
    setLastPercentage(percentage)
    if (segment == lastSegment && segment == 1 && progressEmpty == false) {
      // setProgressempty(true);
    } else {
      setProgressempty(false)
    }

    //logic for making sure clicking progress bar functions properly, e.g. clicking lit section unlights it, after unlighting a section you can unlight the next lit section in one click, you can light and unlight sections repeatedly
    if (
      (segment == lastSegment &&
        progressEmpty == false &&
        lastSegment != secondlastSegment) ||
      segment * (100 / numSegments) + '%' == percentage
    ) {
      setPercentage((segment - 1) * (100 / numSegments) + '%')
    } else {
      setPercentage(segment * (100 / numSegments) + '%')
    }
  }

  // function handleArrows(change) {
  //   setlastSegment(
  //     (parseFloat(percentage.slice(0, -1)) + change) / (100 / numSegments)
  //   );
  //   setSecondlastSegment(lastSegment);
  //   setLastPercentage(percentage);
  //   if (
  //     !(parseFloat(percentage.slice(0, -1)) + change > 100) &&
  //     !(parseFloat(percentage.slice(0, -1)) + change < 0)
  //   ) {
  //     if (parseFloat(percentage.slice(0, -1)) + change + "%" == "0%") {
  //       // setProgressempty(true);
  //     } else {
  //       setProgressempty(false);
  //     }
  //     setPercentage(parseFloat(percentage.slice(0, -1)) + change + "%");
  //   } else {
  //     console.log("ARROW CHANGE OUT OF BOUNDS");
  //   }
  // }

  function generateNotches() {
    const notches: JSX.Element[] = []
    for (let i = 1; i < numSegments; i++) {
      notches.push(
        <ProgressNotch
          progressPercentage={(100 / numSegments) * i + '%'}
          primaryColor={props.primarycolor}
          accesscolor={props.accesscolor}
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
          primaryColor={props.primarycolor}
          accesscolor={props.accesscolor}
        >
          {generateNotches()}
          {props.edit && generateButtons()}

          <BarInsideCSS
            progressEmpty={progressEmpty}
            primaryColor={props.primarycolor}
            accesscolor={props.accesscolor}
          >
            <BarInsideNegCSS
              progressPercentage={percentage}
              oldPercentage={lastPercentage}
              primaryColor={props.primarycolor}
              accesscolor={props.accesscolor}
            ></BarInsideNegCSS>
          </BarInsideCSS>
        </RoundedBarCSS>
      </ProgressLiCSS>
      {/* <ProgressLiCSS>
          {props.edit && (
            <ArrowsCSS
              primaryColor={props.primaryColor}
              accesscolor={props.accesscolor}
            >
              <BsFillCaretLeftFill
                onClick={() => {
                  handleArrows(-(100 / numSegments));
                }}
              />
              <BsFillCaretRightFill
                onClick={() => {
                  handleArrows(100 / numSegments);
                }}
              />
            </ArrowsCSS>
          )}
        </ProgressLiCSS> */}
    </ProgressUlCSS>
  )
}
