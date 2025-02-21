export const stepConfig = [
	{
		title: "Who needs a tutor?",
		type: "select",
		fields: [
			{
				name: "tutorFor",
				label: "",
				type: "radio",
				options: ["Myself", "My Child", "Other"],
				required: true,
			},
		],
		conditionalRoutes: {
			field: "tutorFor",
			map: {
				"Myself": 1,
				"MyChild": 1,
				"Other": 1,
			},
		},
		promotionalContent: {
			title: "Exclusive Offer!",
			message: "Get 10% off on your first session if you sign up now!",
			image: "https://llt.imgix.net/v1/1623190819-paper-ordered-list.svg",
		},
	},
	{
		title: "What grade level are you in?",
		type: "select",
		fields: [
			{
				name: "grade",
				label: "",
				type: "radio",
				options: [
					"Elementary",
					"Middle School",
					"High School",
					"College or Graduate",
					"Adult Learner",
					"Other",
				],
				required: true,
			},
		],
		conditionalRoutes: {
			field: "grade",
			map: {
				"Other": 2,
			},
		},
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image:
				"https://png.pngtree.com/png-clipart/20211205/original/pngtree-special-offer-png-png-image_6960764.png",
		},
	},
	{
		title: "How soon do you need tutoring?",
		type: "select",
		fields: [
			{
				name: "howsoon",
				label: "",
				type: "radio",
				options: ["Right Away", "In a few weeks", "Not sure"],
				required: true,
			},
		],
		promotionalContent: {
			title: "",
			message: "",
			image: "",
		},
	},
	{
		title: "What is your name?",
		type: "non-select",
		fields: [
			{ name: "name", label: "Your Name", type: "text", required: true },
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image:
				"https://png.pngtree.com/png-clipart/20211205/original/pngtree-special-offer-png-png-image_6960764.png",
		},
	},
	{
		title: "What is your email address?",
		type: "non-select",
		fields: [
			{ name: "email", label: "Your Email", type: "email", required: true },
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image:
				"https://png.pngtree.com/png-clipart/20211205/original/pngtree-special-offer-png-png-image_6960764.png",
		},
	},
	{
		title: "What is your Country?",
		type: "non-select",
		fields: [
			{
				name: "country",
				label: "Your Country",
				type: "country",
				required: true,
			},
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image: "",
		},
	},
	{
		title: "What is your State?",
		type: "non-select",
		fields: [
			{ name: "state", label: "Your State", type: "state", required: true },
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image: "",
		},
	},
	{
		title: "What is your zip code?",
		type: "non-select",
		fields: [
			{ name: "zipcode", label: "Your Zip Code", type: "text", required: true },
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image: "",
		},
	},
	{
		title: "What is your phone number?",
		type: "non-select",
		fields: [
			{ name: "phone", label: "Phone Number", type: "tel", required: true },
		],
		promotionalContent: {
			title: "Limited Time Offer",
			message: "Enroll today and get free course materials.",
			image:
				"https://png.pngtree.com/png-clipart/20211205/original/pngtree-special-offer-png-png-image_6960764.png",
		},
	},
];
