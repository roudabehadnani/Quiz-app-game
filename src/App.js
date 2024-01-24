import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import LoadingLayout from './LoadingLayout';
import ErrorLayout from './ErrorLayout';
import StartScreen from './StartScreen';

const initialState = {
  questions:[],

  // "loading","error", "ready", "active", "finished"
  status:"loading"
};
function reducer(state, action){
  switch(action.type){
    case "dataReceived":
      return {...state, questions: action.payload , status:"ready"};
    case "dataFailed":
      return{...state, status:"error"};
    default:
      throw new Error("Unknown action");
    } 
}

function App() {
  
  const [{questions, status}, dispatch] = useReducer(reducer, initialState);
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
        {status === "ready" && <StartScreen numQuestion={numQuestion}/>}
      </Main>
    </div>

  );
}

export default App;
