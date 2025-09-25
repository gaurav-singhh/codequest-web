import { NextRequest, NextResponse } from "next/server";
import { SubmissionInput } from "@codequest/common/zod";
import { getProblem } from "../../lib/problems";
import { JUDGE0_URI, X_RAPIDAPI_HOST, X_RAPIDAPI_KEY } from "../../lib/config";
import axios from "axios";
import { LANGUAGE_MAPPING } from "@codequest/common/language";
import { db } from "../../db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

// TODO: This should be heavily rate limited
export async function POST(req: NextRequest) {
  console.log("Received submission request");
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("User not authenticated");
      return NextResponse.json(
        {
          message: "You must be logged in to submit a problem",
        },
        {
          status: 401,
        }
      );
    }

    const submissionInput = SubmissionInput.safeParse(await req.json());
    if (!submissionInput.success) {
      console.error("Invalid input:", submissionInput.error);
      return NextResponse.json(
        {
          message: "Invalid input",
        },
        {
          status: 400,
        }
      );
    }

    const dbProblem = await db.problem.findUnique({
      where: {
        id: submissionInput.data.problemId,
      },
    });

    if (!dbProblem) {
      console.error(
        "Problem not found for id:",
        submissionInput.data.problemId
      );
      return NextResponse.json(
        {
          message: "Problem not found",
        },
        {
          status: 404,
        }
      );
    }

    const problem = await getProblem(
      dbProblem.slug,
      submissionInput.data.languageId
    );
    problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace(
      "##USER_CODE_HERE##",
      submissionInput.data.code
    );

    const submissions = problem.inputs.map((input, index) => ({
      language_id: LANGUAGE_MAPPING[submissionInput.data.languageId]?.judge0,
      source_code: problem.fullBoilerplateCode,
      stdin: input,
      expected_output: problem.outputs[index],
      callback_url:
        process.env.JUDGE0_CALLBACK_URL
        
    }));

    console.log(
      "Sending data to Judge0:",
      JSON.stringify({ submissions }, null, 2)
    );
    console.log(
      "Judge0 URI:",
      `${JUDGE0_URI}/submissions/batch?base64_encoded=false`
    );
    console.log("RapidAPI Host:", X_RAPIDAPI_HOST);

    const response = await axios.post(
      `${JUDGE0_URI}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      },
      {
        headers: {
          "X-RapidAPI-Key": X_RAPIDAPI_KEY,
          "X-RapidAPI-Host": X_RAPIDAPI_HOST,
        },
      }
    );

    console.log("Received response from Judge0:", {
      status: response.status,
      data: response.data,
    });

    const submission = await db.submission.create({
      data: {
        userId: session.user.id,
        problemId: submissionInput.data.problemId,
        languageId:
          LANGUAGE_MAPPING[submissionInput.data.languageId]?.internal!,
        code: submissionInput.data.code,
        fullCode: problem.fullBoilerplateCode,
        status: "PENDING",
        activeContestId: submissionInput.data.activeContestId,
      },
    });

    await db.testCase.createMany({
      data: problem.inputs.map((input, index) => ({
        submissionId: submission.id,
        status: "PENDING",
        index,
        judge0TrackingId: response.data[index].token,
      })),
    });

    console.log("Submission created in DB with id:", submission.id);
    return NextResponse.json(
      {
        message: "Submission made",
        id: submission.id,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error in /api/submission:", e);
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    if (axios.isAxiosError(e)) {
      console.error("Axios error details:", e.response?.data);
    }
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        message: "You must be logged in to view submissions",
      },
      {
        status: 401,
      }
    );
  }
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.search);
  const submissionId = searchParams.get("id");

  if (!submissionId) {
    return NextResponse.json(
      {
        message: "Invalid submission id",
      },
      {
        status: 400,
      }
    );
  }

  const submission = await db.submission.findUnique({
    where: {
      id: submissionId,
      userId: session.user.id,
    },
  });

  if (!submission) {
    return NextResponse.json(
      {
        message: "Submission not found",
      },
      {
        status: 404,
      }
    );
  }

  const testCases = await db.testCase.findMany({
    where: {
      submissionId: submissionId,
    },
  });

  return NextResponse.json(
    {
      submission,
      testCases,
    },
    {
      status: 200,
    }
  );
}
