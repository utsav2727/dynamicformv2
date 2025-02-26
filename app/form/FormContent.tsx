"use client";

import { useState } from 'react';
import DynamicFormContainer from './DynamicFormContainer';

interface FormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    validation?: string;
}

interface FormStep {
    id: number;
    title: string;
    description?: string;
    fields: FormField[]
}

interface FormData {
    [key: string]: string | string[] | File | undefined;
    uid?: string;
}

interface FormContentProps {
    formSteps: FormStep[];
    submitForm: (formData: FormData) => Promise<{ success: boolean }>;
}

export default function FormContent({ formSteps, submitForm }: FormContentProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (stepIndex: number) => {
        setCurrentStep(stepIndex);
    };

    return (
        <>
            <div className="md:w-1/4 bg-blue-600 rounded-lg p-6 text-white">
                <div className="space-y-4">
                    {formSteps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 p-2 rounded-md ${currentStep === index ? "bg-blue-700" : ""
                                }`}
                        >
                            <span className={`h-8 w-8 flex items-center justify-center rounded-full 
                                ${currentStep === index
                                    ? "bg-white text-blue-600"
                                    : "border-2 border-white"}`}>
                                {index + 1}
                            </span>
                            <span className="text-sm font-medium">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:w-3/4 p-6 max-h-[100%] overflow-auto">
                <DynamicFormContainer
                    submitForm={submitForm}
                    onStepChange={handleStepChange}
                    currentStep={currentStep}
                />
            </div>
        </>
    );
}