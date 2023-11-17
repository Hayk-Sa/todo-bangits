import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
	id: number;
	title: string;
	description?: string;
	deadline?: string;
	completed: boolean;
	overdue: boolean;
	removed: boolean;
}

interface TodoState {
	todos: Todo[];
	trash: Todo[];
}

const initialState: TodoState = {
	todos: [],
	trash: [],
};

const todoSlice = createSlice({
	name: "todo",
	initialState,
	reducers: {
		addTodo: (
			state,
			action: PayloadAction<Omit<Todo, "id">> & { completed?: boolean }
		) => {
			const {
				completed = false,
				overdue = false,
				removed = false,
				...rest
			} = action.payload;

			const newTodo: Todo = {
				id: state.todos.length + 1,
				completed,
				overdue,
				removed,
				...rest,
			};

			state.todos.push(newTodo);
		},
		editTodo: (state, action: PayloadAction<Partial<Todo>>) => {
			const { id, ...rest } = action.payload;

			const existingTodo = state.todos.find((todo) => todo.id === id);

			if (existingTodo) {
				const updatedTodo: Todo = {
					...existingTodo,
					...rest,
				};

				const index = state.todos.findIndex((todo) => todo.id === id);
				state.todos[index] = updatedTodo;
			}
		},
		toggleTodo: (state, action: PayloadAction<number>) => {
			const todo = state.todos.find((t) => t.id === action.payload);
			if (todo) {
				todo.completed = !todo.completed;
			}
		},
		removeTodo: (state, action: PayloadAction<number>) => {
			const removedTodo = state.todos.find(
				(todo) => todo.id === action.payload
			);
			if (removedTodo) {
				removedTodo.removed = true;
				state.trash.push(removedTodo);
				state.todos = state.todos.filter((todo) => todo.id !== action.payload);
			}
		},
		markAsComplete: (state, action: PayloadAction<number | number[]>) => {
			const completedIds = Array.isArray(action.payload)
				? action.payload
				: [action.payload];

			state.todos = state.todos.map((todo) => {
				const updatedTodo = {
					...todo,
					completed: completedIds.includes(todo.id) && !todo.overdue,
				};

				return updatedTodo;
			});
		},
	},
});

export const { addTodo, toggleTodo, removeTodo, editTodo, markAsComplete } =
	todoSlice.actions;
export default todoSlice.reducer;
