import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import LoadingLayout from './LoadingLayout';
import ErrorLayout from './ErrorLayout';
import StartScreen from './StartScreen';
import Question from './Question';

const initialState = {
  questions:[],

  // "loading","error", "ready", "active", "finished"
  status:"loading",
  index:0,
  answer: null,
  points:0
};
function reducer(state, action){
  switch(action.type){
    case "dataReceived":
      return {...state, questions: action.payload , status:"ready"};
    case "dataFailed":
      return{...state, status:"error"};
    case "start":
      return{...state, status:"active"}
    case "newAnswer":
      const question = state.questions.at(state.index)
      return{...state, answer:action.payload, points:action.payload === question.correctOption ? state.points + question.points : state.points}
    default:
      throw new Error("Unknown action");
    } 
}

function App() {
  
  const [{questions, status, index, answer, points}, dispatch] = useReducer(reducer, initialState);
  const numQuestion = questions.length;
  console.log(numQuestion)

  useEffect(()=>{
    fetch("http://localhost:3001/questions")
    .then(res =>res.json())
    .then(data=>dispatch({type:'dataReceived', payload:data}))
    .catch(err=>dispatch({type:'dataFailed'}))
  },[])

  return (
    <div className='app'>
      <Header/>
      <Main>
        {status === "loading" && <LoadingLayout/>}
        {status === "error" && <ErrorLayout/>}
        {status === "ready" && <StartScreen numQuestion={numQuestion} dispatch={dispatch}/>}
        {status === "active" && <Question question={questions[index]} answer={answer} dispatch={dispatch}/>}
      </Main>
    </div>

  );
}

export default App;
