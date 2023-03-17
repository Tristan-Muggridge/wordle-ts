import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

enum CharacterStatus {
	Correct = "Correct",
	Close = "Close",
	Incorrect = "Incorrect",
	None = "None"
}

interface IWordMap {
	[key: string]: number
}

class Character {
	value: string
	status: CharacterStatus

	constructor(value: string, status: CharacterStatus) {
		this.value = value;
		this.status = status;
	}
}

class Attempt {
	letters: Character[];

	constructor(attempt: string) {		
		this.letters = attempt.split("").map( char => new Character(char, CharacterStatus.None))
	}
}



function App() {
	const [target, setTarget] = useState("words")
	const [attempts, setAttempts] = useState<Attempt[]>(new Array(5).fill(new Attempt("     ")))
	const [attempt, setAttempt] = useState("");
	const [attemptQty, setAttemptQty] = useState(0);
	const attemptInput = useRef<HTMLInputElement>(null);
	const [targetMap, setTargetMap] = useState<IWordMap>({});

	useEffect(()=> {
		const output: { [key: string]: number } = {};
		target.split('').forEach((char: string, index: number) => output[char] = index);
		setTargetMap({...output})
	}, [target])

	const handleKeydown = (e: ChangeEvent<HTMLInputElement>) => {
		const {target: {value: currentVal}} = e
		if (currentVal.length <= 5) setAttempt(currentVal);
	}

	const analyseAttempt = () => {    
		console.debug(attempt.split('').map((char, index: number) => targetMap[char] >= 0 ? (targetMap[char] == index ? index : targetMap[char] ) : null  ))
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.debug("submitted: ", attempt);
		
		analyseAttempt();

		setAttempt("");
		setAttemptQty(attemptQty+1);
	}

	return (
		<div className="App">
			
			<ul className='grid grid-cols-5 gap-2 my-10'> 
			
			{ 
				attempts.map( attempt => {
					return attempt.letters.map( letter => {
						return <ol className='p-2 bg-slate-700 rounded-lg outline outline-slate-500 outline-2'><pre> {letter.value ? letter.value : ''} </pre></ol>
					})
				})
			}
			</ul>

			{ attemptQty < 5 &&  <form className='' onSubmit={handleSubmit}>
				<label htmlFor="attempt" className=''>Attempt:</label>
				<input 
					className='mx-2 rounded-lg p-1'
					type="text" 
					id="attempt" 
					onChange={handleKeydown} 
					value={attempt} 
					ref={attemptInput} />
			</form>}

		</div>
  	)
}

export default App;
