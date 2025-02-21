"use client";
import { useFormContext } from "@/app/context/FormContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useEffect, useState } from "react";
import PhoneInput, {
	getCountries,
	getCountryCallingCode,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import "react-phone-number-input/style.css";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
// import { Country } from 'country-state-city';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\d{10}$/;

export default function DynamicForm() {
	const router = useRouter(); // Get the router from next/navigation
	const {
		stepIndex,
		steps,
		formData,
		nextStep,
		prevStep,
		updateFormData,
		submitForm,
	} = useFormContext();
	const step = steps[stepIndex];

	const isLastStep = stepIndex === steps.length - 1;

	const [selectedOptions, setSelectedOptions] = useState<{
		[key: string]: string;
	}>(
		Object.keys(formData).reduce(
			(acc, key) => {
				acc[key] = formData[key];
				return acc;
			},
			{} as { [key: string]: string },
		),
	);

	const [emptyFields, setEmptyFields] = useState<Record<string, boolean>>({});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (step.fields) {
			const updatedSelectedOptions: { [key: string]: string } = {};
			for (const field of step.fields) {
				if (formData[field.name]) {
					updatedSelectedOptions[field.name] = formData[field.name];
				}
			}
			setSelectedOptions(updatedSelectedOptions);
		}
	}, [step.fields, formData]);

	const handleOptionClick = (fieldName: string, value: string) => {
		updateFormData(fieldName, value);
		setSelectedOptions((prevState) => ({
			...prevState,
			[fieldName]: value,
		}));

		setTimeout(() => {
			nextStep(value);
		}, 800);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string,
	) => {
		const value = e.target.value;
		updateFormData(fieldName, value);

		if (fieldName === "email" && value && !emailRegex.test(value)) {
			setErrors((prev) => ({
				...prev,
				email: "Please enter a valid email address.",
			}));
		} else if (fieldName === "phone" && value && !phoneRegex.test(value)) {
			setErrors((prev) => ({
				...prev,
				phone: "Phone number must be exactly 10 digits.",
			}));
		} else {
			setErrors((prev) => {
				const { [fieldName]: _, ...rest } = prev;
				return rest;
			});
		}

		setEmptyFields((prev) => ({
			...prev,
			[fieldName]: value.trim() === "",
		}));
	};

	const isNextDisabled = step.fields.some(
		(field) => field.required && !formData[field.name]?.trim(),
	);

	const handleSubmit = async () => {
		console.log("submitted Data", formData);

		try {
			const response = await fetch("/api/dummy-post", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				router.push("/success"); // Redirect to success page
			} else {
				alert("Form submission failed.");
			}
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<motion.div
			className="w-full p-4 h-full md:flex justify-between items-start space-x-6"
			key={stepIndex}
			initial={{ x: 100, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -100, opacity: 0 }}
			transition={{ duration: 0.4, ease: "easeInOut" }}
		>
			<div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl">
				<h2 className="text-3xl text-gray-800 mb-6">{step.title}</h2>
				{step.fields.map((field) => (
					<div key={field.name} className="mb-5">
						<div className="block text-lg font-medium text-gray-700 mb-2">
							{field.label}
						</div>
						{field.options ? (
							<div className="grid grid-cols-1 gap-4">
								{field.options.map((option: string) => (
									<motion.button
										key={option}
										onClick={() => handleOptionClick(field.name, option)}
										whileTap={{ scale: 0.95 }}
										className={`w-full md:w-auto px-6 py-3 rounded-xl text-lg font-medium text-white
                                        transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 
                                        hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 
                                        shadow-md hover:shadow-lg active:scale-95 ${selectedOptions[field.name] === option ? "bg-green-500" : ""}`}
									>
										{option}
									</motion.button>
								))}
							</div>
						) : field.type === "country" ? (
							<div>
								<CountrySelect
									containerClassName="form-group"
									inputClassName=""
									defaultValue={formData[`${field.name}_obj`] as any}
									onChange={(_country: any) => {
										console.log("country", _country);
										updateFormData(`${field.name}_obj`, _country);
										updateFormData(field.name, _country?.name || "");
										updateFormData(`${field.name}_id`, _country?.id || "");
									}}
									onTextChange={(_txt) => console.log(_txt)}
									placeHolder="Select Country"
								/>
							</div>
						) : field.type === "state" ? (
							<div>
								{formData.country_id == "233" ? (
									<StateSelect
										countryid={Number.parseInt(formData.country_id)}
										containerClassName="form-group"
										inputClassName=""
										onChange={(_state: any) => {
											console.log("_state", _state);
											updateFormData(field.name, _state?.name || "");
											updateFormData(`${field.name}_id`, _state?.id || "");
										}}
										onTextChange={(_txt) => console.log(_txt)}
										// defaultValue={currentState}
										placeHolder="Select State"
									/>
								) : (
									<input
										type={field.type}
										value={formData[field.name] || ""}
										onChange={(e) => handleInputChange(e, field.name)}
										required={field.required}
										className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 transition shadow-sm"
									/>
								)}
							</div>
						) : field.type === "tel" ? (
							<PhoneInput
								defaultCountry="US"
								value={formData[field.name] || ""}
								onChange={(value) => updateFormData(field.name, value || "")}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 transition shadow-sm"
							/>
						) : (
							<input
								type={field.type}
								value={formData[field.name] || ""}
								onChange={(e) => handleInputChange(e, field.name)}
								required={field.required}
								className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none 
                                    focus:ring-2 focus:ring-blue-500 transition shadow-sm"
							/>
						)}
						{step.type === "select" && selectedOptions[field.name] ? (
							<div className="mt-4 text-green-500">
								✅ {selectedOptions[field.name]} selected
							</div>
						) : (
							<div className="mt-10 text-green-500" />
						)}
						{errors[field.name] ? (
							<div className="text-red-500 text-sm min-h-[1.5rem]">
								{errors[field.name]}
							</div>
						) : (
							<div className="min-h-[1.5rem]" />
						)}
					</div>
				))}
				<div className="flex justify-between mt-6">
					{stepIndex > 0 && (
						<motion.button
							onClick={prevStep}
							whileTap={{ scale: 0.95 }}
							className=" py-3 w-full md:w-auto text-lg font-medium text-gray-700 
                             rounded-xl transition-all duration-300  
                            focus:ring-4 focus:ring-gray-400  active:scale-95"
						>
							⬅ Back
						</motion.button>
					)}
					{isLastStep ? (
						<motion.button
							onClick={handleSubmit} // Use the new handleSubmit function
							whileTap={{ scale: 0.95 }}
							className="px-6 py-3 w-full md:w-auto text-lg font-medium text-white 
                            bg-green-600 rounded-xl transition-all duration-300 hover:bg-green-700 
                            focus:ring-4 focus:ring-green-300 shadow-md hover:shadow-lg active:scale-95"
						>
							Submit
						</motion.button>
					) : (
						!step.fields.some((field) => field.options) && (
							<motion.button
								disabled={errors.email !== undefined || isNextDisabled}
								onClick={() => nextStep()}
								whileTap={{ scale: 0.95 }}
								className="px-6 py-3 w-full md:w-auto text-lg font-medium text-white 
                                bg-blue-600 rounded-xl transition-all duration-300 hover:bg-blue-700 
                                focus:ring-4 focus:ring-blue-300 shadow-md hover:shadow-lg active:scale-95"
							>
								Next ➡
							</motion.button>
						)
					)}
				</div>
			</div>
			<div className="w-full p-6 flex md:justify-end md:place-self-end items-center">
				{step.promotionalContent && (
					<div className="text-center md:text-end">
						{step.promotionalContent.image && (
							<div className="place-self-center  md:justify-self-end">
								<img
									src={step.promotionalContent.image}
									alt={step.promotionalContent.title || "Promotional Image"}
									className="mb-4 h-12 rounded-lg shadow-lg"
								/>
							</div>
						)}
						<h3 className="text-2xl font-semibold text-gray-800 mb-4">
							{step.promotionalContent.title}
						</h3>
						<p className="text-lg text-gray-600">
							{step.promotionalContent.message}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
}
