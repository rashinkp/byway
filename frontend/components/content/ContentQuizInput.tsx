import { useState } from "react";
import { validateQuestion } from "./ContentValidation";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizErrors {
  questions?: string;
  newQuestion?: string;
  newOptions?: string;
  newAnswer?: string;
  editQuestion?: string;
  editOptions?: string;
  editAnswer?: string;
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editOptions, setEditOptions] = useState(["", "", "", ""]);
  const [editAnswer, setEditAnswer] = useState("");

  const handleAddQuestion = () => {
    if (!validateQuestion(newQuestion, newOptions, newAnswer, setErrors))
      return;
    setQuestions([
      ...questions,
      { question: newQuestion, options: newOptions, correctAnswer: newAnswer },
    ]);
    setNewQuestion("");
    setNewOptions(["", "", "", ""]);
    setNewAnswer("");
    setErrors();
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setEditingIndex(index);
    setEditQuestion(question.question);
    setEditOptions([...question.options]);
    setEditAnswer(question.correctAnswer);
    setErrors();
  };

  const handleSaveEdit = () => {
    if (
      !validateQuestion(editQuestion, editOptions, editAnswer, (errors) => {
        setErrors({
          editQuestion: errors?.newQuestion,
          editOptions: errors?.newOptions,
          editAnswer: errors?.newAnswer,
        });
      })
    ) {
      return;
    }
    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex!] = {
      question: editQuestion,
      options: editOptions,
      correctAnswer: editAnswer,
    };
    setQuestions(updatedQuestions);
    setEditingIndex(null);
    setEditQuestion("");
    setEditOptions(["", "", "", ""]);
    setEditAnswer("");
    setErrors();
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditQuestion("");
    setEditOptions(["", "", "", ""]);
    setEditAnswer("");
    setErrors();
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setErrors();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        Questions
      </label>
      {questions.length === 0 && errors.questions && (
        <p className="mt-1 text-sm text-red-500">{errors.questions}</p>
      )}
      {questions.map((q, index) => (
        <div
          key={index}
          className="p-4 border border-blue-200 rounded-xl bg-blue-50"
        >
          {editingIndex === index ? (
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.editQuestion ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter question"
                />
                {errors.editQuestion && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.editQuestion}
                  </p>
                )}
              </div>
              {editOptions.map((opt, i) => (
                <div key={i}>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...editOptions];
                      updated[i] = e.target.value;
                      setEditOptions(updated);
                    }}
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      errors.editOptions ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Option ${i + 1}`}
                  />
                  {i === 0 && errors.editOptions && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.editOptions}
                    </p>
                  )}
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.editAnswer ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter correct answer"
                />
                {errors.editAnswer && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.editAnswer}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-medium text-gray-800">{q.question}</p>
              <ul className="list-disc pl-5 mt-2">
                {q.options.map((opt, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-700">
                Answer: <span className="font-medium">{q.correctAnswer}</span>
              </p>
              <div className="flex space-x-3 mt-3">
                <button
                  type="button"
                  onClick={() => handleEditQuestion(index)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 shadow-md"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="mt-4 space-y-3">
        <div>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
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
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
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
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
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
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};
