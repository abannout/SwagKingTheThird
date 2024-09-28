import logger from "../../../utils/logger"
import * as relay from "../../../common/net/relay"
import { updatePlanet } from "../../usecase/index"
import { makeRemovePlanetResource } from "./remove-planet-resource"
import { GameEvent, ResourceMined } from "../../../common/types"

jest.mock("../../../utils/logger")
jest.mock("../../usecase/index")

describe("makeRemovePlanetResource", () => {
  let removePlanetResourceInstance: ReturnType<typeof makeRemovePlanetResource>

  // Mock event matching the expected structure
  const mockEvent: GameEvent<ResourceMined> = {
    headers: {
      type: "ResourceMined",
      eventId: "",
      timestamp: "",
      "kafka-topic": "",
    },
    payload: {
      planet: "Mars",
      minedAmount: 50,
      resource: {
        type: "COAL",
        maxAmount: 100,
        currentAmount: 50,
      },
    },
  }

  const mockContext: relay.RelayContext = {
    playerId: "",
    playerExchange: "",
  }

  beforeEach(() => {
    removePlanetResourceInstance = makeRemovePlanetResource()

    logger.info = jest.fn()

    jest.spyOn(relay, "on").mockImplementation((event, callback) => {
      if (event === "ResourceMined") {
        callback(mockEvent, mockContext)
      }
    })
    ;(updatePlanet as jest.Mock).mockResolvedValue(Promise.resolve())
  })

  it("should log resource mined and call updatePlanet with correct payload", async () => {
    await removePlanetResourceInstance()

    expect(relay.on).toHaveBeenCalledWith("ResourceMined", expect.any(Function))

    expect(logger.info).toHaveBeenCalledWith(
      `50 COAL from Planet with id: Mars have been mined`
    )

    expect(updatePlanet).toHaveBeenCalledWith(
      mockEvent.payload.planet,
      mockEvent.payload.resource
    )
  })
})
