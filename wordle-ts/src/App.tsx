import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [target, setTarget] = useState("words")
  const [attempts, setAttempts] = useState<string[]>([])
  const [attempt, setAttempt] = useState("");

  const attemptInput = useRef<HTMLInputElement>(null);

  const handleKeydown = (e: ChangeEvent<HTMLInputElement>) => {
    const {target: {value: currentVal}} = e
    if (currentVal.length <= 5) setAttempt(currentVal);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.debug("submitted: ", attempt);
    
    setAttempts([attempt, ...attempts])
    setAttempt("")
  }

  return (
    <div className="App">
    
    <form className='' onSubmit={handleSubmit}>
      <label htmlFor="attempt">Attempt:</label>
      <input 
        type="text" 
        id="attempt" 
        onChange={handleKeydown} 
        value={attempt} 
        ref={attemptInput} />
    </form>

    </div>
  )
}

export default App
