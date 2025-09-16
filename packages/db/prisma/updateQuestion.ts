import { LANGUAGE_MAPPING } from "@codequest/common/language";
import fs from "fs";
import { prismaClient } from "../src";

const MOUNT_PATH = process.env.MOUNT_PATH ?? "../../problems";
function promisifedReadFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function main(problemSlug: string) {
  const problemStatement = await promisifedReadFile(
    `${MOUNT_PATH}/${problemSlug}/Problem.md`
  );

  const problem = await prismaClient.problem.upsert({
    where: {
      slug: problemSlug,
    },
    create: {
      title: problemSlug.split("-").join(" ").toLocaleUpperCase(),
      slug: problemSlug,
      description: problemStatement,
    },
    update: {
      description: problemStatement,
      title: problemSlug.split("-").join(" ").toLocaleUpperCase(),
    },
  });

  await Promise.all(
    Object.keys(LANGUAGE_MAPPING).map(async (language) => {
      const languageInfo =
        LANGUAGE_MAPPING[language as keyof typeof LANGUAGE_MAPPING];
      if (!languageInfo) {
        return;
      }
      const code = await promisifedReadFile(
        `${MOUNT_PATH}/${problemSlug}/boilerplate/function.${language}`
      );
      await prismaClient.defaultCode.upsert({
        where: {
          problemId_languageId: {
            problemId: problem.id,
            languageId: languageInfo.internal,
          },
        },
        create: {
          problemId: problem.id,
          languageId: languageInfo.internal,
          code,
        },
        update: {
          code,
        },
      });
    })
  );
}

main(process.env.PROBLEM_SLUG!);
