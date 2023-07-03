export type ResolvedSessionUser = {
  userId: string;
  tenantId: string;
  name: string;
  email: string;
};

export type ResolvedSession = {
  sessionId: string;
  tenantId: string;
  idleExpiresAt: Date;
  maxExpiresAt: Date;
  user: ResolvedSessionUser;
};
