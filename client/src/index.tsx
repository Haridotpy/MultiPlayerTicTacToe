import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const rootElement = document.querySelector<HTMLDivElement>("#App")!;

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/room/:roomId" element={<h1>Welcome to the room</h1>} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
