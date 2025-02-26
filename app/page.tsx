"use client";
// import DynamicFormContainer from "./components/forms/MultiStepForm";
import FormPage from "./form/FormPage";
export default function Home() {
	return (
		<div className=" bg-gradient-to-r from-indigo-100 to-blue-200">
			<div className=" max-w-screen-lg m-auto items-center justify-center">
				<FormPage />
			</div>
		</div>
	);
}
