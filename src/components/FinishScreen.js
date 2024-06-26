import React from "react";
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'; 

function FinishScreen({ points, maxPossiblePoints, highScore , dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;
  const { width, height } = useWindowSize();
  let emoji;
  if (percentage === 100) emoji = "🥇" && <Confetti width={width} height={height} recycle="false"/>;
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨" ;
  if (percentage === 0) emoji = "☹️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPossiblePoints} ({Math.ceil(percentage)}%) points.
      </p>
      <p className="highscore"> (HighScore : {highScore} points)</p>
      <button className="btn btn-ui" onClick={() => dispatch({type: "restart"})}>Restart Quiz</button>
    </>
  );
}

export default FinishScreen;
