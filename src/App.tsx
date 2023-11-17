import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TrashList from "./components/TrashList";
function App() {
	return (
		<div className="App">
			<h1 style={{ textAlign: "center", color: "#08c" }}>Todo App</h1>
			<TodoForm />
			<TodoList />
			<TrashList />
		</div>
	);
}

export default App;
