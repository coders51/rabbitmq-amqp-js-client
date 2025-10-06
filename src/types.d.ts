declare global {
  const AmqpManagement: typeof import("./management.js").AmqpManagement
  const createEnvironment: typeof import("./environment.js").createEnvironment
  const AmqpEnvironment: typeof import("./environment.js").AmqpEnvironment
}
