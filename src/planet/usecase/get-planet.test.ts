import planetDataSource from "../data-access/planet-db"
import Planet from "../entity/planet"
import makeGetPlanet from "./get-planet"

describe("getPlanet", () => {
  let getPlanet: ReturnType<typeof makeGetPlanet>
  let mockPlanetRepo: ReturnType<typeof planetDataSource>

  const mockPlanet: Planet = {
    planet: "Earth",
    neighbours: [],
    movementDifficulty: 0,
    resource: undefined,
  }

  beforeEach(() => {
    mockPlanetRepo = planetDataSource()
    getPlanet = makeGetPlanet({ planetRepo: mockPlanetRepo })

    mockPlanetRepo.savePlanet(mockPlanet)
  })

  it("should return the correct planet for a given planet ID", async () => {
    const planet = await getPlanet("Earth")

    expect(planet).toEqual(mockPlanet)
  })

  it("should throw an error if the planet ID does not exist", async () => {
    expect.assertions(1)
    try {
      await getPlanet("UnknownPlanet")
    } catch (e: any) {
      expect(e.message).toBe("planet with ID UnknownPlanet not found")
    }
  })
})
