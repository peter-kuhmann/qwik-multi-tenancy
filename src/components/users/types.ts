export type UserTableEntry = {
  userId: string;
  name: string;
  email: string;
  tenant: {
    tenantId: string;
    name: string;
  };
};
