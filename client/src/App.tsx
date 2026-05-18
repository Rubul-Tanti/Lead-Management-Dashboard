import { Route, Routes } from "react-router-dom"
import SmartLeadsDashboard from "./component/dashboard"
import Register from "./component/auth/signup"
import Login from "./component/auth/signin"
import ForgotPassword from "./component/auth/forgot-password"
import NotFound from "./component/pageNotFound"

function App() {

  return (
  <>
  <Routes>
    <Route path="/" element={<SmartLeadsDashboard/>}/>
    <Route path="/signup" element={<Register/>}/>
    <Route path="/signin" element={<Login />}/>
    <Route path="/forgot-password" element={<ForgotPassword />}/>
    <Route path="*" element={<NotFound />}/>
  </Routes>
  </>
  )
}

export default App
