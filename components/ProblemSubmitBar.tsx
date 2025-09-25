"use client";
import Editor from "@monaco-editor/react";
import { Tabs, TabsList, TabsTrigger } from "@codequest/ui/tabs";
import { Button } from "@codequest/ui/button";
import { Label } from "@codequest/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@codequest/ui/select";
import { useEffect, useState } from "react";
import { LANGUAGE_MAPPING } from "@codequest/common/language";
import axios from "axios";
import { ISubmission, SubmissionTable } from "./SubmissionTable";
import { CheckIcon, CircleX, ClockIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

enum SubmitStatus {
  SUBMIT = "SUBMIT",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  FAILED = "FAILED",
}

export interface IProblem {
  id: string;
  title: string;
  description: string;
  slug: string;
  defaultCode: {
    languageId: number;
    code: string;
  }[];
}

export const ProblemSubmitBar = ({
  problem,
  contestId,
}: {
  problem: IProblem;
  contestId?: string;
}) => {
  const [activeTab, setActiveTab] = useState("problem");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Tabs
              defaultValue="problem"
              className="rounded-md p-1"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="problem">Submit</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
          <SubmitProblem problem={problem} contestId={contestId} />
        </div>
        {activeTab === "submissions" && <Submissions problem={problem} />}
      </div>
    </div>
  );
};

function Submissions({ problem }: { problem: IProblem }) {
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `/api/submission/bulk?problemId=${problem.id}`
      );
      setSubmissions(response.data.submissions || []);
    };
    fetchData();
  }, []);
  return (
    <div>
      <SubmissionTable submissions={submissions} />
    </div>
  );
}

function SubmitProblem({
  problem,
  contestId,
}: {
  problem: IProblem;
  contestId?: string;
}) {
  const [language, setLanguage] = useState(
    Object.keys(LANGUAGE_MAPPING)[0] as string
  );
  const [code, setCode] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
  const [testcases, setTestcases] = useState<any[]>([]);

  useEffect(() => {
    const defaultCode: { [key: string]: string } = {};
    problem.defaultCode.forEach((code) => {
      const language = Object.keys(LANGUAGE_MAPPING).find(
        (language) => LANGUAGE_MAPPING[language]?.internal === code.languageId
      );
      if (!language) return;
      defaultCode[language] = code.code;
    });
    setCode(defaultCode);
  }, [problem]);

  // --- MODIFIED LOGIC ---
  async function pollWithBackoff(
    id: string,
    retries: number,
    delay: number // 1. Added delay parameter
  ) {
    if (retries === 0) {
      setStatus(SubmitStatus.SUBMIT);
      toast.error("Not able to get status ");
      return;
    }

    try {
        const response = await axios.get(`/api/submission/?id=${id}`);
        
        if (response.data.submission.status === "PENDING") {
            setTestcases(response.data.testCases);
            // 2. Use the dynamic delay value
            await new Promise((resolve) => setTimeout(resolve, delay));
            // 3. Increase the delay for the next poll (e.g., multiply by 1.5)
            pollWithBackoff(id, retries - 1, delay * 2);
        } else {
            if (response.data.submission.status === "AC") {
                setStatus(SubmitStatus.ACCEPTED);
                setTestcases(response.data.testCases);
                toast.success("Accepted!");
            } else {
                setStatus(SubmitStatus.FAILED);
                toast.error("Failed :(");
                setTestcases(response.data.testCases);
            }
        }
    } catch (error) {
        // Added basic error handling for the polling request
        setStatus(SubmitStatus.FAILED);
        toast.error("Error fetching submission status.");
    }
  }
  // --- END OF MODIFIED LOGIC ---

  async function submit() {
    setStatus(SubmitStatus.PENDING);
    setTestcases((t) => t.map((tc) => ({ ...tc, status: "PENDING" })));
    const response = await axios.post(`/api/submission/`, {
      code: code[language],
      languageId: language,
      problemId: problem.id,
      activeContestId: contestId,
    });
    // 4. Start polling with an initial delay (e.g., 1500ms)
    const INITIAL_DELAY = 1500;
    pollWithBackoff(response.data.id, 10, INITIAL_DELAY);
  }

  return (
    <div>
      <Label htmlFor="language">Language</Label>
      <Select
        value={language}
        defaultValue="cpp"
        onValueChange={(value) => setLanguage(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(LANGUAGE_MAPPING).map((language) => (
            <SelectItem key={language} value={language}>
              {LANGUAGE_MAPPING[language]?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="pt-4 rounded-md">
        <Editor
          height={"60vh"}
          value={code[language]}
          theme="vs-dark"
          onMount={() => {}}
          options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          language={LANGUAGE_MAPPING[language]?.monaco}
          onChange={(value) => {
            //@ts-ignore
            setCode({ ...code, [language]: value });
          }}
          defaultLanguage="javascript"
        />
      </div>
      <div className="flex justify-end">
        <Button
          disabled={status === SubmitStatus.PENDING}
          type="submit"
          className={`mt-4 align-right transition-all duration-200 ${
            status === SubmitStatus.PENDING
              ? "bg-blue-500 hover:bg-blue-500 cursor-not-allowed"
              : status === SubmitStatus.ACCEPTED
              ? "bg-green-500 hover:bg-green-600"
              : status === SubmitStatus.FAILED
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={submit}
        >
          {status === SubmitStatus.PENDING && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="animate-pulse">Processing...</span>
            </>
          )}
          {status === SubmitStatus.ACCEPTED && (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Accepted!
            </>
          )}
          {status === SubmitStatus.FAILED && (
            <>
              <CircleX className="mr-2 h-4 w-4" />
              Try Again
            </>
          )}
          {status === SubmitStatus.SUBMIT && (
            <>
              <ClockIcon className="mr-2 h-4 w-4" />
              Submit Solution
            </>
          )}
        </Button>
      </div>
      {status === SubmitStatus.PENDING && (
        <div className="mt-3 flex items-center justify-end">
          <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center animate-pulse">
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Executing your code against test cases...
          </div>
        </div>
      )}
      <RenderTestcase testcases={testcases} />
    </div>
  );
}

function renderResult(status: string) {
  switch (status) {
    case "AC":
      return <CheckIcon className="h-6 w-6 text-green-500" />;
    case "FAIL":
      return <CircleX className="h-6 w-6 text-red-500" />;
    case "TLE":
      return <ClockIcon className="h-6 w-6 text-red-500" />;
    case "COMPILATION_ERROR":
      return <CircleX className="h-6 w-6 text-red-500" />;
    case "PENDING":
      return (
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        </div>
      );
    default:
      return <div className="text-gray-500"></div>;
  }
}

function RenderTestcase({ testcases }: { testcases: any[] }) {
  if (testcases.length === 0) return null;

  const passedTests = testcases.filter((tc) => tc.status === "AC").length;
  const totalTests = testcases.length;
  const allPending = testcases.every((tc) => tc.status === "PENDING");

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Test Results
        </h3>
        {!allPending && (
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              passedTests === totalTests
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {passedTests}/{totalTests} passed
          </div>
        )}
        {allPending && (
          <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse">
            Running tests...
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-4">
        {testcases.map((testcase, index) => (
          <div
            key={`testcase-${index}`}
            className={`border rounded-md transition-all duration-300 ${
              testcase.status === "AC"
                ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                : testcase.status === "PENDING"
                  ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20 animate-pulse"
                  : testcase.status === "FAIL" ||
                      testcase.status === "TLE" ||
                      testcase.status === "COMPILATION_ERROR"
                    ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
            }`}
          >
            <div className="px-2 pt-2 flex justify-center">
              <div className="text-sm font-medium">Test #{index + 1}</div>
            </div>
            <div className="p-2 flex justify-center">
              {renderResult(testcase.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
