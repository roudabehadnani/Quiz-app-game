import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import LoadingLayout from "./LoadingLayout";
import ErrorLayout from "./ErrorLayout";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],

  // "loading","error", "ready", "active", "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return { ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points };
    case "nextQuestion":
      return { ...state, index: state.index + 1 , answer: null};
    case "finish":
      return{...state, status: "finished",  highScore: state.points > state.highScore ? state.points : state.highScore};
    case "restart":
      return{...state, status: "ready", index: 0, answer: null, points: 0};
    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore }, dispatch] = useReducer(reducer, initialState);
  const numQuestion = questions.length;
  console.log(numQuestion);

  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <LoadingLayout />}
        {status === "error" && <ErrorLayout />}
        {status === "ready" && <StartScreen numQuestion={numQuestion} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress numQuestion={numQuestion} index={index} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
            <Question question={questions[index]} answer={answer} dispatch={dispatch} /> 
            <NextButton dispatch={dispatch} answer={answer} index={index} points={points} numQuestion={numQuestion} />
          </>
        )}
        {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highScore={highScore} dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;
