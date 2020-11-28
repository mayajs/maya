import { ModelDictionary, DatabaseModule } from "../interfaces";

interface DatabaseList<T, U> {
  [x: string]: { instance: T; models: ModelDictionary<U> };
}

const dbList: DatabaseList<any, any> = {};

function addDatabase<T extends DatabaseModule, U>(db: T, models: ModelDictionary<U>): void {
  dbList[db.name] = {
    instance: db.instance,
    models,
  };
}

export { dbList };

/**
 * Connects all the database
 *
 * @param databases Array of database modules
 * @returns A Promise of void[]
 */
export function connectDatabase(databases: DatabaseModule[], hasLogs: boolean): Promise<void[]> {
  // Checks if there are any databases
  if (databases.length > 0) {
    // Return an array of connection promise
    return Promise.all(
      // Map databases
      databases.map(async (db: DatabaseModule) => {
        // Logs the connection if there is any
        db.connection(hasLogs);

        // Conencts to database
        return await db.connect().then(() => {
          const models = db.models();

          // Add database intance
          addDatabase(db, models);
        });
      })
    );
  }

  // Returns an empty array of promise
  return Promise.resolve([]);
}
