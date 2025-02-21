"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { stepConfig } from "../config/stepConfig";

interface FormField {
	name: string;
	label: string;
	type: string;
	required: boolean;
	options?: string[];
}

interface PromotionalContent {
	title: string;
	message: string;
	image: string;
}

interface Step {
	// id: string;
	title: string;
	fields: FormField[];
	type: string;
	promotionalContent: PromotionalContent;
	// @ts-ignore
	conditionalRoutes?: Record<string, any>;
}


interface FormContextType {
	stepIndex: number;
	steps: Step[];
	formData: Record<string, string>;
	nextStep: (selectedValue?: string) => void;
	prevStep: () => void;
	updateFormData: (name: string, value: string) => void;
	submitForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: React.ReactNode }) {
	const steps: Step[] = stepConfig;
	const [stepIndex, setStepIndex] = useState(0);
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [history, setHistory] = useState<number[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ignoring steps dependency
	useEffect(() => {
		const initialData: Record<string, any> = {};
		for (const step of steps) {
			for (const field of step.fields) {
				initialData[field.name] = "";
			}
		}

		const countryObj = {
			id: 233,
			name: "United States",
			iso3: "USA",
			iso2: "US",
			numeric_code: "840",
			phone_code: "1",
			capital: "Washington",
			currency: "USD",
			currency_name: "United States dollar",
			currency_symbol: "$",
			tld: ".us",
			native: "United States",
			region: "Americas",
			subregion: "Northern America",
			latitude: "38.00000000",
			longitude: "-97.00000000",
			emoji: "🇺🇸",
			hasStates: true,
		};
		initialData.country_obj = countryObj;
		initialData.country = "United States";
		initialData.country_id = 233;
		setFormData(initialData);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const nextStep = (selectedValue?: string) => {
		setHistory((prevHistory) => [...prevHistory, stepIndex]);

		const currentStep = steps[stepIndex];
		if (currentStep.conditionalRoutes) {
			const selectedOption =
				selectedValue || formData[currentStep.conditionalRoutes.field];

			if (
				selectedOption &&
				currentStep.conditionalRoutes.map[selectedOption] !== undefined
			) {
				setStepIndex(currentStep.conditionalRoutes.map[selectedOption]);
				return;
			}
		}

		if (stepIndex < steps.length - 1) {
			setStepIndex((prev) => prev + 1);
		}
	};

	const prevStep = () => {
		setHistory((prevHistory) => {
			if (prevHistory.length === 0) return prevHistory;

			const lastStep = prevHistory[prevHistory.length - 1];
			setStepIndex(lastStep);
			return prevHistory.slice(0, -1);
		});
	};

	const submitForm = () => {
		console.log("Form submitted with data:", formData);
		alert("Form Submitted Successfully!");
	};

	const updateFormData = (name: string, value: string) =>
		setFormData((prev) => ({ ...prev, [name]: value }));

	return (
		<FormContext.Provider
			value={{
				stepIndex,
				steps,
				formData,
				nextStep,
				prevStep,
				updateFormData,
				submitForm,
			}}
		>
			{children}
		</FormContext.Provider>
	);
}

export function useFormContext() {
	const context = useContext(FormContext);
	if (!context)
		throw new Error("useFormContext must be used within a FormProvider");
	return context;
}
