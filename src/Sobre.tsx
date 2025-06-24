import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function MontyHallAbout() {
    const navigate = useNavigate();
	const [simulationRunning, setSimulationRunning] = useState(false);
	const [simulationResults, setSimulationResults] = useState({
		switchWins: 0,
		stayWins: 0,
		totalGames: 0,
		currentGame: 0,
	});
	const [selectedGames, setSelectedGames] = useState(1000);

	const runSimulation = async (totalGames: number) => {
		setSimulationRunning(true);
		setSimulationResults({ switchWins: 0, stayWins: 0, totalGames: 0, currentGame: 0 });

		let switchWins = 0;
		let stayWins = 0;

		for (let i = 0; i < totalGames; i++) {
			// Simular um jogo
			const prizeDoor = Math.floor(Math.random() * 3);
			const playerChoice = Math.floor(Math.random() * 3);

			// Estratégia de trocar sempre ganha se a escolha inicial estava errada
			if (playerChoice !== prizeDoor) {
				switchWins++;
			} else {
				stayWins++;
			}

			// Atualizar resultados a cada 50 jogos para performance
			if (i % 50 === 0 || i === totalGames - 1) {
				setSimulationResults({
					switchWins,
					stayWins,
					totalGames: i + 1,
					currentGame: i + 1,
				});

				// Pequeno delay para animação
				await new Promise((resolve) => setTimeout(resolve, 20));
			}
		}

		setSimulationRunning(false);
	};

	const chartData = [
		{
			name: "Trocar",
			value:
				simulationResults.totalGames > 0
					? Math.round((simulationResults.switchWins / simulationResults.totalGames) * 100)
					: 0,
			count: simulationResults.switchWins,
			color: "#10B981",
		},
		{
			name: "Manter",
			value:
				simulationResults.totalGames > 0
					? Math.round((simulationResults.stayWins / simulationResults.totalGames) * 100)
					: 0,
			count: simulationResults.stayWins,
			color: "#3B82F6",
		},
	];



	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
			<div className="max-w-4xl mx-auto">
				<button		
                    onClick={() => navigate("/")}		
					className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all flex items-center gap-2"
				>
					← Voltar ao Jogo
				</button>
                <br />
                <br />

				<h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
					📚 Entendendo o Problema de Monty Hall 🎪
				</h1>

				{/* Descrição do Problema */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					<h2 className="text-2xl font-bold mb-4 text-center">🎯 O Que É o Problema?</h2>
					<p className="text-lg leading-relaxed mb-4">
						O Problema de Monty Hall é um famoso paradoxo de probabilidade baseado no programa de TV
						americano "Let's Make a Deal", apresentado por Monty Hall. Aqui está como funciona:
					</p>
					<div className="bg-white/10 rounded-lg p-4 mb-4">
						<p className="mb-2">
							🚪 <strong>Situação:</strong> Você está diante de 3 portas fechadas
						</p>
						<p className="mb-2">
							🏆 <strong>Prêmio:</strong> Atrás de uma porta há um prêmio valioso
						</p>
						<p className="mb-2">
							🐐 <strong>Pegadinha:</strong> Atrás das outras duas há cabras
						</p>
						<p className="mb-2">
							🎯 <strong>Sua escolha:</strong> Você escolhe uma porta
						</p>
						<p className="mb-2">
							🔓 <strong>Revelação:</strong> Monty abre uma das portas restantes (sempre com cabra)
						</p>
						<p>
							🤔 <strong>Decisão:</strong> Você pode trocar sua escolha ou manter a original
						</p>
					</div>
					<p className="text-lg text-center font-semibold text-yellow-300">
						A pergunta é: Você deve trocar de porta? 🤷‍♂️
					</p>
				</div>

				{/* Explicação Intuitiva */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					<h2 className="text-2xl font-bold mb-4 text-center">💡 Explicação Intuitiva</h2>
					<p className="text-lg leading-relaxed mb-4">
						À primeira vista, pode parecer que tanto faz trocar ou manter - afinal, restam 2 portas,
						então seria 50% para cada uma, certo? <strong>ERRADO!</strong> 🚫
					</p>
					<div className="grid md:grid-cols-2 gap-6">
						<div className="bg-blue-600/20 rounded-lg p-4">
							<h3 className="text-xl font-bold mb-2">🔒 Mantendo a Escolha Original</h3>
							<p className="mb-2">
								Probabilidade de ganhar: <span className="text-red-400 font-bold">33.33%</span>
							</p>
							<p className="text-sm">
								Sua porta inicial tinha 1/3 de chance de ter o prêmio. Essa probabilidade não muda
								quando Monty abre outra porta!
							</p>
						</div>
						<div className="bg-green-600/20 rounded-lg p-4">
							<h3 className="text-xl font-bold mb-2">🔄 Trocando de Porta</h3>
							<p className="mb-2">
								Probabilidade de ganhar: <span className="text-green-400 font-bold">66.67%</span>
							</p>
							<p className="text-sm">
								As outras duas portas tinham 2/3 de chance. Quando uma é eliminada, toda essa
								probabilidade vai para a porta restante!
							</p>
						</div>
					</div>
				</div>

				{/* Explicação Matemática */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					<h2 className="text-2xl font-bold mb-4 text-center">🧮 Explicação Matemática</h2>
					<div className="space-y-4">
						<div className="bg-white/10 rounded-lg p-4">
							<h3 className="text-lg font-bold mb-2">📊 Probabilidades Iniciais</h3>
							<p>Quando você escolhe uma porta inicial:</p>
							<ul className="list-disc list-inside mt-2 space-y-1">
								<li>
									Probabilidade da sua porta ter o prêmio:{" "}
									<span className="font-bold text-yellow-300">1/3 = 33.33%</span>
								</li>
								<li>
									Probabilidade das outras duas portas terem o prêmio:{" "}
									<span className="font-bold text-yellow-300">2/3 = 66.67%</span>
								</li>
							</ul>
						</div>

						<div className="bg-white/10 rounded-lg p-4">
							<h3 className="text-lg font-bold mb-2">
								🔍 O Que Acontece Quando Monty Abre Uma Porta
							</h3>
							<p>Monty sempre abre uma porta com cabra que você NÃO escolheu. Isso significa:</p>
							<ul className="list-disc list-inside mt-2 space-y-1">
								<li>
									A probabilidade da sua porta continua{" "}
									<span className="font-bold text-red-300">1/3</span>
								</li>
								<li>
									A probabilidade das outras duas portas continua{" "}
									<span className="font-bold text-green-300">2/3</span>
								</li>
								<li>
									Como uma porta é eliminada, toda a probabilidade{" "}
									<span className="font-bold text-green-300">2/3</span> se concentra na porta
									restante!
								</li>
							</ul>
						</div>

						<div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4">
							<h3 className="text-lg font-bold mb-2">✨ Conclusão Matemática</h3>
							<p className="text-center text-xl">
								Trocar de porta <span className="font-bold text-green-300">DOBRA</span> suas chances
								de ganhar!
							</p>
						</div>
					</div>
				</div>

				{/* Exemplo das 100 Portas */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					<h2 className="text-2xl font-bold mb-4 text-center">🚪 Exemplo das 100 Portas</h2>
					<p className="text-lg leading-relaxed mb-4">
						Para tornar o conceito mais claro, imagine que em vez de 3 portas, temos{" "}
						<strong>100 portas</strong>! 🤯
					</p>

					<div className="bg-white/10 rounded-lg p-4 mb-4">
						<h3 className="text-lg font-bold mb-2">🎯 Cenário:</h3>
						<p className="mb-2">• Você escolhe a porta número 1</p>
						<p className="mb-2">
							• Sua chance de acertar: <span className="text-red-400 font-bold">1/100 = 1%</span>
						</p>
						<p className="mb-2">
							• Chance do prêmio estar nas outras 99 portas:{" "}
							<span className="text-green-400 font-bold">99/100 = 99%</span>
						</p>
					</div>

					<div className="bg-white/10 rounded-lg p-4 mb-4">
						<h3 className="text-lg font-bold mb-2">🔓 Monty age:</h3>
						<p className="mb-2">• Monty abre 98 portas com cabras (das 99 que você não escolheu)</p>
						<p className="mb-2">• Sobra apenas 1 porta fechada além da sua</p>
						<p>• Onde você acha que está o prêmio? 🤔</p>
					</div>

					<div className="bg-gradient-to-r from-green-600/30 to-green-800/30 rounded-lg p-4">
						<h3 className="text-lg font-bold mb-2">💡 Fica Óbvio!</h3>
						<p className="text-center text-lg">
							A porta que você escolheu ainda tem{" "}
							<span className="font-bold text-red-300">1% de chance</span>, mas a porta restante tem{" "}
							<span className="font-bold text-green-300">99% de chance</span>!
						</p>
						<p className="text-center text-sm mt-2 text-gray-300">
							É quase certeza que você deve trocar! O mesmo princípio se aplica às 3 portas.
						</p>
					</div>
				</div>

				{/* Simulação Interativa */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 text-white">
					<h2 className="text-2xl font-bold mb-6 text-center">🎮 Simulação Interativa</h2>

					<div className="mb-6">
						<h3 className="text-lg font-bold mb-4 text-center">Quantos jogos você quer simular?</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{[100, 1000, 5000, 10000].map((num) => (
								<button
									key={num}
									onClick={() => setSelectedGames(num)}
									className={`py-2 px-4 rounded-lg font-bold transition-all ${
										selectedGames === num
											? "bg-yellow-600 text-white"
											: "bg-white/20 text-white hover:bg-white/30"
									}`}
								>
									{num.toLocaleString()}
								</button>
							))}
						</div>
					</div>

					<div className="text-center mb-6">
						<button
							onClick={() => runSimulation(selectedGames)}
							disabled={simulationRunning}
							className={`px-8 py-3 font-bold rounded-lg transition-all ${
								simulationRunning
									? "bg-gray-600 cursor-not-allowed"
									: "bg-purple-600 hover:bg-purple-700 transform hover:scale-105"
							} text-white`}
						>
							{simulationRunning ? "🔄 Simulando..." : "🚀 Executar Simulação"}
						</button>
					</div>

					{simulationResults.totalGames > 0 && (
						<div className="space-y-6">
							{/* Contador em tempo real */}
							<div className="bg-white/10 rounded-lg p-4">
								<div className="text-center mb-4">
									<p className="text-lg">
										Progresso:{" "}
										<span className="font-bold text-yellow-300">
											{simulationResults.currentGame.toLocaleString()} /{" "}
											{selectedGames.toLocaleString()}
										</span>
									</p>
									{simulationRunning && (
										<div className="w-full bg-gray-700 rounded-full h-2 mt-2">
											<div
												className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
												style={{
													width: `${(simulationResults.currentGame / selectedGames) * 100}%`,
												}}
											/>
										</div>
									)}
								</div>

								<div className="grid grid-cols-2 gap-4 text-center">
									<div className="bg-green-600/20 rounded-lg p-3">
										<p className="text-2xl font-bold text-green-400">
											{simulationResults.switchWins.toLocaleString()}
										</p>
										<p className="text-sm">Vitórias Trocando</p>
										<p className="text-lg font-bold">
											{simulationResults.totalGames > 0
												? Math.round(
														(simulationResults.switchWins / simulationResults.totalGames) * 100
												  )
												: 0}
											%
										</p>
									</div>
									<div className="bg-blue-600/20 rounded-lg p-3">
										<p className="text-2xl font-bold text-blue-400">
											{simulationResults.stayWins.toLocaleString()}
										</p>
										<p className="text-sm">Vitórias Mantendo</p>
										<p className="text-lg font-bold">
											{simulationResults.totalGames > 0
												? Math.round(
														(simulationResults.stayWins / simulationResults.totalGames) * 100
												  )
												: 0}
											%
										</p>
									</div>
								</div>
							</div>

							{/* Gráfico */}
							<div className="bg-white/10 rounded-lg p-4">
								<h3 className="text-lg font-bold mb-4 text-center">📊 Resultados Visuais</h3>
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={chartData}>
											<XAxis dataKey="name" />
											<YAxis />
											<Bar dataKey="value" radius={[4, 4, 0, 0]}>
												{chartData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Bar>
										</BarChart>
									</ResponsiveContainer>
								</div>
								<p className="text-center text-sm mt-2 text-gray-300">
									Porcentagem de vitórias por estratégia
								</p>
							</div>

							{!simulationRunning && simulationResults.totalGames > 0 && (
								<div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 text-center">
									<h3 className="text-lg font-bold mb-2">🎯 Conclusão da Simulação</h3>
									<p className="text-lg">
										Com {simulationResults.totalGames.toLocaleString()} jogos simulados, trocar de
										porta venceu aproximadamente{" "}
										<span className="font-bold text-green-300">
											{Math.round(
												(simulationResults.switchWins / simulationResults.totalGames) * 100
											)}
											%
										</span>{" "}
										das vezes!
									</p>
									<p className="text-sm mt-2 text-gray-300">
										Quanto mais jogos você simular, mais próximo de 66.67% o resultado ficará! 📈
									</p>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Conclusão */}
				<div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-6 text-white text-center">
					<h2 className="text-2xl font-bold mb-4">🎉 Resumo Final</h2>
					<p className="text-lg mb-4">
						O Problema de Monty Hall nos ensina que nossa intuição nem sempre está certa quando se
						trata de probabilidade!
					</p>
					<div className="text-xl font-bold">
						<p className="mb-2">
							🔄 <span className="text-green-400">SEMPRE TROQUE</span> - 66.67% de chance
						</p>
						<p>
							🔒 <span className="text-red-400">Manter a escolha</span> - 33.33% de chance
						</p>
					</div>
					<p className="text-sm mt-4 text-gray-300">
						Agora volte ao jogo e teste esse conhecimento na prática! 🎮
					</p>
				</div>
			</div>
		</div>
	);
}
