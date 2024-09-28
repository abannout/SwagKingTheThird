import neo4j from "neo4j-driver"

const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "swagkingontop")
)

export async function testConnection() {
  const session = driver.session()

  try {
    // Run a simple Cypher query
    const result = await session.run(
      'RETURN "Connection successful!" AS message'
    )

    // Log the result
    const record = result.records[0]
    const message = record.get("message")
    console.log(message)
  } catch (error) {
    console.error("Connection failed:", error)
  } finally {
    // Close the session
    await session.close()
    // Close the driver
    await driver.close()
  }
}
