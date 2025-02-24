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
        required: true
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true
      }
    ]
  },
  {
    id: 2,
    title: "Grades & Subjects",
    fields: [
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
         name: "languages",
        label: "What languages can you tutor?",
        type: "multiselect",
        required: true,
        options:[ "English", "Frpench", "Fruench", "Frrench", "Fqrench", "Frevnch", "Frencnh", "Frsdench", "Frdsench", "Frdhench", "Frenuch", "Frenoch", "Freqnch", "Frennch", "Frelnch"]
      },
      {
         name: "students_age_groups",
        label: "What students age group(s) you interested in tutoring/teaching?",
        type: "multiselect",
        required: true,
        options:[ "Pre-Kindergarten", "Kindergarten - 2nd Grade", "3rd Grade-5th Grade", "Middle School", "High School", "College (Undergraduate)", "Graduate Students", "Adult Learners"]
      },
      {
         name: "tutoring_subjects",
        label: "Tutoring Subject(s)",
        type: "multiselect",
        required: true,
        options:[ "K to 5th Grade All Subjects", "Science", "Business", "Middle School Exam", "College Entrance Exams", "Math", "Physics", "Advanced Placement (AP)", "High School Exam","Graduate School Entrance Exams","Arts (Humanities)","Chemistry","Computer Science"]
      },
      {
         name: "grade_K_to_5th_Grade",
        label: "Grade(s) K to 5th Grade All Subjects",
        type: "multiselect",
        required: true,
        options:[ "English","Phonics", "Math","Reading","Writing", "Study Skills"]
      },
      {
         name: "Math",
        label: "Math",
        type: "multiselect",
        required: true,
        options:[ "Algebra","College Math","Elementary School Math","High School Math","Pre-Calculus","Probability","Common Core Math","Geometry","Middle School Math","Statistics","Calculus"]
      },
      {
         name: "science",
        label: "Science",
        type: "multiselect",
        required: true,
        options:["Anatomy","Biology","Chemistry","Organic Chemistry","Physical Chemistry","Physics","Physiology" ]
      },
      {
         name: "humanities",
        label: "Humanities",
        type: "multiselect",
        required: true,
        options:[ "Essay Editing","History","Law","Literature","Theology"]
      },
      {
         name: "business",
        label: "Business",
        type: "multiselect",
        required: true,
        options:[ "Accounting","Business Calculus","Economics","Finance","Marketing","MBA","Microsoft Excel","Supply Chain Management"]
      },
      {
         name: "advanced_placement",
        label: "Advanced Placement (AP)",
        type: "multiselect",
        required: true,
        options:[ "AP Biology","AP Calculus","AP Chemistry","AP Computer Science","AP French","AP History","AP Human Geography","AP Macroeconomics","AP Microeconomics","AP Physics"]
      },
      {
         name: "middle_school_exam",
        label: "Middle School Exam",
        type: "multiselect",
        required: true,
        options:[ "CogAT","ISEE","MAP","SHSAT","SSAT"]
      },
      {
         name: "high_school_exam",
        label: "High School Exam",
        type: "multiselect",
        required: true,
        options:["ASVAB", "GED","HSPT","IB","ISEE","SHSAT","SSAT","TACHS"]
      },
      {
         name: "College Entrance Exams",
        label: "College Entrance Exams",
        type: "multiselect",
        required: true,
        options:["ACT","PSAT","SAT"]
      },
      {
         name: "Graduate School Entrance Exams",
        label: "Graduate School Entrance Exams",
        type: "multiselect",
        required: true,
        options:["DAT", "GMAT","GRE","MCAT","PCAT"]
      },
      {
         name: "Enrichment Program",
        label: "Enrichment Program",
        type: "multiselect",
        required: true,
        options:["Art", "Chess","Coding","Early Childhood","Languages","Music","STEM"]
      },
      {
        name: "Other Subject",
        label: "Other Subject",
        type: "other",
        required: false
      }
    ]
  },
  {
    id: 3,
    title: "Experience",
    fields: [
      {
        name: "tutoring topics",
        label: "Do you have experience tutoring in one or more of those topics",
        type: "multiselect",
        required: true,
        options:[ "Study Skills","Learning strategies","Organizational Skills","Social Emotional Learning (SEL)","None of the above"]
      },
      {
         name: "teaching students",
        label: "Do you have experience tutoring or teaching students with the following special needs",
        type: "multiselect",
        required: true,
        options:[ "IEP (Individualized Education Plan)","504 Plan Accommodations","ADHD","Autism","Dyscalculia","Dysgraphia","Dyslexia","Memory Issues","Processing Disorders","None of the above"]
      },
      {
         name: "level of education",
        label: "What best describes your highest level of education",
        type: "singleselect",
        required: true,
        options:[ "I have an Associate's Degree","I have a Bachelor's Degree","I have a Master's Degree","I have a Doctorate/PhD","I am a currently undergraduate student","I am a currently graduate student","None of the above"]
      },
      {
         name: "teaching experience",
        label: "Do you have prior tutoring teaching experience?",
        type: "singleselect",
        required: true,
        options:[ "Yes, tutoring","Yes, teaching in classroom","Yes for both tutoring and classroom teaching","No"]
      },
       {
         name: "teaching experience yrs",
        label: "How many years of tutoring experience do you have? *",
        type: "singleselect",
        required: true,
        options:[ "None","Less than 1 year","1-2 Years","2-5 Years","More than 5 years"]
      },
       {
         name: "teaching experience classroom",
        label: "How many years of classroom teaching experience do you have? *",
        type: "singleselect",
        required: true,
        options:[  "None","Less than 1 year","1-2 Years","2-5 Years", "5-10 years","More than 10 years"]
      },
       {
         name: "classroom teacher",
        label: "Are you currently a classroom teacher?",
        type: "singleselect",
        required: true,
        options:[ "Yes","No"]
      },
       {
         name: "teaching certificate",
        label: "Do you have a teaching certificate?",
        type: "singleselect",
        required: true,
        options:[ "Yes","Yes, but certificate has expired","No"]
      },
       {
         name: "state valid teaching certificate",
        label: "Select the state(s) in which you hold a valid teaching certificate",
        type: "multiselect",
        required: true,
        options:["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
      },
      {
         name: "level certification",
        label: "Select the level your certification applies to:",
        type: "singleselect",
        required: true,
        options:[ "Early Childhood","Elementary School","Middle School","Secondary School/High School"]
      },
      {
         name: "certification area",
        label: "Select your certification's area of specialization:",
        type: "multiselect",
        required: true,
        options:[ "CELTA","Computer Sience","English","ESL/ELL","Gifted","Math","Science","Special Education","Structured Literacy Practice","Other"]
      },
      {
         name: "instruction interests",
        label: "What type of instruction interests you?",
        type: "multiselect",
        required: true,
        options:[ "Online: One on One (1:1)","Online: Group","Online: Substitute teacher","Online: Homeschool teacher","In-Person: One on One (1:1)","In-Person: Substitute teacher","In-Person: Homeschool teacher","In-Person: Shadow Teacher"]
      },
      {
        name: "available hours",
        label: "How many Hours per week you available and interested in tutoring/teaching? ",
        type: "singleselect",
        required: true,
        options:[ "Less than 5 hours per week","5-10 hours per week","10-20 hours per week","More than 20 hours per week","Not Sure"]
      },
    ]
  },
  {
    id: 4,
    title: "Documents & Consent",
    fields: [
        {
        name: "firstname",
        label: "First Name",
        type: "text",
        required: true
      },
              {
        name: "lastname",
        label: "Last Name",
        type: "text",
        required: true
      },
      {
        name: "Street Address",
        label: "Street Address",
        type:   "text",
        required: true
      },
      {
        name: "AddressLine2",
        label: "AddressLine 2",
        type:   "text",
        required: true
      },
      {
        name: "city",
        label: "city",
        type:   "text",
        required: true
      },
      {
        name: "state",
        label: "state/Region/Province",
        type:   "text",
        required: true
      },
      {
        name: "Zipcode",
        label: "Zip Code",
        type:   "text",
        required: true
      },
      {
        name: "country",
        label: "country",
        type:   "country",
        required: true
      },
      {
      name: "Upload Support Documents",
      label: "Upload Support Documents",
      type: "file",
      required: true
      },
      {
      name: "Upload your image",
      label: "Upload Your Image",
      type: "file",
      required: true
      },
      {
         name: "Terms and Conditions",
        label: "Terms and Conditions",
        type: "consent",
        required: true,
        options:[ "I agree to Limitless Virtue LLC doing business as Kids on the Yard Term of Use and Privacy Policy and I am 18 years or older. I agree for background check and document validation by 3rd party."]
      },
      {
         name: "Consent to Receive and Send SMS Communications",
        label: "Consent to Receive and Send SMS Communications",
        type: "consent",
        required: true,
        options:[ "By providing your phone number and opting in, you agree to receive SMS messages related to your tutoring application, account updates, scheduling, and other relevant communications. Message and data rates may apply. You may opt out at any time by replying STOP to any message. For more details, please refer to our Privacy Policy and Terms of \nI acknowledge that \n Message and Data Rates May Apply - Standard carrier charges may be incurred for SMS communications.\n2. Opt-Out Option - I can withdraw my consent at any time by replying STOP to any message.\n3. Privacy and Security - My phone number will be used in accordance with the company's Privacy Policy and will not be shared with unauthorized third parties.\n4. Accuracy of Information - I confirm that the provided phone number is accurate and belongs to me.\nBy signing below, I affirm my consent to receive and send SMS communications as outlined above."]
      },
      {
         name: "Consent to Receive and Send Email Communications",
        label: "Consent to Receive and Send Email Communications",
        type: "consent",
        required: true,
        options:[ "By providing your phone number and opting in, you agree to receive SMS messages related to your tutoring application, account updates, scheduling, and other relevant communications. Message and data rates may apply. You may opt out at any time by replying STOP to any message. For more details, please refer to our Privacy Policy and Terms of \nI acknowledge that \n Message and Data Rates May Apply - Standard carrier charges may be incurred for SMS communications.\n2. Opt-Out Option - I can withdraw my consent at any time by replying STOP to any message.\n3. Privacy and Security - My phone number will be used in accordance with the company's Privacy Policy and will not be shared with unauthorized third parties.\n4. Accuracy of Information - I confirm that the provided phone number is accurate and belongs to me.\nBy signing below, I affirm my consent to receive and send SMS communications as outlined above."]
      },
    ]
  }
];