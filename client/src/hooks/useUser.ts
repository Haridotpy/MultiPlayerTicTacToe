import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface User {
	id: string;
	name: string;
}

const defaultUser = {
	id: "",
	name: "",
};

const getUser = (initial: User = defaultUser): User => {
	const u = localStorage.getItem("user");
	if (!u) return initial;
	return JSON.parse(u);
};

export const useUser = (): [User, Dispatch<SetStateAction<User>>] => {
	const [user, setUser] = useState<User>(() => getUser());

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	return [user, setUser];
};
