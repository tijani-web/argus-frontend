// API layer — all calls go to the real backend at localhost:8100.
// next.config.ts proxies /api/v1/* and /actuator/* → localhost:8100

const BASE = ""; // proxied by next.config.ts rewrites

export const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

// ─────────────────────────────────────────────────────────────────────────────
// Types that EXACTLY mirror the Spring Boot backend response shapes
// ─────────────────────────────────────────────────────────────────────────────

/** Matches the JPA ApiKey entity returned inside a Project */
interface ApiKeyEntity {
  id: string;
  keyValue: string;      // the "argus_live_..." key string
  active: boolean;
  createdAt: string;
}

/** Matches the JPA Project entity returned by /api/v1/projects */
interface ProjectEntity {
  id: string;
  name: string;
  createdAt: string;
  user: { id: string; email: string; createdAt: string };
  apiKeys: ApiKeyEntity[];
}

/** Flattened Project shape used throughout the frontend */
export interface Project {
  id: string;
  name: string;
  userId: string;
  apiKey: string;        // extracted from apiKeys[0].keyValue
  createdAt: string;
}

/**
 * Matches DashboardController.DashboardStats record exactly:
 *   { totalEvents, errorEvents, eventsByType }
 */
export interface LiveCounters {
  totalEvents: number;
  errorEvents: number;
  eventsByType: Record<string, number>;
}

/**
 * Matches DashboardController.AggregationPoint record exactly:
 *   { time, eventType, eventCount }
 */
export interface SeriesBucket {
  time: string;        // Instant serialised as ISO string
  eventType: string;
  eventCount: number;
}

/** Matches AuthResponse record returned by /api/v1/users/signup and /login */
export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Maps the raw backend ProjectEntity shape to our flat Project type */
function mapProject(raw: ProjectEntity): Project {
  return {
    id: raw.id,
    name: raw.name,
    userId: raw.user?.id ?? "",
    apiKey: raw.apiKeys?.[0]?.keyValue ?? "",
    createdAt: raw.createdAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API functions
// ─────────────────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<{ status: string }> {
  const res = await fetch(`${BASE}/actuator/health`);
  if (!res.ok) throw new Error("Backend unreachable");
  return res.json();
}

/**
 * Creates a brand new account. Returns 409 if the email is already registered.
 */
export async function signupUser(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/api/v1/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 409) throw new Error("An account with this email already exists.");
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Signup failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Validates existing credentials. Returns 401 for wrong email/password.
 */
export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error("Invalid email or password.");
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Login failed: ${res.status}`);
  }
  return res.json();
}

export async function getProjects(userId: string): Promise<Project[]> {
  const res = await fetch(`${BASE}/api/v1/projects/user/${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  const raw: ProjectEntity[] = await res.json();
  return raw.map(mapProject);
}

export async function createProject(
  userId: string,
  name: string
): Promise<Project> {
  const res = await fetch(`${BASE}/api/v1/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name }),
  });
  if (!res.ok) throw new Error(`Failed to create project: ${res.status}`);
  const raw: ProjectEntity = await res.json();
  return mapProject(raw);
}

export async function getLiveCounters(userId: string, projectId?: string): Promise<LiveCounters> {
  const url = projectId 
    ? `${BASE}/api/v1/dashboard/counters?userId=${userId}&projectId=${projectId}`
    : `${BASE}/api/v1/dashboard/counters?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch counters: ${res.status}`);
  return res.json();
}

export async function getHistoricalSeries(userId: string, projectId?: string, eventType?: string, limit: number = 500): Promise<SeriesBucket[]> {
  let url = projectId
    ? `${BASE}/api/v1/dashboard/series?userId=${userId}&projectId=${projectId}&limit=${limit}`
    : `${BASE}/api/v1/dashboard/series?userId=${userId}&limit=${limit}`;
  
  if (eventType) url += `&eventType=${eventType}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch series: ${res.status}`);
  return res.json();
}

export interface RawEvent {
  time: string;
  event_type: string;
  payload: any;
}

export async function getRawEvents(userId: string, projectId?: string, limit: number = 50, eventType?: string, country?: string): Promise<RawEvent[]> {
  let url = projectId
    ? `${BASE}/api/v1/dashboard/events?userId=${userId}&projectId=${projectId}&limit=${limit}`
    : `${BASE}/api/v1/dashboard/events?userId=${userId}&limit=${limit}`;
  
  if (eventType) url += `&eventType=${eventType}`;
  if (country) url += `&country=${country}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch raw events: ${res.status}`);
  return res.json();
}

export async function getCountries(userId: string, projectId?: string): Promise<{ country: string; count: number }[]> {
  const url = projectId
    ? `${BASE}/api/v1/dashboard/countries?userId=${userId}&projectId=${projectId}`
    : `${BASE}/api/v1/dashboard/countries?userId=${userId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch countries: ${res.status}`);
  return res.json();
}
