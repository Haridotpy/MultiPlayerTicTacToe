import { useEffect } from "react";

interface TimeoutFuncType {
	(): void;
}

export const useTimeout = (cb: TimeoutFuncType, timeout: number, dependency?: any[]) => {
	useEffect(() => {
		if (dependency) {
			for (let dep of dependency) {
				if (!dep) return;
			}
		}
		const time = setTimeout(cb, timeout);

		return () => {
			clearInterval(time);
		};
	}, dependency || []);
};
