'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormField, formSteps } from '@/app/config/steps';
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormErrors {
    [key: string]: string;
}

interface DynamicFormContainerProps {
    submitForm: (formData: FormData) => Promise<{ success: boolean }>;
    onStepChange: (stepNumber: number) => void;
    currentStep: number;
}

interface UploadResult {
    success: boolean;
    fileUrl?: string;
    error?: string;
}

const validators = {
    email: (value: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
    },
    phone: (value: string): boolean => {
        const phoneRegex = /^\d{6,}$/; // Ensures at least 5 digits
        return phoneRegex.test(value);
    }
};

const DynamicFormContainer = ({ submitForm, currentStep, onStepChange }: DynamicFormContainerProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [showMore, setShowMore] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>({});

    // Check if the current step contains both email and phone fields
    const isRegistrationStep = (): boolean => {
        const currentFields = formSteps[currentStep].fields.map(field => field.name);
        return currentFields.includes('email') && currentFields.includes('phone');
    };

    // Function to register user and get UID
    const registerUser = async (email: string, phone: string): Promise<string | null> => {
        try {
            // Replace with your API call to register user
            const response = await fetch('/api/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, phone }),
            });

            const data = await response.json();

            if (data.success && data.uid) {
                return data.uid;
            }
            return null;
        } catch (error) {
            console.error('Error registering user:', error);
            return null;
        }
    };

    const uploadToS3 = async (file: File, fieldName: string, uid: string): Promise<UploadResult> => {
        try {
            setUploadStatus(prev => ({ ...prev, [fieldName]: 'uploading' }));

            // Create a form data object to send the file
            const formDataForUpload = new FormData();
            formDataForUpload.append('file', file);
            formDataForUpload.append('uid', uid);
            formDataForUpload.append('fieldName', fieldName);

            // Replace with your API endpoint for S3 uploads
            const response = await fetch('/api/upload-to-s3', {
                method: 'POST',
                body: formDataForUpload,
            });

            const result = await response.json();

            if (result.success) {
                setUploadStatus(prev => ({ ...prev, [fieldName]: 'success' }));
                return {
                    success: true,
                    fileUrl: result.fileUrl
                };
            } else {
                setUploadStatus(prev => ({ ...prev, [fieldName]: 'error' }));
                return {
                    success: false,
                    error: result.error || 'Upload failed'
                };
            }
        } catch (error) {
            console.error(`Error uploading ${fieldName}:`, error);
            setUploadStatus(prev => ({ ...prev, [fieldName]: 'error' }));
            return {
                success: false,
                error: 'Upload failed due to a network error'
            };
        }
    };

    const validateField = (name: string, value: string): string => {
        if (!value && formSteps[currentStep].fields.find(f => f.name === name)?.required) {
            return `${name} is required`;
        }

        if (!value) return '';

        switch (name) {
            case 'email':
                return validators.email(value) ? '' : 'Please enter a valid email address';
            case 'phone':
                return validators.phone(value.replace(/\D/g, '')) ? '' : 'Please enter a valid phone number';
            default:
                return '';
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string): void => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleInputChange2 = (fieldName: string, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            setUploadedFiles((prev) => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), ...files]
            }));

            // Store the files in formData
            setFormData((prev) => ({
                ...prev,
                [fieldName]: files,
            }));

            // If user is registered and we have a UID, upload the files immediately
            if (isUserRegistered && formData.uid) {
                files.forEach(file => {
                    uploadToS3(file, fieldName, formData.uid as string)
                        .then(result => {
                            if (result.success && result.fileUrl) {
                                // Store the S3 URLs in form data as an array
                                setFormData((prev) => {
                                    const existingUrls = Array.isArray(prev[`${fieldName}_urls`])
                                        ? prev[`${fieldName}_urls`] as string[]
                                        : [];

                                    return {
                                        ...prev,
                                        [`${fieldName}_urls`]: [...existingUrls, result.fileUrl].filter(Boolean) as string[], // Ensure valid type
                                    };
                                });
                            } else {
                                // Handle upload error
                                setErrors(prev => ({
                                    ...prev,
                                    [fieldName]: result.error || 'Failed to upload file'
                                }));
                            }
                        });
                });
            }
        }
    };

    const removeFile = (fieldName: string, fileIndex: number) => {
        setUploadedFiles(prev => {
            const updatedFiles = [...(prev[fieldName] || [])];
            updatedFiles.splice(fileIndex, 1);
            return {
                ...prev,
                [fieldName]: updatedFiles
            };
        });

        // Also update the formData
        setFormData(prev => {
            const files = Array.isArray(prev[fieldName]) ? prev[fieldName] as File[] : [];
            const updatedFiles = [...files];
            updatedFiles.splice(fileIndex, 1);

            // Also update URLs if they exist
            const urlsKey = `${fieldName}_urls`;
            let updatedUrls = prev[urlsKey] as string[] || [];
            if (updatedUrls.length > fileIndex) {
                updatedUrls = [...updatedUrls];
                updatedUrls.splice(fileIndex, 1);
            }

            return {
                ...prev,
                [fieldName]: updatedFiles,
                [urlsKey]: updatedUrls
            };
        });
    };

    const handleInputBlur = (fieldName: string, value: string): void => {
        const error = validateField(fieldName, value);
        setErrors(prev => ({
            ...prev,
            [fieldName]: error
        }));
    };

    const handleOptionSelect = (fieldName: string, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleOptionSelectArray = (fieldName: string, value: string): void => {
        setFormData(prev => {
            const prevValues = Array.isArray(prev[fieldName]) ? prev[fieldName] as string[] : [];
            const updatedValues = prevValues.includes(value)
                ? prevValues.filter(item => item !== value)
                : [...prevValues, value];

            return {
                ...prev,
                [fieldName]: updatedValues
            };
        });
    };

    const validateStep = (): boolean => {
        const currentFields = formSteps[currentStep].fields;
        const newErrors: FormErrors = {};
        let isValid = true;

        currentFields.forEach(field => {
            // Only validate fields that are visible (pass validation check)
            const isVisible = field.validation === undefined ||
                (field.validation !== null && eval(field.validation) === true);

            if (isVisible && field.required) {
                const value = formData[field.name];
                if (!value || (typeof value === 'string' && value.trim() === '') ||
                    (Array.isArray(value) && value.length === 0)) {
                    newErrors[field.name] = `${field.label} is required`;
                    isValid = false;
                } else if (typeof value === "string") {
                    const error = validateField(field.name, value);
                    if (error) {
                        newErrors[field.name] = error;
                        isValid = false;
                    }
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = async (): Promise<void> => {
        if (validateStep()) {
            // Check if this is the registration step with email and phone
            if (isRegistrationStep() && !isUserRegistered) {
                try {
                    setIsSubmitting(true);
                    const email = formData.email as string;
                    const phone = formData.phone as string;

                    // Register user and get UID
                    const uid = await registerUser(email, phone);

                    if (uid) {
                        // Store UID in form data
                        setFormData(prev => ({
                            ...prev,
                            uid
                        }));
                        setIsUserRegistered(true);

                        // Move to next step
                        onStepChange(Math.min(currentStep + 1, formSteps.length - 1));
                    } else {
                        // Show registration error
                        setErrors(prev => ({
                            ...prev,
                            registration: 'Failed to register user. Please try again.'
                        }));
                    }
                } catch (error) {
                    console.error('Error during registration:', error);
                    setErrors(prev => ({
                        ...prev,
                        registration: 'An error occurred during registration.'
                    }));
                } finally {
                    setIsSubmitting(false);
                }
            } else {
                onStepChange(Math.min(currentStep + 1, formSteps.length - 1));
            }
        }
    };

    const handlePrev = (): void => {
        onStepChange(Math.max(currentStep - 1, 0));
    };

    const handleSubmit = async (): Promise<void> => {
        if (validateStep()) {
            try {
                setIsSubmitting(true);

                // Upload any pending files if user is registered
                if (isUserRegistered && formData.uid) {
                    // Process all file fields
                    for (const [fieldName, files] of Object.entries(uploadedFiles)) {
                        if (Array.isArray(files) && files.length > 0) {
                            const fileUploadPromises = files.map(file =>
                                // Check if this file has already been uploaded
                                uploadToS3(file, fieldName, formData.uid as string)
                                    .then(result => {
                                        if (result.success && result.fileUrl) {
                                            // Update form data with file URL
                                            setFormData(prev => {
                                                const existingUrls = Array.isArray(prev[`${fieldName}_urls`])
                                                    ? prev[`${fieldName}_urls`] as string[]
                                                    : [];
                                                return {
                                                    ...prev,
                                                    [`${fieldName}_urls`]: [...existingUrls, result.fileUrl] as string[], // Explicit assertion
                                                };
                                            });
                                        }
                                        return result;
                                    })
                            );

                            // Wait for all uploads to complete
                            const uploadResults = await Promise.all(fileUploadPromises);

                            // Check if any uploads failed
                            const failedUploads = uploadResults.filter(result => !result.success);
                            if (failedUploads.length > 0) {
                                alert(`${failedUploads.length} file(s) failed to upload. Please try again.`);
                                // return;
                            }
                        }
                    }
                }

                // Prepare final form data for submission
                const formDataForSubmit = { ...formData };

                // Remove actual File objects as they can't be sent via server actions
                Object.keys(formDataForSubmit).forEach(key => {
                    if (Array.isArray(formDataForSubmit[key]) &&
                        formDataForSubmit[key][0] instanceof File) {
                        // Make sure we keep the URLs of the files
                        if (!formDataForSubmit[`${key}_urls`]) {
                            delete formDataForSubmit[key];
                        }
                    }
                });

                const result = await submitForm(formDataForSubmit);

                if (result.success) {
                    router.push("/success");
                } else {
                    alert("Form submission failed.");
                    router.push("/success");
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert("An error occurred while submitting the form.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderFileUploadField = (field: FormField) => (
        <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500 transition-all">
                <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    onChange={(e) => handleFileChange(e, field.name)}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    disabled={!isUserRegistered}
                    multiple
                />
                <label htmlFor={field.name} className={`flex flex-col items-center ${!isUserRegistered ? 'opacity-50' : ''}`}>
                    <svg
                        className="w-10 h-10 text-gray-400 mb-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V12m0 0V8m0 4h10m-5-8a4 4 0 00-4 4v1a4 4 0 004 4h5a4 4 0 004-4V7a4 4 0 00-4-4h-5z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">
                        {!isUserRegistered
                            ? "Complete registration first"
                            : "Drag & drop or browse to upload multiple files"}
                    </span>
                    <span className="text-xs text-gray-400">(PDF, DOC, PNG, JPG up to 5MB each)</span>
                </label>
            </div>

            {/* Display uploaded files list */}
            {uploadedFiles[field.name] && uploadedFiles[field.name].length > 0 && (
                <div className="mt-3 space-y-2">
                    <h4 className="font-medium text-gray-700">Uploaded files:</h4>
                    <ul className="bg-gray-50 rounded-lg p-2">
                        {uploadedFiles[field.name].map((file, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-800 truncate max-w-xs">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({(file.size / 1024).toFixed(0)} KB)
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    {uploadStatus[`${field.name}_${index}`] === 'uploading' && (
                                        <span className="text-blue-500 text-xs mr-2">Uploading...</span>
                                    )}
                                    {uploadStatus[`${field.name}_${index}`] === 'success' && (
                                        <span className="text-green-500 text-xs mr-2">✓ Uploaded</span>
                                    )}
                                    {uploadStatus[`${field.name}_${index}`] === 'error' && (
                                        <span className="text-red-500 text-xs mr-2">Failed</span>
                                    )}

                                    <button
                                        onClick={() => removeFile(field.name, index)}
                                        className="text-red-500 hover:text-red-700"
                                        type="button"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!isUserRegistered && field.type === "file" && (
                <p className="text-amber-600 text-xs mt-1">
                    You need to register with email and phone number first
                </p>
            )}
        </div>
    );

    const MAX_VISIBLE_OPTIONS = 10;

    console.log("formData", formData);

    return (
        <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-6"
        >
            <h2 className="text-3xl font-bold text-gray-800">{formSteps[currentStep].title}</h2>
            <h4>{formSteps[currentStep].description}</h4>

            {errors.registration && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                    {errors.registration}
                </div>
            )}

            <div className="space-y-4">
                {formSteps[currentStep].fields.map(field => (
                    <div key={field.name} className="relative">
                        {/* {console.log(field.validation, " ", eval(field.validation))} */}
                        {(field.validation == undefined || (field.validation != null && eval(field.validation) && eval(field.validation) == true)) && <div>
                            {<label className="block text-gray-700 font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>}

                            {field.options && field.type === "select" ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {field.options.map(option => (
                                        <motion.button
                                            key={option}
                                            onClick={() => handleOptionSelect(field.name, option)}
                                            className={`px-4 py-2 rounded-lg text-white font-medium
                      ${formData[field.name] === option
                                                    ? 'bg-green-500'
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                } transition-all`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                                </div>
                            ) : field.type === "singleselect" ? (
                                <fieldset className="mb-6">

                                    {field.options && field.options.map((option) => (
                                        <label key={option} className="flex items-center space-x-2 mb-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={field.name}
                                                value={option}
                                                checked={formData[field.name] === option}
                                                onChange={() => handleOptionSelect(field.name, option)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-800">{option}</span>
                                        </label>
                                    ))}
                                </fieldset>
                            ) : (field.type === "consent" || field.type === "multiselect") ? (
                                <div>
                                    {(field.validation == undefined || (field.validation != null && eval(field.validation) && eval(field.validation) == true)) && <fieldset className="mb-6 border-t pt-4">
                                        <div className={`grid ${field.type === "multiselect" ? "grid-cols-2" : ""} gap-2`}>
                                            {field.options?.slice(0, showMore ? field.options.length : MAX_VISIBLE_OPTIONS).map((option) => (
                                                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(formData[field.name] as string[])?.includes(option) || false}
                                                        onChange={() => handleOptionSelectArray(field.name, option)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-800 whitespace-pre-wrap">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {field.options && field.options.length > MAX_VISIBLE_OPTIONS && (
                                            <button
                                                onClick={() => setShowMore(!showMore)}
                                                className="mt-2 text-blue-600 hover:underline text-sm"
                                            >
                                                {showMore ? "Show Less" : `+ ${field.options.length - MAX_VISIBLE_OPTIONS} More Choices`}
                                            </button>
                                        )}
                                    </fieldset>}
                                </div>
                            ) : field.type === "tel" ? (
                                <PhoneInput
                                    defaultCountry="US"
                                    value={formData[field.name] as string || ""}
                                    onChange={(value) => handleInputChange2(field.name, value || "")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none 
                          focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                />
                            ) : field.type === "file" ? (
                                renderFileUploadField(field)
                            ) : field.type === "other" ? (
                                <textarea
                                    value={formData[field.name] as string || ''}
                                    onChange={(e) => handleInputChange(e, field.name)}
                                    onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                                    className={`w-[400px] h-[150px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors[field.name] ? 'border-red-500' : ''
                                        }`}
                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    value={formData[field.name] as string || ''}
                                    onChange={(e) => handleInputChange(e, field.name)}
                                    onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${errors[field.name] ? 'border-red-500' : ''
                                        }`}
                                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                                />
                            )}

                            {errors[field.name] && (
                                <span className="text-red-500 text-xs mt-1 block">
                                    {errors[field.name]}
                                </span>
                            )}
                        </div>
                        }
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6">
                {currentStep > 0 && (
                    <motion.button
                        onClick={handlePrev}
                        className="px-6 py-2 text-gray-600 font-medium rounded-lg
              hover:bg-gray-100 transition-all"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        ← Back
                    </motion.button>
                )}

                {currentStep === formSteps.length - 1 ? (
                    <motion.button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg
              hover:bg-green-600 transition-all disabled:bg-gray-400"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={handleNext}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg
              hover:bg-blue-700 transition-all disabled:bg-gray-400"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && isRegistrationStep() && !isUserRegistered ? "Registering..." : "Next →"}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default DynamicFormContainer;