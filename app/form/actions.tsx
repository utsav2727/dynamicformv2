'use server';

interface FormData {
    [key: string]: string | string[] | File | any;
}

export async function submitForm(formData: FormData) {
    try {
        console.log("formData", formData);
        const apiResponse = await fetch('https://your-api-endpoint.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!apiResponse.ok) {
            throw new Error('API request failed');
        }

        return { success: true };
    } catch (error) {
        console.error('Form submission error:', error);
        return { success: false };
    }
}