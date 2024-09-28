import { ResourceDefinition } from "../../common/types"
import planetDataSource from "../data-access/planet-db"
import Planet from "../entity/planet"
import makeUpdatePlanet from "./update-planet"

describe("updatePlanet", () => {
  let updatePlanet: ReturnType<typeof makeUpdatePlanet>
  let mockPlanetRepo: ReturnType<typeof planetDataSource>

  const mockPlanet: Planet = {
    planet: "Earth",
    neighbours: [],
    movementDifficulty: 0,
    resource: undefined,
  }

  const mockResource: ResourceDefinition = {
    type: "COAL",
    maxAmount: 1000,
    currentAmount: 100,
  }

  beforeEach(() => {
    // Mock the planet repository
    mockPlanetRepo = planetDataSource()
    updatePlanet = makeUpdatePlanet({ planetRepo: mockPlanetRepo })

    // Save the mock planet in the repo
    mockPlanetRepo.savePlanet(mockPlanet)
  })

  it("should update the planet resource when the planet exists", async () => {
    const planetId = "Earth"

    // Call the function to update the resource
    await updatePlanet(planetId, mockResource)

    // Get the updated planet and check that the resource is updated
    const updatedPlanet = await mockPlanetRepo.getPlanet(planetId)
    expect(updatedPlanet.resource).toEqual(mockResource)
  })

  it("should throw an error if the planet does not exist", async () => {
    const planetId = "UnknownPlanet"

    expect.assertions(1)

    try {
      await updatePlanet(planetId, mockResource)
    } catch (e: any) {
      expect(e.message).toBe("planet with ID UnknownPlanet not found")
    }
  })
})
