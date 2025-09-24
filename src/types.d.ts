declare global {
  // Global type declarations for browser environments
  const AmqpManagement: typeof import("./management.js").AmqpManagement
  const createEnvironment: typeof import("./environment.js").createEnvironment
  const AmqpEnvironment: typeof import("./environment.js").AmqpEnvironment
}
