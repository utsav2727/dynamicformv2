import { formSteps } from '@/app/config/steps';
import FormContent from './FormContent';
import { submitForm } from './actions';

export default function FormPage() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-200 flex items-center justify-center p-4">
            <div className="w-full md:h-[90vh] md:max-w-6xl flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-xl p-6">
                <FormContent formSteps={formSteps} submitForm={submitForm} />
            </div>
        </div>
    );
}