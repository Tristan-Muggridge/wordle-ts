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

enum GameState {
	"In Progress" = "In Progress",
	Victory = "Victory",
	Defeat = "Defeat"
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

	const maxTurns = 5;
	const wordLength = 5;

	const [target, setTarget] = useState("words")
	const [attempts, setAttempts] = useState<Attempt[]>(new Array(wordLength).fill(new Attempt(new Array(wordLength).fill(new Character('', CharacterStatus.None)))))
	const [attempt, setAttempt] = useState("");
	const [attemptQty, setAttemptQty] = useState(0);
	const attemptInput = useRef<HTMLInputElement>(null);
	const [targetMap, setTargetMap] = useState<IWordMap>({});
	const [gameState, setGameState] = useState<GameState>(GameState['In Progress'])

	useEffect(()=> {
		const output: { [key: string]: number } = {};
		target.split('').forEach((char: string, index: number) => output[char] = index);
		setTargetMap({...output})
	}, [target])

 
	const handleKeydown = (e: ChangeEvent<HTMLInputElement>) => {
		const {target: {value: currentVal}} = e
		if (currentVal.length <= wordLength) setAttempt(currentVal);
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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		

		if (attempt.toLocaleLowerCase() == target.toLocaleLowerCase()) setGameState(GameState.Victory)
		else if (attemptQty+1 == maxTurns) setGameState(GameState.Defeat);

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
						return <ol key={crypto.randomUUID()} className={`p-2 bg-slate-700 rounded-lg outline outline-slate-500 outline-2  ${ loadStyle(letter.status) }`}>
							<pre> {letter.value ? letter.value : ''} </pre>
						</ol>
					})
				})
			}
			</ul>

			{ gameState == GameState['In Progress'] ?  
			<>
			<form className='' onSubmit={(e)=> attempt.length == wordLength ? handleSubmit(e) : e.preventDefault()}>
				<label htmlFor="attempt" className=''>Attempt:</label>
				
				<input 
					className={`mx-2 rounded-lg p-1 outline outline-1 ${ attempt.length < wordLength ? 'outline-red-400' : 'outline-green-400' }`}
					type="text" 
					id="attempt" 
					onChange={handleKeydown} 
					value={attempt} 
					ref={attemptInput} />
			</form>
			</>
			:
			<>
				<h1>{gameState == GameState.Victory ? 'You won!' : 'Better luck next time!'}</h1>
				{gameState == GameState.Defeat && <h2> The correct answer was: {target} </h2>}
			</>
			}
		</div>
  	)
}

export default App;
