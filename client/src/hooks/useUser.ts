import { useState, useEffect, Dispatch, SetStateAction } from "react";

const getUser = <T>(initial: T): T => {
	const u = localStorage.getItem("user");
	if (!u) return initial;
	return JSON.parse(u);
};

export const useUser = <T>(initial: T): [T, Dispatch<SetStateAction<T>>] => {
	const [user, setUser] = useState<T>(() => getUser<T>(initial));

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	return [user, setUser];
};
