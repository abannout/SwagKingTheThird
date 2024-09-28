import { PlanetDependencies } from "../../common/dependencies/planet-dependency"

export default function makeGetAllPlanets({ planetRepo }: PlanetDependencies) {
  return async (robotId: string): Promise<string[]> => {
    if (!robotId) {
      throw new Error("Invalid robot ID")
    }
    return await planetRepo.getPlanetsForRobotId(robotId)
  }
}
