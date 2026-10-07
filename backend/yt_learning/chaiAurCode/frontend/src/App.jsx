import RechartsLine from "./Recharts";

import './App.css'
import { ChartJsLine } from "./chartJs";
import { ApexChartsLine } from "./ApexCharts";

function App() {
  // const [jokes, setJokes] = useState([])

  //     const fetchJokes = ()=>{
  //      axios.get("/api/jokes").then((response)=>{
  //       setJokes(response.data);
  //      }).catch((error)=>{
  //       console.log(error);
  //      })
  // }

  // useEffect(()=>{

  //   fetchJokes();
  // },[])
  return (
    <>
      {/* <h1>Full Stack</h1>
     <p>Jokes: {jokes.length}</p>
     {
      jokes.map((joke)=>(
        <div key={joke?.id}>
          <h2>{joke?.title}</h2>
          <p>{joke?.description}</p>
        </div>
      ))
     } */}
      <RechartsLine />
      <div style={{ height: 100, width: "100%" }}></div>
      <ChartJsLine />
      <div style={{ height: 100, width: "100%" }}></div>

      <ApexChartsLine />
    </>
  )
}

export default App
