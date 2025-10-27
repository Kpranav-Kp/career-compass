// Re-export the JSX implementation from AuthContext.jsx so bundlers that
// parse .js files don't choke on JSX. The actual implementation lives in
// AuthContext.jsx (same directory).
export { AuthProvider, useAuth } from './AuthContext.jsx';