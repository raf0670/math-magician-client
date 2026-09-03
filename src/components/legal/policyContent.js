export const businessInfo = {
  name: "Magician's School",
  brandName: "Magician's School",
  address: "RH Home Center, Farmgate, Dhaka",
  phone: "01894688018",
  email: "maharab.h.35@gmail.com",
  tradeLicenseNumber: "20261911562900040",
  lastUpdated: "September 2, 2026",
};

export const policies = {
  terms: {
    eyebrow: "Terms",
    title: "Terms & Conditions",
    description: "These terms explain how enrollment, payment, account access, and class participation work at Magician's School.",
    sections: [
      {
        heading: "Enrollment and payment",
        body: [
          "Students may enroll in online or offline admission preparation programs by submitting the required student information and payment details through the website.",
          "All prices shown on this website are displayed in Bangladeshi Taka (BDT). Payment may be made in full or as an approved partial payment when that option is available.",
          "Manual payment submissions, including bKash or bank transfer references, remain pending until reviewed and approved by an administrator.",
        ],
      },
      {
        heading: "Account and course access",
        body: [
          "Students are responsible for keeping their login credentials secure and for providing accurate contact, academic, and payment information.",
          "Course access, class resources, exams, and dashboard features may be activated only after the relevant enrollment or payment status is approved.",
          "Access is provided for the selected program and may not be transferred, resold, or shared with another person.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Students must not copy, redistribute, sell, record, upload, or publicly share class materials, exam questions, recordings, resources, or dashboard content without written permission.",
          "Any misuse of the platform, false payment submission, abusive behavior, or attempt to disrupt exams or services may result in restricted access.",
        ],
      },
      {
        heading: "Service changes and limitations",
        body: [
          "Magician's School may update class schedules, instructors, resource availability, or platform features when needed for academic or operational reasons.",
          "The platform is built for admission preparation support. No admission result, score, rank, or university placement is guaranteed.",
          "To the maximum extent permitted by applicable law, Magician's School is not responsible for indirect losses, missed opportunities, network issues, or third-party service interruptions.",
        ],
      },
    ],
  },
  refund: {
    eyebrow: "Refund",
    title: "Return & Refund Policy",
    description: "Enrollment payments are final because the programs provide class access, academic guidance, tests, and digital resources.",
    sections: [
      {
        heading: "No return or refund",
        body: [
          "Payments made for enrollment, seat booking, classes, exams, resources, or admission preparation services are non-refundable and non-returnable after payment submission or enrollment confirmation.",
          "Students should review the selected program, delivery mode, schedule, and price before making payment.",
        ],
      },
      {
        heading: "Duplicate or technical payment errors",
        body: [
          "If a confirmed duplicate payment or technical payment error occurs, the student should contact Magician's School with the transaction ID, payment method, phone number, and enrollment email.",
          "Any correction for a confirmed duplicate or technical error will be reviewed case by case and handled according to applicable law and payment-provider rules.",
        ],
      },
      {
        heading: "Contact for payment review",
        body: [
          `For refund-policy questions or payment review, contact ${businessInfo.phone} or ${businessInfo.email}.`,
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Privacy Policy",
    description: "This policy explains what information Magician's School collects and how it is used to manage enrollment, payment review, classes, and student support.",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We may collect student name, email address, phone number, address, Facebook profile link, academic background, program choice, payment method, transaction reference, and support messages.",
          "We may also collect basic account, dashboard, exam, and performance information needed to operate the student portal.",
        ],
      },
      {
        heading: "How we use information",
        body: [
          "Information is used to create student accounts, manage enrollment, verify payment submissions, provide classes and resources, communicate updates, provide support, and maintain platform security.",
          "Payment references are used for admin review and reconciliation with the selected payment method.",
        ],
      },
      {
        heading: "Sharing and protection",
        body: [
          "We do not sell student personal information. Information may be shared only with service providers, payment partners, technical support providers, or legal/regulatory authorities when needed to operate the service or comply with law.",
          "Reasonable technical and organizational measures are used to protect student information, but no online system can be guaranteed to be completely secure.",
        ],
      },
      {
        heading: "Contact and updates",
        body: [
          `Students may contact ${businessInfo.phone} or ${businessInfo.email} for privacy-related questions or correction requests.`,
          "This policy may be updated when services, legal requirements, or operational processes change.",
        ],
      },
    ],
  },
  delivery: {
    eyebrow: "Delivery",
    title: "Delivery Policy",
    description: "This policy explains how online and offline classes, resources, and student access are delivered after enrollment or payment review.",
    sections: [
      {
        heading: "Online delivery",
        body: [
          "For online programs, class access, dashboard features, tests, and digital resources are delivered through the student portal or official communication channels after enrollment and payment approval.",
          "Students are responsible for maintaining a working internet connection, compatible device, and access to the contact channels used for class updates.",
        ],
      },
      {
        heading: "Offline delivery",
        body: [
          `For offline programs, physical classes are delivered at ${businessInfo.address} or at the class location announced for the selected batch.`,
          "Students should follow the published schedule, batch instructions, and any class-location updates shared by Magician's School.",
        ],
      },
      {
        heading: "Activation timeline",
        body: [
          "Manual payment submissions remain pending until an administrator reviews the transaction ID or bank reference.",
          "Class access and resources are activated after successful admin approval. If approval is delayed, students should contact support with their transaction reference.",
        ],
      },
    ],
  },
};
