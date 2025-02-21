interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface FormStep {
  id: number;
  title: string;
  description?:string;
  fields: FormField[]
}

export const formSteps: FormStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description:"Please provide your name, email address and phone number.",
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        required: false
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: false
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: false
      }
    ]
  },
  {
    id: 2,
    title: "Grades & Subjects",
    fields: [
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true
      },
      {
        name: "country",
        label: "Country",
        type: "text",
        required: true
      },
      {
         name: "howsoon",
        label: "How soon do you want to begin tutoring?",
        type: "singleselect",
        required: true,
        options:[ "As soon as possible",
                "Within the next week",
                "Within the next month",
                "During summer break",
                "Not sure"]
      },
      {
         name: "multi",
        label: "What languages can you tutor?",
        type: "multiselect",
        required: true,
        options:[ "English", "French"]
      }
    ]
  },
  {
    id: 3,
    title: "Experience",
    fields: [
      {
        name: "preference",
        label: "What best describes you?",
        type: "select",
        options: ["Student", "Professional", "Business Owner"],
        required: true
      }
    ]
  },
  {
    id: 4,
    title: "Documents & Consent",
    fields: [
      {
        name: "preference",
        label: "What best describes you?",
        type: "select",
        options: ["Student", "Professional", "Business Owner"],
        required: true
      }
    ]
  }
];