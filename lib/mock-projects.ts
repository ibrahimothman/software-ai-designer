/** Represents a single project in the mock dataset. */
export interface MockProject {
  /** Unique identifier for the project. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** URL-safe slug derived from the name. */
  slug: string;
  /** True when the current user owns this project; false for collaborator projects. */
  isOwned: boolean;
}

/** Static mock projects used until the real persistence layer is wired. */
export const MOCK_PROJECTS: MockProject[] = [
  { id: '1', name: 'E-Commerce Platform', slug: 'e-commerce-platform', isOwned: true },
  { id: '2', name: 'Auth Service', slug: 'auth-service', isOwned: true },
  { id: '3', name: 'Data Pipeline', slug: 'data-pipeline', isOwned: false },
  { id: '4', name: 'Mobile App Backend', slug: 'mobile-app-backend', isOwned: false },
];
