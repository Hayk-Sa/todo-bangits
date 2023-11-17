import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { removeTodo, editTodo, markAsComplete } from "./todoSlice";
import {
	Form,
	Input,
	Button,
	InputNumber,
	Popconfirm,
	Table,
	Typography,
	Badge,
} from "antd";

interface Item {
	id: number;
	key: string;
	title: string;
	description: string;
	deadline: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: any;
	inputType: "number" | "text";
	record: Item;
	index: number;
	children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const TodoList: React.FC = () => {
	const todos = useSelector(
		(state: RootState) => state.todo.todos
	) as unknown as Item[];

	const [form] = Form.useForm();
	const [editingId, setEditingId] = useState<null | number>(null);

	const dispatch = useDispatch();

	const handleDelete = (id: number) => {
		dispatch(removeTodo(id));
	};
	const isEditing = (record: Item) => record.id === editingId;

	const edit = (record: Partial<Item> & { key: React.Key }) => {
		form.setFieldsValue({
			title: "",
			description: "",
			deadline: "",
			...record,
		});
		setEditingId(record.id ?? null);
	};

	const cancel = () => {
		setEditingId(null);
	};

	const save = async (id: Item["id"]) => {
		try {
			const row = (await form.validateFields()) as Omit<Item, "id">;

			dispatch(editTodo({ id, ...row }));
			setEditingId(null);
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const onSelectChange = (id: any) => {
		dispatch(markAsComplete(id));
	};

	const rowSelection = {
		onChange: onSelectChange,
	};

	const columns = [
		{
			title: "Title",
			dataIndex: "title",
			width: "15%",
			editable: true,
		},
		{
			title: "Description",
			dataIndex: "description",
			width: "25%",
			editable: true,
		},
		{
			title: "Deadline",
			dataIndex: "deadline",
			width: "15%",
			editable: true,
		},
		{
			title: "Status",
			dataIndex: "status",
			width: "15%",
			key: "state",
			render: (_: any, record: any) => {
				let status: "success" | "error" | "default" | undefined = "default";
				let statusText = "Pending";

				const currentDate = new Date();
				const deadlineDate = record.deadline ? new Date(record.deadline) : null;

				if (record.completed) {
					status = "success";
					statusText = "Completed";
				} else if (deadlineDate && deadlineDate < currentDate) {
					status = "error";
					statusText = "Overdue";
				}

				return <Badge status={status} text={statusText} />;
			},
		},
		{
			title: "Operation",
			dataIndex: "operation",
			width: "15%",
			render: (_: any, record: Item) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.id)}
							style={{ marginRight: 8 }}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<Button type="primary" size="small">
								Cancel
							</Button>
						</Popconfirm>
					</span>
				) : (
					<Typography.Link
						disabled={editingId !== null}
						onClick={() => edit(record)}
					>
						<Button type="primary" size="small">
							Edit
						</Button>
					</Typography.Link>
				);
			},
		},
		{
			title: "Delete",
			width: "15%",
			dataIndex: "delete",
			key: "x",
			render: (_: any, { id }: any) => (
				<Button type="primary" size="small" onClick={() => handleDelete(id)}>
					Delete
				</Button>
			),
		},
	];

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: Item) => ({
				record,
				inputType: col.dataIndex === "age" ? "number" : "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});

	return (
		<Form form={form} component={false}>
			<Table
				rowSelection={rowSelection}
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				bordered
				dataSource={todos}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={{
					onChange: cancel,
				}}
			/>
		</Form>
	);
};

export default TodoList;
