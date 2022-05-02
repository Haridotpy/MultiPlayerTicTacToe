const App = () => {
	return (
		<>
			<header>
				<h1>Tic Tac Toe</h1>
			</header>
			<section>
				<div>
					<label htmlFor="">Name</label>
					<input type="text" placeholder="eg: ABC" />
					<button>Submit</button>
				</div>
				<div>
					<label htmlFor="">Join Room</label>
					<input type="text" placeholder="eg: " />
					<button>Join Room</button>
				</div>
				<div>
					<button>Create Room</button>
				</div>
			</section>
		</>
	);
};

export default App;
