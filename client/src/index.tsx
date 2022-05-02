import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./Components/App";

const rootElement = document.querySelector<HTMLDivElement>("#App")!;

ReactDOM.createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>
);
