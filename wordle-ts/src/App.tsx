import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
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
	[key: string]: number[]
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
	const attemptInput = useRef<HTMLInputElement>(null);
	const restartButton = useRef<HTMLButtonElement>(null);

	const [maxTurns, setMaxTurns] = useState(5)
	const [wordLength, setWordLength] = useState(5)
	const [target, setTarget] = useState("")
	const [attempts, setAttempts] = useState<Attempt[]>([])
	const [attempt, setAttempt] = useState("");
	const [turn, setTurn] = useState(0);
	const [targetMap, setTargetMap] = useState<IWordMap>({});
	const [gameState, setGameState] = useState<GameState>(GameState['In Progress'])
	const [validWord, setValidWord] = useState<boolean>(true);
	console.debug(target)

	const isValidWord = async (word: string) => {
		const request = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=caa38334-61dd-4f3a-a581-27a2175781d9`)
		const json = await request.json()		
		return json["0"]["meta"] == undefined ? false : true;
	}

	const getRandomWord = async (wordLength: number) => {
		const request = await (await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`)).json()
		return request[0];
	}
 
	const handleKeydown = (e: ChangeEvent<HTMLInputElement>) => {
		const {target: {value: currentVal}} = e
		if (currentVal.length <= wordLength) setAttempt(currentVal);
		if (validWord == false) setValidWord(true);
	}

	const analyseAttempt = (attempt: string) => {    
		return( attempt.split('').map((char, index: number) => new Character(char, targetMap[char] == undefined ? CharacterStatus.Incorrect : (targetMap[char].some(num => num==index) == true ? CharacterStatus.Correct : CharacterStatus.Close ) )))
	}

	const loadStyle = (status: CharacterStatus) => {
		switch (status) {
			case CharacterStatus.Correct: 
				return 'bg-green-500 outline-green-100 text-green-100';
			case CharacterStatus.Incorrect: 
				return 'bg-red-500 outline-red-100 text-red-100';
			case CharacterStatus.Close: 
				return 'bg-orange-500 outline-orange-100 text-orange-100';
			default: 
				return 'bg-slate-700 outline-slate-500';
		}
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if ( await isValidWord(attempt) == false) {
			setValidWord(false)
			return;
		}

		if (attempt.toLocaleLowerCase() == target.toLocaleLowerCase()) {
			setGameState(GameState.Victory);
			restartButton.current?.focus();
		}
		else if (turn+1 == maxTurns) setGameState(GameState.Defeat);

		const updated = attempts;
		updated[turn] = new Attempt(analyseAttempt(attempt))

		setAttempt("");
		setTurn(turn+1);
		setValidWord(true);
	}

	const resetGame = async () => {
		setTurn(0);
		setTarget(await getRandomWord(wordLength))
		setGameState(GameState['In Progress'])
		attemptInput.current?.focus();
	}

	useEffect(()=> {
		const output: IWordMap = {};
		target.split('').forEach((char: string, index: number) => output[char] = output[char] == undefined ? [index] : [...output[char], index]);
		setTargetMap({...output})
		setAttempts([...new Array(maxTurns).fill(new Attempt(new Array(wordLength).fill(new Character('', CharacterStatus.None))))])
		attemptInput.current?.focus();
	}, [target])

	useEffect( () => {
		const newAttempts = new Array(maxTurns).fill(new Attempt(new Array(wordLength).fill(new Character('', CharacterStatus.None))))
		for (let attempt in attempts) if (attempts[attempt]) newAttempts[attempt] = attempts[attempt];
		setAttempts([...newAttempts].slice(0, maxTurns))
	}, [maxTurns])

	useEffect( () => {
		const setWordInitial = async () => {
			let word = await getRandomWord(wordLength);
			let legitWord = await isValidWord(word);

			while (!legitWord) {
				word = await getRandomWord(wordLength);
				legitWord = await isValidWord(word);
			}
			
			setTarget(word);
		}

		setWordInitial()
		new Array(maxTurns).fill(new Attempt(new Array(wordLength).fill(new Character('', CharacterStatus.None))))
	}, [wordLength])

	useEffect( () => {
		const setWordInitial = async () => {
			let word = await getRandomWord(wordLength);
			let legitWord = await isValidWord(word);

			while (!legitWord) {
				word = await getRandomWord(wordLength);
				legitWord = await isValidWord(word);
			}
			
			setTarget(word);
		}

		setWordInitial()
		new Array(maxTurns).fill(new Attempt(new Array(wordLength).fill(new Character('', CharacterStatus.None))))
	}, [])

	return (
		<div className="App">
			
			<form>
				<label htmlFor="turns">Turns: </label>
				<input type="number" name="turns" id="turns" value={maxTurns} onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxTurns(parseInt(e.target.value))} className={`mx-2 rounded-lg p-1 outline outline-1 w-12 ${ !maxTurns ? 'outline-red-400' : '' }`}/>

				<label htmlFor="wordlength">Word Length: </label>
				<input type="number" name="wordlength" id="wordlength" value={wordLength} onChange={(e: ChangeEvent<HTMLInputElement>) => {setWordLength( parseInt(e.target.value)); resetGame();}} className={`mx-2 rounded-lg p-1 outline outline-1 w-12 ${ !wordLength ? 'outline-red-400' : '' }`}/>

			</form>

			{ target ? <ul className={`grid gap-2 my-10 w-auto`} style={{gridTemplateColumns: `repeat(${wordLength}, 1fr)`}}> 
			{ 
				attempts.map( attempt => {
					return attempt.letters.map( letter => {
						return <ol key={crypto.randomUUID()} className={`p-2 rounded-lg outline outline-2 ${ loadStyle(letter.status) }`}>
							<pre> {letter.value ? letter.value : ''} </pre>
						</ol>
					})
				})
			}
			</ul> : <h3 className=' text-center mx-auto m-36'> loading... </h3>}

			{ gameState == GameState['In Progress'] ?  
			<>
			<form className='mb-10' onSubmit={(e)=> attempt.length == wordLength ? handleSubmit(e) : e.preventDefault()}>
				<label htmlFor="attempt" className=''>Attempt:</label>
				
				<input 
					className={`mx-2 rounded-lg p-1 outline outline-1 ${ attempt.length < wordLength || validWord == false ? 'outline-red-400' : 'outline-green-400' }`}
					type="text" 
					id="attempt" 
					onChange={handleKeydown} 
					value={attempt} 
					ref={attemptInput} />
			</form>

			{!validWord && <h3 className='my-5 text-red-400'> That's not a real word! </h3>}
			</>
			:
			<>
				<h1>{gameState == GameState.Victory ? 'You won!' : 'Better luck next time!'}</h1>
				{gameState == GameState.Defeat && <h2> The correct answer was: {target} </h2>}
			</>
			}

			{ gameState != GameState['In Progress'] && <form onSubmit={e=> {e.preventDefault(); resetGame}}> <button onClick={resetGame} tabIndex={0} className={'m-10'} ref={restartButton}> Play again </button> </form>}
		</div>
  	)
}

export default App;