import logger from "../../../utils/logger"
import * as relay from "../../../common/net/relay"
import { addPlanet } from "../../usecase/index"
import { handleAddPlanet } from "./add-planet"
import { GameEvent } from "../../../common/types"
import Planet from "../../entity/planet"

jest.mock("../../../utils/logger")
jest.mock("../../usecase/index")

describe("handleAddPlanet", () => {
  let handleAddPlanetInstance: ReturnType<typeof handleAddPlanet>

  const mockEvent: GameEvent<Planet> = {
    headers: {
      type: "PlanetDiscovered",
      eventId: "",
      timestamp: "",
      "kafka-topic": "",
    },
    payload: {
      planet: "Mars",
      neighbours: [
        { direction: "EAST", id: "EARTH" },
        { direction: "EAST", id: "VENUS" },
      ],
      movementDifficulty: 1,
      resource: {
        type: "COAL",
        maxAmount: 100,
        currentAmount: 100,
      },
    },
  }

  const mockContext: relay.RelayContext = {
    playerId: "",
    playerExchange: "",
  }

  beforeEach(() => {
    handleAddPlanetInstance = handleAddPlanet()

    logger.info = jest.fn()

    jest.spyOn(relay, "on").mockImplementation((event, callback) => {
      if (event === "PlanetDiscovered") {
        callback(mockEvent, mockContext)
      }
    })
    ;(addPlanet as jest.Mock).mockResolvedValue(Promise.resolve())
  })

  it("should log planet discovery and call addPlanet with correct payload", async () => {
    await handleAddPlanetInstance()

    expect(relay.on).toHaveBeenCalledWith(
      "PlanetDiscovered",
      expect.any(Function)
    )

    expect(logger.info).toHaveBeenCalledWith(
      `Planet with id: Mars been discovered mit den Nachberen [{"direction":"EAST","id":"EARTH"},{"direction":"EAST","id":"VENUS"}]`
    )

    expect(addPlanet).toHaveBeenCalledWith(mockEvent.payload)
  })
})
