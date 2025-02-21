"use client";
import MultiStepForm from "./components/forms/MultiStepForm";
import MultiStepFormPage from "./components/forms/MultiStepForm2";
import { FormProvider } from "./context/FormContext";
// import { Main} from "@utsav2727/dynamic-multi-step-form";

export default function Home() {
	return (
		<div className=" bg-gradient-to-r from-indigo-100 to-blue-200">
			<FormProvider>
				<div className=" max-w-screen-lg m-auto items-center justify-center">
					{/* <MultiStepForm /> */}
					<MultiStepFormPage/>
				</div>
			</FormProvider>
			{/* <Main/> */}
		</div>
	);
}
