import { CollectionConfig } from 'payload';

const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'role'],
  },
  access: {
    create: ({ req }) => req.user?.role === 'admin',
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true;
      return {
        id: {
          equals: req.user?.id,
        },
      };
    },
    update: ({ req }) => {
      return req.user?.role === 'admin';
    },
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
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      defaultValue: 'reviewer',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Reviewer',
          value: 'reviewer',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      label: 'Internal Notes',
      type: 'textarea',
      admin: {
        condition: ({ user }) => user?.role === 'admin',
        readOnly: true,
      },
      access: {
        read: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
};

export default Users;
