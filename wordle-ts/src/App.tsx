import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [target, setTarget] = useState("words")
  const [attempts, setAttempts] = useState<string[]>([])
  const [inputVal, setInputVal] = useState("");

  return (
    <div className="App">

    <form>
      
    </form>

    </div>
  )
}

export default App
