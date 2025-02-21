"use client";
import DynamicForm from "../components/forms/MultiStepForm";
import { FormProvider } from "../context/FormContext";

export default function Home() {
	return (
		<div className=" bg-gradient-to-r from-indigo-100 to-blue-200">
			<FormProvider>
				<div className=" max-w-screen-lg m-auto items-center justify-center">
					<DynamicForm />
				</div>
			</FormProvider>
		</div>
	);
}
