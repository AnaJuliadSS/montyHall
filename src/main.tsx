import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MontyHallGame from "./App.tsx";
import MontyHallAbout from "./Sobre.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MontyHallGame />}></Route>
				<Route path="/about" element={<MontyHallAbout />}></Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
