import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Todo } from "./todoSlice";
import { DeleteTwoTone } from "@ant-design/icons";

const TrashList: React.FC = () => {
	const trash = useSelector((state: RootState) => state.todo.trash);

	return (
		<div>
			<DeleteTwoTone style={{ fontSize: "32px", paddingTop: "20px" }} />
			<div style={{ paddingTop: "20px", color: "#08c" }}>
				{trash.map((todo: Todo) => (
					<div key={todo.id}>
						<span>
							{todo.title} {todo.description} {todo.deadline}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default TrashList;
