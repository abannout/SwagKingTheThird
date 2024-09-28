import { jest } from "@jest/globals"
import Planet from "../entity/planet"
import planetDataSource from "../data-access/planet-db"
import makeAddPlanet from "./add-planet"

const mockPlanet: Planet = {
  planet: "Mars",
  neighbours: [],
  movementDifficulty: 0,
  resource: undefined,
}

describe("makeAddPlanet", () => {
  let planetRepo: ReturnType<typeof planetDataSource>
  let addPlanet: ReturnType<typeof makeAddPlanet>

  beforeEach(() => {
    planetRepo = planetDataSource()
    addPlanet = makeAddPlanet({ planetRepo })

    jest.spyOn(planetRepo, "savePlanet")
  })

  it("should call savePlanet with the provided planet", async () => {
    await addPlanet(mockPlanet)

    expect(planetRepo.savePlanet).toHaveBeenCalledTimes(1)

    expect(planetRepo.savePlanet).toHaveBeenCalledWith(mockPlanet)
    const savedPlanet = await planetRepo.getPlanet("Mars")
    expect(savedPlanet).toEqual(mockPlanet)
  })
})
