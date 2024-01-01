import { promises as fsPromises } from "fs";

export default {
  readFiles: async (filePaths: string[]): Promise<string[]> => {
    try {
      const files = await Promise.all(
        filePaths.map((filePath) => fsPromises.readFile(filePath, "utf8"))
      );
      return files;
    } catch (error) {
      console.error("Error in reading files.", error);
      throw error;
    }
  },
};
