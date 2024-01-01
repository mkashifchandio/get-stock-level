import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import { promises as fsPromises } from "fs";
import fileUtils from "../../utils/file.utils";

describe("File Utils", () => {
  describe("readFiles", () => {
    it("should read multiple files and return their contents", async () => {
      const readFileStub = sinon.stub(fsPromises, "readFile") as SinonStub<
        [string, string],
        Promise<string>
      >;

      const filePaths: string[] = ["file1.txt", "file2.txt"];
      const expectedFileContents: string[] = [
        "File 1 content",
        "File 2 content",
      ];

      readFileStub.callsFake((filePath: string) => {
        const index = filePaths.indexOf(filePath);
        return Promise.resolve(expectedFileContents[index]);
      });

      const files = await fileUtils.readFiles(filePaths);

      expect(files).to.deep.equal(expectedFileContents);
      expect(readFileStub.callCount).to.equal(filePaths.length);
      expect(readFileStub.args).to.deep.equal([
        ["file1.txt", "utf8"],
        ["file2.txt", "utf8"],
      ]);

      readFileStub.restore();
    });

    it("should throw an error if file reading fails", async () => {
      const readFileStub = sinon
        .stub(fsPromises as any, "readFile")
        .rejects(new Error("Read error"));

      const filePaths: string[] = ["file1.txt"];

      try {
        await fileUtils.readFiles(filePaths);
        expect.fail("Unexpected readFile() success.");
      } catch (error) {
        expect(error).to.be.an.instanceof(Error);
      } finally {
        readFileStub.restore();
      }
    });
  });
});
