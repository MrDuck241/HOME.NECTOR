import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import CamerasPanel from './components/CamerasPanel'
import RobotsPanel from './components/RobotsPanel'
import DevicesPanel from './components/DevicesPanel'
import AlternativeViewPanel from './components/AlternativeViewPanel'
import LearnMorePanel from './components/LearnMorePanel'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path = "/cameras" element = {<CamerasPanel/>} />
        <Route path = "/robots" element = {<RobotsPanel/>} />
        <Route path = "/devices" element = {<DevicesPanel/>} />
        <Route path = "/alternative_view" element = {<AlternativeViewPanel/>} />
        <Route path = "/learn_more" element = {<LearnMorePanel/>} />
      </Routes>
    </Router>
  )
}

export default App
