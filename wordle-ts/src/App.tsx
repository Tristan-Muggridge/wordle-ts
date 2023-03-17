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

	constructor(attempt: Character[]) {		
		this.letters = attempt;
	}
}



function App() {
	const [target, setTarget] = useState("words")
	const [attempts, setAttempts] = useState<Attempt[]>(new Array(5).fill(new Attempt(new Array(5).fill(new Character('', CharacterStatus.None)))))
	const [attempt, setAttempt] = useState("");
	const [attemptQty, setAttemptQty] = useState(0);
	const attemptInput = useRef<HTMLInputElement>(null);
	const [targetMap, setTargetMap] = useState<IWordMap>({});

	console.debug(attempts)

	useEffect(()=> {
		const output: { [key: string]: number } = {};
		target.split('').forEach((char: string, index: number) => output[char] = index);
		setTargetMap({...output})
	}, [target])

	const handleKeydown = (e: ChangeEvent<HTMLInputElement>) => {
		const {target: {value: currentVal}} = e
		if (currentVal.length <= 5) setAttempt(currentVal);
	}

	const analyseAttempt = (attempt: string) => {    
		return( attempt.split('').map((char, index: number) => new Character(char, targetMap[char] >= 0 ? (targetMap[char] == index ? CharacterStatus.Correct : CharacterStatus.Close ) : CharacterStatus.Incorrect  )))
	}

	const loadStyle = (status: CharacterStatus) => {
		switch (status) {
			case CharacterStatus.Correct: 
				return 'bg-green-400 outline-green-100';
			case CharacterStatus.Incorrect: 
				return 'bg-red-500 outline-red-100';
			case CharacterStatus.Close: 
				return 'bg-orange-400 outline-orange-100';
			default: 
				return '';
		}
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.debug("submitted: ", attempt);
		
		console.debug()

		const updated = attempts;
		updated[attemptQty] = new Attempt(analyseAttempt(attempt))

		setAttempt("");
		setAttemptQty(attemptQty+1);
	}

	return (
		<div className="App">
			
			<ul className='grid grid-cols-5 gap-2 my-10'> 
			
			{ 
				attempts.map( attempt => {
					return attempt.letters.map( letter => {
						return <ol className={`p-2 bg-slate-700 rounded-lg outline outline-slate-500 outline-2  ${ loadStyle(letter.status) }`}>
							<pre> {letter.value ? letter.value : ''} </pre>
						</ol>
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
