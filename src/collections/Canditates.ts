import { CollectionConfig } from 'payload';
import { PayloadRequest } from 'payload';

const Candidates: CollectionConfig = {
    slug: 'candidates',
    labels: {
        singular: 'Candidate',
        plural: 'Candidates',
    },
    admin: {
        useAsTitle: 'fullName',
        defaultColumns: ['fullName', 'email', 'skills'],
    },
    access: {
        create: ({ req }) => true,
        read: ({ req }) => ['admin', 'reviewer'].includes(req.user?.role ?? ''),
        update: ({ req }) => req.user?.role === 'admin',
        delete: ({ req }) => req.user?.role === 'admin',
    },
    fields: [
        {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            validate: (value: string | null | undefined): true | string => {
                if (!value || typeof value !== 'string') {
                    return 'Please enter a valid email address.';
                }
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return 'Please enter a valid email address.';
                }
                return true;
            },
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'phoneNumber',
            label: 'Phone Number',
            type: 'text',
            required: false,
            validate: (value: unknown): true | string => {
                if (!value || typeof value !== 'string') return true;

                const phoneRegex = /^\+?\d{8,15}$/;

                if (!phoneRegex.test(value)) {
                    return 'Enter a valid phone number';
                }

                return true;
            },
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'linkedinProfile',
            label: 'LinkedIn Profile',
            type: 'text',
            required: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'hasPriorExperience',
            label: 'Do you have prior experience?',
            type: 'select',
            required: true,
            options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'yearsOfExperience',
            label: 'Years of Experience',
            type: 'number',
            required: false,
            admin: {
                condition: ({ data }) => true,
            },
        },
        {
            name: 'skills',
            label: 'Skills',
            type: 'array',
            required: true,
            fields: [
                {
                    name: 'tag',
                    type: 'text',
                    label: 'Skill',
                },
            ],
        },
        {
            name: 'resume',
            label: 'Resume / CV Upload',
            type: 'upload',
            relationTo: 'media',
            required: true,
            admin: {
                description: 'Upload a PDF or DOCX file (max 5MB).',
            },
            validate: async (
                val: unknown,
                { req }: { req: PayloadRequest }
            ): Promise<true | string> => {
                if (!val || typeof val !== 'string') {
                    return 'Please upload a resume.';
                }

                const mediaDoc = await req.payload.findByID({
                    collection: 'media',
                    id: val,
                });

                if (!mediaDoc) {
                    return 'Invalid file uploaded.';
                }

                const maxSize = 5 * 1024 * 1024; // 5MB

                if (mediaDoc.filesize && mediaDoc.filesize > maxSize) {
                    return 'File size must be less than 5MB.';
                }

                return true;
            },
            filterOptions: {
                mimeType: {
                    in: [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    ],
                },
            },
        },
        {
            name: 'whyGoodFit',
            label: 'Why are you a good fit?',
            type: 'textarea',
            required: true,
        },
        {
            name: 'availability',
            label: 'Availability',
            type: 'text',
            required: false,
        },
        {
            name: 'notes',
            label: 'Notes (Internal)',
            type: 'textarea',
            required: false,
            admin: {
                readOnly: true,
            },
        },
    ],
};

export default Candidates;
