interface Props {
	mark: string;
}

const Cell = ({ mark }: Props) => {
	return <div className={`cell ${mark}`}></div>;
};

export default Cell;
