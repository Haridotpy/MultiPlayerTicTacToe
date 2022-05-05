import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App, Header, Room } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./Context/GameProvider";
import "./styles/index.css";

const rootElement = document.querySelector<HTMLDivElement>("#App")!;

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<Header />
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route
					path="/room/:roomId"
					element={
						<GameProvider>
							<Room />
						</GameProvider>
					}
				/>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
