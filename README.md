# Overview
This project is built using Node.js and TypeScript, following a hexagonal architecture (also known as Ports and Adapters architecture). The project manages entities such as robots and planets in a game-like, event-driven environment. Hexagonal architecture allows the core business logic to remain independent of external services or infrastructure, making the system more flexible and easier to test, maintain, and scale.

## Hexagonal Architecture
Hexagonal architecture aims to separate the application's core business logic from its dependencies. The project follows this approach by clearly separating different layers:

Core Domain (Business Logic): The core logic of the project is encapsulated in use cases and entities within the src/ directory. The logic governing robots, planets, and trading is the heart of the system, and this logic is decoupled from infrastructure details.

**For example:**

- The `robot/` module contains the logic for managing robots (e.g., adding or updating them).
- The `planet/` module handles the business rules for adding and interacting with planets.
- Ports (Interfaces): These are abstractions or contracts that define how external services will interact with the core business logic. For example, the `robotRepo` in `update-robot.ts` is a dependency injected into the use case, allowing the robot repository to be swapped out without affecting the core logic.

```typescript
interface Dependencies {
  robotRepo: RobotRepository
}
```
- **Adapters (Infrastructure)**: The adapters act as implementations of these interfaces and external services, such as databases, networking, or other APIs. The src/common/net and src/trading/data-access modules implement these infrastructure concerns. These parts of the system connect the core business logic to the outer world, such as database interactions (e.g., planet-db.ts) or handling network relays (e.g., client.js in common/net/).

**By adhering to hexagonal architecture principles, the project ensures:**

- Business logic remains independent of infrastructure.
- Easy testing of core use cases without needing to rely on real services.
- Flexibility to switch external services without modifying the core.
- Tests
- The project employs unit testing to ensure the correctness of individual modules. Testing is facilitated by the separation of concerns, with the use of dependency injection allowing mock services to be used during tests.

Test files can be found next to their respective modules, particularly within the `src/` directory. For instance, the following files indicate the presence of tests:

`src/planet/application/interactors/add-planet.test.ts`
`src/robot/usecase/update-robot.test.ts`
These test files focus on verifying the behavior of the use cases, ensuring that each component works as expected in isolation. The jest.config.js file suggests the use of Jest as the testing framework, which is commonly used in Node.js environments.

**Example of a test:**

```typescript
test('should update robot when robot exists', async () => {
  const robotRepo = { getRobot: jest.fn(), updateRobot: jest.fn() }
  const updateRobot = makeUpdateRobot({ robotRepo })

  const robot = new Robot('123')
  robotRepo.getRobot.mockResolvedValue(robot)

  await updateRobot(robot)

  expect(robotRepo.updateRobot).toHaveBeenCalledWith(robot)
})
```
This test checks that the robot repository's updateRobot function is called correctly when a valid robot is provided.

## Modules and Separation
The project is split into well-defined modules, ensuring a clear separation of concerns:

Robot Module (src/robot):

Entities: The robot entity defines the structure and behavior of robots in the system.
Use Cases: Business rules governing the interaction with robots (e.g., update-robot.ts) are encapsulated in use cases.
Repositories: The robotRepo handles data storage and retrieval related to robots.
Planet Module (src/planet):

Entities: The planet entity contains data and behavior associated with planets.
Use Cases: Business logic related to planets, such as adding new planets (add-planet.ts).
Data Access: planet-db.ts defines how planet data is stored and retrieved from the database.
Trading Module (src/trading):

Manages the financial transactions and bank interactions within the system. It contains commands for buying robots, upgrading them, and handling resource selling.
Common Module (src/common):

Net: Contains network-related functionality (e.g., client.js and relay.js) for managing external communications.
Purchasing: Handles common purchasing logic (e.g., money.js).
Utility Module (src/utils):

Contains helper functions, such as logger.ts for logging and errorHandler.ts for managing errors, used across the project.
Each module is responsible for a specific domain in the system, ensuring that changes in one area do not affect others. The use of dependency injection also aids in maintaining this separation, as external dependencies are injected into the business logic, making it easier to modify or test without altering the core logic.
## DBs:
The project has an existing connection with Neo4j for handling planets and a Supabase database for managing robots.
Currently, the project uses local memory as the default database.
The Supabase connection is already set up. To start using it, the programmer needs to provide their API key and URL for their Supabase project.
## toDo:
- Refactor the codebase to improve structure and performance.
- Demonstrate how to connect multiple databases, e.g., adding MongoDB for a trading system as part of the ports and adapters architecture.
- Improve the strategy pattern for handling the different systems.
- Fully implement Neo4j for managing the map and planets.
## Common issues:
An error message appears in the console: "Planet with id: xxx not found". Despite this, robots are still moving to the planet, and the planet does exist. The root cause is currently unknown, but it is likely due to the command being sent before the PlanetDiscovered event is received from the map service.

## Summary
The project uses a clean, modular structure based on hexagonal architecture, ensuring separation between core business logic and external dependencies. The code is organized into several distinct modules, each responsible for a different domain within the system. Testing is facilitated through the use of unit tests, primarily focusing on core business logic and ensuring that external dependencies can be mocked. This approach ensures that the system is flexible, maintainable, and scalable for future enhancements or changes in infrastructure.
