// app/api/dummy-post/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		// Parse the incoming JSON data from the request body
		const data = await request.json();

		// Log the incoming data (for debugging purposes)
		console.log("Received data:", data);

		// Perform any necessary logic here, like database operations or other API calls
		// For now, we'll just return a success message

		return NextResponse.json(
			{ message: "Form submitted successfully!", data },
			{ status: 200 },
		);
	} catch (error) {
		// Handle errors
		console.error("Error during submission:", error);
		return NextResponse.json(
			{ error: "Failed to submit form" },
			{ status: 500 },
		);
	}
}
