import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Door {
	id: number;
	isOpen: boolean;
	content: string;
}

interface Stats {
	switchWins: number;
	stayWins: number;
	totalGames: number;
}

type GameState = "choosing" | "deciding" | "finished";

const MontyHallGame = () => {
	const [gameState, setGameState] = useState<GameState>("choosing");
	const [doors, setDoors] = useState<Door[]>([]);
	const [prizeDoor, setPrizeDoor] = useState<number | null>(null);
	const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
	const [openedDoor, setOpenedDoor] = useState<number | null>(null);
	const [finalChoice, setFinalChoice] = useState<number | null>(null);
	const [hasWon, setHasWon] = useState<boolean>(false);
	const [switched, setSwitched] = useState<boolean>(false);
	const [stats, setStats] = useState<Stats>({ switchWins: 0, stayWins: 0, totalGames: 0 });
	const [showConfetti, setShowConfetti] = useState<boolean>(false);

	// Inicializar jogo
	const initializeGame = () => {
		const newPrizeDoor = Math.floor(Math.random() * 3);
		const newDoors: Door[] = [
			{
				id: 0,
				isOpen: false,
				content: newPrizeDoor === 0 ? "../public/premio.png" : "../public/goat.png",
			},
			{
				id: 1,
				isOpen: false,
				content: newPrizeDoor === 1 ? "../public/premio.png" : "../public/goat.png",
			},
			{
				id: 2,
				isOpen: false,
				content: newPrizeDoor === 2 ? "../public/premio.png" : "../public/goat.png",
			},
		];

		setDoors(newDoors);
		setPrizeDoor(newPrizeDoor);
		setSelectedDoor(null);
		setOpenedDoor(null);
		setFinalChoice(null);
		setHasWon(false);
		setSwitched(false);
		setGameState("choosing");
		setShowConfetti(false);
	};

	// Primeira escolha do usuário
	const selectDoor = (doorId: number) => {
		if (gameState !== "choosing") return;

		setSelectedDoor(doorId);

		// Encontrar uma porta para abrir (que não seja a premiada nem a selecionada)
		let doorToOpen: number;
		do {
			doorToOpen = Math.floor(Math.random() * 3);
		} while (doorToOpen === doorId || doorToOpen === prizeDoor);

		// Abrir a porta após um pequeno delay
		setTimeout(() => {
			setOpenedDoor(doorToOpen);
			const newDoors = [...doors];
			newDoors[doorToOpen].isOpen = true;
			setDoors(newDoors);
			setGameState("deciding");
		}, 1000);
	};

	// Decisão final (trocar ou manter)
	const makeDecision = (shouldSwitch: boolean) => {
		let finalDoor: number;

		if (shouldSwitch) {
			// Encontrar a porta que não é a selecionada nem a aberta
			finalDoor = [0, 1, 2].find((door) => door !== selectedDoor && door !== openedDoor)!;
			setSwitched(true);
		} else {
			finalDoor = selectedDoor!;
			setSwitched(false);
		}

		setFinalChoice(finalDoor);

		// Abrir todas as portas
		setTimeout(() => {
			const newDoors = doors.map((door) => ({ ...door, isOpen: true }));
			setDoors(newDoors);

			const won = finalDoor === prizeDoor;
			setHasWon(won);
			setGameState("finished");

			if (won) {
				setShowConfetti(true);
				setTimeout(() => setShowConfetti(false), 3000);
			}

			// Atualizar estatísticas
			setStats((prev) => ({
				switchWins: prev.switchWins + (won && shouldSwitch ? 1 : 0),
				stayWins: prev.stayWins + (won && !shouldSwitch ? 1 : 0),
				totalGames: prev.totalGames + 1,
			}));
		}, 1000);
	};

	useEffect(() => {
		initializeGame();
	}, []);

	const navigate = useNavigate();

	const getExplanation = () => {
		if (switched) {
			return hasWon
				? "🎉 Parabéns! Você trocou e ganhou! Estatisticamente, trocar dá 66,7% de chance de vitória, enquanto manter dá apenas 33,3%."
				: "😔 Você trocou mas não ganhou desta vez. Mesmo assim, trocar é a estratégia mais inteligente - você tem 2x mais chances de ganhar!";
		} else {
			return hasWon
				? "🎉 Parabéns! Você manteve sua escolha e ganhou! Você teve sorte - manter a escolha original tem apenas 33,3% de chance de vitória."
				: "😔 Você manteve sua escolha e não ganhou. Lembre-se: trocar de porta aumenta suas chances para 66,7%!";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
			<div className="max-w-4xl mx-auto">
				<button
					onClick={() => navigate("/about")}
					className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all"
				>
					📚 Sobre
				</button>
				<h1 className="text-4xl font-bold text-white text-center mb-8">
					🎪 Problema de Monty Hall 🎪
				</h1>

				{/* Instruções */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					{gameState === "choosing" && (
						<p className="text-center text-lg">
							Escolha uma porta! Atrás de uma delas há um prêmio 🏆, atrás das outras duas há cabras
							🐐
						</p>
					)}
					{gameState === "deciding" && (
						<p className="text-center text-lg">
							Eu abri uma porta com uma cabra. Agora você pode <strong>trocar</strong> sua escolha
							ou <strong>manter</strong> a porta original. O que você decide?
						</p>
					)}
					{gameState === "finished" && (
						<div className="text-center">
							<p className="text-xl mb-4">{getExplanation()}</p>
						</div>
					)}
				</div>

				{/* Portas */}
				<div className="flex justify-center gap-8 mb-8">
             <img id="apresentador" src="../public/GabrielApresentador.png" alt="" />
					{doors.map((door) => (
						<div key={door.id} className="text-center">
							<div
								className={`
                  w-32 h-48 border-4 rounded-lg cursor-pointer transition-all duration-500 transform
                  ${
										selectedDoor === door.id
											? "border-yellow-400 bg-yellow-100"
											: "border-white bg-gray-100"
									}
                  ${finalChoice === door.id ? "border-green-400 bg-green-100" : ""}
                  ${door.isOpen ? "scale-95 opacity-90" : "hover:scale-105"}
                  ${gameState === "choosing" ? "hover:border-yellow-300" : ""}
                `}
								onClick={() => selectDoor(door.id)}
								style={{
									transformStyle: "preserve-3d",
									transform: door.isOpen ? "rotateY(180deg)" : "rotateY(0deg)",
								}}
							>
								<div className="w-full h-full flex items-center justify-center text-6xl font-bold">
									{door.isOpen ? <img alt="door contet" src={door.content}></img> : door.id + 1}
								</div>
							</div>
							<p className="mt-2 text-white font-semibold">Porta {door.id + 1}</p>
							{selectedDoor === door.id && gameState !== "finished" && (
								<p className="text-yellow-300 text-sm">Sua escolha</p>
							)}
							{finalChoice === door.id && gameState === "finished" && (
								<p className="text-green-300 text-sm">Escolha final</p>
							)}
						</div>
					))}
				</div>

				{/* Botões de decisão */}
				{gameState === "deciding" && (
					<div className="flex justify-center gap-4 mb-8">
						<button
							onClick={() => makeDecision(false)}
							className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
						>
							Manter Escolha
						</button>
						<button
							onClick={() => makeDecision(true)}
							className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
						>
							Trocar de Porta
						</button>
					</div>
				)}

				{/* Botão para jogar novamente */}
				{gameState === "finished" && (
					<div className="text-center mb-8">
						<button
							onClick={initializeGame}
							className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
						>
							Jogar Novamente
						</button>
					</div>
				)}

				{/* Estatísticas */}
				{stats.totalGames > 0 && (
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
						<h2 className="text-2xl font-bold text-center mb-4">📊 Suas Estatísticas</h2>
						<div className="grid grid-cols-3 gap-4 text-center">
							<div>
								<p className="text-3xl font-bold text-green-400">{stats.switchWins}</p>
								<p className="text-sm">Vitórias Trocando</p>
							</div>
							<div>
								<p className="text-3xl font-bold text-blue-400">{stats.stayWins}</p>
								<p className="text-sm">Vitórias Mantendo</p>
							</div>
							<div>
								<p className="text-3xl font-bold text-white">{stats.totalGames}</p>
								<p className="text-sm">Total de Jogos</p>
							</div>
						</div>
						<div className="mt-4 text-center text-sm">
							<p>
								Taxa de sucesso trocando:{" "}
								{stats.totalGames > 0 ? Math.round((stats.switchWins / stats.totalGames) * 100) : 0}
								%
							</p>
							<p>
								Taxa de sucesso mantendo:{" "}
								{stats.totalGames > 0 ? Math.round((stats.stayWins / stats.totalGames) * 100) : 0}%
							</p>
						</div>
					</div>
				)}

				{/* Efeito de confetti para vitória */}
				{showConfetti && (
					<div className="fixed inset-0 pointer-events-none">
						{[...Array(50)].map((_, i) => (
							<div
								key={i}
								className="absolute animate-bounce"
								style={{
									left: `${Math.random() * 100}%`,
									top: `${Math.random() * 100}%`,
									animationDelay: `${Math.random() * 2}s`,
									animationDuration: `${1 + Math.random() * 2}s`,
								}}
							>
								🎉
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MontyHallGame;
