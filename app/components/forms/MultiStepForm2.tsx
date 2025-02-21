import { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { formSteps } from '@/app/config/steps';

interface FormData {
  [key: string]: string | string[];
}

interface FormErrors {
  [key: string]: string;
}

const ANIMATION_DURATION = 800;

// Validation utilities
const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },
  phone: (value: string): boolean => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value);
  }
};

const DynamicFormContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (name: string, value: string): string => {
    if (!value && formSteps[currentStep].fields.find(f => f.name === name)?.required) {
      return `${name} is required`;
    }

    if (!value) return '';

    switch (name) {
      case 'email':
        return validators.email(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return validators.phone(value) ? '' : 'Phone number must be exactly 10 digits';
      default:
        return '';
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string): void => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Separate validation to only run on blur or form submission
  const handleInputBlur = (fieldName: string, value: string): void => {
    // const error = validateField(fieldName, value);
    // setErrors(prev => ({
    //   ...prev,
    //   [fieldName]: error
    // }));
  };

  const handleOptionSelect = (fieldName: string, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    // setTimeout(() => handleNext(), 800);
  };

  const handleOptionSelectArray = (fieldName: string, value: string): void => {
    console.log("fieldName", fieldName);

    console.log("formData", formData);

    let defaultArray = formData[fieldName] == undefined ? [value] : [...formData[fieldName], value];

    setFormData(prev => ({
      ...prev,
      [fieldName]: defaultArray
    }));
    // setTimeout(() => handleNext(), 800);
  };

  const validateStep = (): boolean => {
    const currentFields = formSteps[currentStep].fields;
    const newErrors: FormErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      const value = formData[field.name] || '';
      if (typeof value === "string") {
        const error = validateField(field.name, value);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = (): void => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1));
    }
  };

  const handlePrev = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (): Promise<void> => {

    console.log("formData", formData);
    if (validateStep()) {
      try {
        const response = await fetch('/api/dummy-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          console.log('Form submitted successfully');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-xl p-6">
        {/* Progress Sidebar */}
        <div className="md:w-1/4 bg-blue-600 rounded-lg p-6 text-white">
          <div className="space-y-4">
            {formSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-md ${currentStep === index ? 'bg-white text-blue-600' : ''
                  }`}
              >
                <span className={`h-8 w-8 flex items-center justify-center rounded-full border-2 
                  ${currentStep === index ? 'border-blue-600 bg-blue-600 text-white' : 'border-white'}`}>
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="md:w-3/4 p-6">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-800">{formSteps[currentStep].title}</h2>

            <h4>{formSteps[currentStep].description}</h4>

            <div className="space-y-4">
              {formSteps[currentStep].fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-gray-700 font-medium">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.options && field.type == "select" ? (
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
                  ) : (
                    field.type == "singleselect" ?
                      (
                        <fieldset className="mb-6">
                          {/* <legend className="text-lg font-medium text-gray-900 mb-2">
                            How soon do you want to begin tutoring? <span className="text-red-500">*</span>
                          </legend> */}
                          {field.options && field.options.map((option) => (
                            <label key={option} className="flex items-center space-x-2 mb-2 cursor-pointer">
                              <input
                                type="radio"
                                name="tutoringTime"
                                value={option}
                                checked={formData[field.name] === option}
                                onChange={() => handleOptionSelect(field.name, option)}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="text-gray-800">{option}</span>
                            </label>
                          ))}
                        </fieldset>
                      ) : field.type == "multiselect" ? (
                        <fieldset className="mb-6 border-t pt-4">
                          {/* <legend className="text-lg font-medium text-gray-900 mb-2">
                              What languages can you tutor? <span className="text-red-500">*</span>
                            </legend> */}
                          <p className="text-sm text-gray-500 mb-3">Only select languages you speak fluently</p>
                          <div className="grid grid-cols-2 gap-2">
                            {field.options && field.options.map((language) => (
                              <label key={language} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData[field.name] == undefined ? false : formData[field.name].includes(language)}
                                  onChange={() => { handleOptionSelectArray(field.name, language) }}
                                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-800">{language}</span>
                              </label>
                            ))}
                          </div>
                          {/* {languages.length > 10 && (
                              <button
                                onClick={() => setShowMore(!showMore)}
                                className="mt-2 text-blue-600 hover:underline text-sm"
                              >
                                {showMore ? "Show Less" : `+${languages.length - 10} More Choices`}
                              </button>
                            )} */}
                        </fieldset>

                      ) :
                        (
                          (
                            <input
                              type={field.type}
                              value={formData[field.name] || ''}
                              onChange={(e) => handleInputChange(e, field.name)}
                              onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                        outline-none transition-all"
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          ))
                  )
                  }

                  {errors[field.name] && (
                    <p className="text-red-500 text-sm">{errors[field.name]}</p>
                  )}
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
                >
                  ← Back
                </motion.button>
              )}

              {currentStep === formSteps.length - 1 ? (
                <motion.button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-500 text-white font-medium rounded-lg
                    hover:bg-green-600 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  Submit
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg
                    hover:bg-blue-700 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  Next →
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DynamicFormContainer;