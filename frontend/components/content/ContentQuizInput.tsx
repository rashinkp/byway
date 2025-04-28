import { useState } from "react";
import { validateQuestion } from "./ContentValidation";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizErrors {
  questions?: string;
  newQuestion?: string;
  newOptions?: string;
  newAnswer?: string;
}

interface QuizInputProps {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  errors: QuizErrors;
  setErrors: (errors?: QuizErrors) => void;
}

export const QuizInput = ({
  questions,
  setQuestions,
  errors,
  setErrors,
}: QuizInputProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", "", "", ""]);
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddQuestion = () => {
    if (!validateQuestion(newQuestion, newOptions, newAnswer, setErrors)) return;
    setQuestions([
      ...questions,
      { question: newQuestion, options: newOptions, answer: newAnswer },
    ]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setNewAnswer("");
    setErrors();
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Questions
      </label>
      {questions.length === 0 && errors.questions && (
        <p className="mt-1 text-sm text-red-500">{errors.questions}</p>
      )}
      {questions.map((q, index) => (
        <div
          key={index}
          className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50"
        >
          <p className="font-medium">{q.question}</p>
          <ul className="list-disc pl-5 mt-2">
            {q.options.map((opt, i) => (
              <li key={i} className="text-sm text-gray-600">
                {opt}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            Answer: <span className="font-medium">{q.answer}</span>
          </p>
        </div>
      ))}
      <div className="mt-4 space-y-3">
        <div>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.newQuestion ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter question"
          />
          {errors.newQuestion && (
            <p className="mt-1 text-sm text-red-500">{errors.newQuestion}</p>
          )}
        </div>
        {newOptions.map((opt, i) => (
          <div key={i}>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const updated = [...newOptions];
                updated[i] = e.target.value;
                setNewOptions(updated);
              }}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                errors.newOptions ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={`Option ${i + 1}`}
            />
            {i === 0 && errors.newOptions && (
              <p className="mt-1 text-sm text-red-500">{errors.newOptions}</p>
            )}
          </div>
        ))}
        <div>
          <input
            type="text"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.newAnswer ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter correct answer"
          />
          {errors.newAnswer && (
            <p className="mt-1 text-sm text-red-500">{errors.newAnswer}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};