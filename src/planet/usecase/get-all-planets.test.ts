import planetDataSource from "../data-access/planet-db"
import Planet from "../entity/planet"
import makeGetAllPlanets from "./get-all-planets"

describe("getAllPlanets", () => {
  let getAllPlanets: ReturnType<typeof makeGetAllPlanets>
  let mockPlanetRepo: ReturnType<typeof planetDataSource>

  const mockPlanets: Planet[] = [
    {
      planet: "Earth",
      neighbours: [],
      movementDifficulty: 0,
      resource: undefined,
    },
    {
      planet: "Mars",
      neighbours: [],
      movementDifficulty: 0,
      resource: undefined,
    },
  ]

  beforeEach(() => {
    mockPlanetRepo = planetDataSource()
    getAllPlanets = makeGetAllPlanets({ planetRepo: mockPlanetRepo })

    mockPlanetRepo.savePlanet(mockPlanets[0])
    mockPlanetRepo.savePlanet(mockPlanets[1])

    mockPlanetRepo.savePlanetForRobot("robot1", "Earth")
    mockPlanetRepo.savePlanetForRobot("robot1", "Mars")
  })

  it("should return all planets for a given robot ID", async () => {
    const planets = await getAllPlanets("robot1")

    expect(planets).toEqual(["Earth", "Mars"])
  })

  it("should return an empty array if no planets are found for the given robot ID", async () => {
    const planets = await getAllPlanets("unknownRobot")

    expect(planets).toEqual([])
  })

  it("should throw an error if an invalid robot ID is provided", async () => {
    expect.assertions(1)
    try {
      await getAllPlanets(null as any)
    } catch (e: any) {
      expect(e.message).toBe("Invalid robot ID")
    }
  })
})
