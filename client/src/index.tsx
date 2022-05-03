import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App, Header, Room } from "./Components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const rootElement = document.querySelector<HTMLDivElement>("#App")!;

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<Header />
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/room/:roomId" element={<Room />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
