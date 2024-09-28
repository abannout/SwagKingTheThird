import planetDataSource from "../data-access/planet-db"
import makeSavePlanetForRobot from "./save-planet-robot"

describe("savePlanetForRobot", () => {
  let savePlanetForRobot: ReturnType<typeof makeSavePlanetForRobot>
  let mockPlanetRepo: ReturnType<typeof planetDataSource>

  beforeEach(() => {
    mockPlanetRepo = planetDataSource()
    savePlanetForRobot = makeSavePlanetForRobot({ planetRepo: mockPlanetRepo })
  })

  it("should save the planet for the given robot ID", async () => {
    const robotId = "robot1"
    const planetId = "planet123"

    await savePlanetForRobot(robotId, planetId)

    const planetsForRobot = await mockPlanetRepo.getPlanetsForRobotId(robotId)
    expect(planetsForRobot).toContain(planetId)
  })

  it("should throw an error if saving the planet for the robot fails", async () => {
    const robotId = "robot1"
    const planetId = "planet123"

    jest.spyOn(mockPlanetRepo, "savePlanetForRobot").mockImplementation(() => {
      throw new Error("Failed to save planet for robot")
    })

    expect.assertions(1)
    try {
      await savePlanetForRobot(robotId, planetId)
    } catch (e: any) {
      expect(e.message).toBe("Failed to save planet for robot")
    }
  })
})
