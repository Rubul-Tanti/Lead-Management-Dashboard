import { Route, Routes } from "react-router-dom"
import SmartLeadsDashboard from "./component/dashboard"

function App() {

  return (
  <>
  <Routes>
    <Route path="/" element={<SmartLeadsDashboard/>}/>
    <Route path="/sign-in" element={<SmartLeadsDashboard/>}/>
  </Routes>
  </>
  )
}

export default App
