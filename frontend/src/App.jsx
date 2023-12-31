import HomePage from "./COMPONENTS/homePage";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Signin from "./COMPONENTS/signin";
import Login from "./COMPONENTS/login"

const App = ()=>{
  return(
    <>
        <BrowserRouter>
        <Routes>
          <Route index element={<Login/>}/>
          <Route path="homePage" element={<HomePage/>}/>
          <Route path="signin" element={<Signin/>}/>
        </Routes>
        </BrowserRouter>
    </>
  )
}
export default App;