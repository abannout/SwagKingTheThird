import { Planet } from "../../common/types" // Passen Sie den Pfad an
import planetDataSource from "../data-access/planet-db"
import PlanetNeighbour from "../entity/planet-neighbour"
import makeGetPlanetNeighbours from "./get-neighbours"

describe("getPlanetNeighbours", () => {
  let getPlanetNeighbours: ReturnType<typeof makeGetPlanetNeighbours>
  let mockPlanetRepo: ReturnType<typeof planetDataSource>
  const neighbour1: PlanetNeighbour = {
    id: "neighbour1",
    direction: "NORTH",
  }
  const neighbour2: PlanetNeighbour = {
    id: "neighbour2",
    direction: "WEST",
  }
  beforeEach(() => {
    mockPlanetRepo = planetDataSource()
    getPlanetNeighbours = makeGetPlanetNeighbours({
      planetRepo: mockPlanetRepo,
    })

    mockPlanetRepo.savePlanet({
      planet: "Earth",
      neighbours: [neighbour1, neighbour2],
      movementDifficulty: 0,
      resource: undefined,
    })
  })

  it("should return the correct neighbours for a given planet ID", async () => {
    const neighbours = await getPlanetNeighbours("Earth")

    expect(neighbours).toEqual([neighbour1, neighbour2])
  })

  it("should throw an error if the planet ID does not exist", async () => {
    expect.assertions(1)
    try {
      await getPlanetNeighbours("UnknownPlanet")
    } catch (e: any) {
      expect(e.message).toBe("planet with ID UnknownPlanet not found")
    }
  })
})
