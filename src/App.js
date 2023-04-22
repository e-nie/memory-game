import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import Board from './components/Board';

function App() {
    const emoji = ['🏃‍', '🕰️', '🐸', '🧡', '🦷', '🐥'];
    const [cards, setCards] = useState(new Array(12).fill(null).map(() => ({

            id: uuidv4(),
            image: null,
            isOpen: false,
        })))
    ;

    const [history, setHistory] = useState([]);
    const [block, setBlock] = useState(false);
    const [winner, setWinner] = useState(false);
    const [moves, setMoves] = useState([]);

    const setRandomPlace = () => {
        // const [newCards] = cards; //check later
        const newCards = cards.map(el => ({ ...el, image: null, isOpen: false }));

        for (let i = 0; i < emoji.length; i++) {
            for (let time = 1; time <= 2; time++) {
                let index = Math.trunc(Math.random() * newCards.length);
                do {
                    index = Math.trunc(Math.random() * newCards.length);
                }
                while (newCards[index].image !== null);
                newCards[index].image = emoji[i];
            }
        }

        setCards(newCards);
    };

    useEffect(() => {
        setRandomPlace();
    }, []);


    const openCard = (id, image) => {
        const isOpen = cards.find(el => el.id === id).isOpen;
        if (!block && !isOpen) {
            const newCards = cards.map(el => id === el.id ? { ...el, isOpen: true } : el);
            setCards(newCards);
            setHistory([...history, image]);
            setBlock(true);
        }
    };

    const checkMove = () => {
        if (history[history.length - 1] !== history[history.length - 2]) {
            const emoji1 = history[history.length - 1];
            const emoji2 = history[history.length - 2];
            const newCards = cards.map(el => el.image === emoji1 || el.image === emoji2
                ?
                { ...el, isOpen: false }
                : el);
            setCards(newCards);
        }
    };

    const checkWinner = () => {
        const win = cards.every(el => el.isOpen);
        if (win) {
            setMoves([...moves, history.length / 2]);
        }
        setWinner(win);

    };

    const restart = () => {
        setRandomPlace()
        setHistory([])
        setBlock(false)
        setWinner(false)
    };

    useEffect(() => {
        if (history.length % 2 === 0) {
            setTimeout(() => {
                checkMove();
                setBlock(false);
            }, 400);
        } else {
            setBlock(false);
        }
    }, [history]);

    useEffect(() => {
        if (history.length > 12) {
            checkWinner();
        }
    }, [history]);

    const moveHistory = () => {

    };


    const winHistory = () => {

    };
    return (
        <div className = 'App'>
            { history }
            <h1>Memory Game</h1>
            <Board
                cards = { cards }
                openCard = { openCard }
            />
            { winner && <><h3>Congratulation! You won in { history.length / 2 } moves!</h3>
                <button onClick={restart}>
                    Start Game
                </button>
            </> }


            <div>
                <div>
                    { moves.length > 0 &&
                        <h2>Moves: { moves.map((el, i) => i === moves.length - 1 ? el : el.toString() + ', ') }</h2> }
                </div>

            </div>
        </div>
    );
}

export default App;
