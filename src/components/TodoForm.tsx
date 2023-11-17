import React from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addTodo, editTodo } from "./todoSlice";
import { Todo } from "./todoSlice";
import { useFormik } from "formik";
import { Form, Input, Button } from "antd";

interface TodoFormProps {
	todo?: Todo;
}

const validationSchema = Yup.object({
	title: Yup.string().required("Title is required"),
	description: Yup.string(),
	deadline: Yup.date(),
});

const TodoForm: React.FC<TodoFormProps> = ({ todo }) => {
	const dispatch = useDispatch();

	const handleSubmit = (values: Partial<Todo>) => {
		if (todo) {
			dispatch(editTodo({ id: todo.id, ...values }));
		} else {
			dispatch(addTodo(values as Omit<Todo, "id">));
		}
	};

	const FormItem = Form.Item;

	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
			deadline: "",
		},
		validationSchema,
		onSubmit: handleSubmit,
	});

	return (
		<Form onFinish={formik.handleSubmit}>
			<FormItem
				help={
					formik.touched.title && formik.errors.title ? formik.errors.title : ""
				}
				validateStatus={
					formik.touched.title && formik.errors.title ? "error" : undefined
				}
			>
				<Input
					name="title"
					placeholder="Title"
					value={formik.values.title}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				/>
			</FormItem>

			<FormItem>
				<Input
					name="description"
					placeholder="Description"
					value={formik.values.description}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				/>
			</FormItem>

			<FormItem>
				<Input
					type="date"
					name="deadline"
					placeholder="DeadLine"
					value={formik.values.deadline}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
				/>
			</FormItem>

			<FormItem>
				<Button type="primary" key="submit" htmlType="submit">
					Add Todo
				</Button>
			</FormItem>
			<FormItem>
				<Button
					type="primary"
					key="reset"
					htmlType="reset"
					onClick={() => formik.resetForm()}
				>
					Clear
				</Button>
			</FormItem>
		</Form>
	);
};

export default TodoForm;
