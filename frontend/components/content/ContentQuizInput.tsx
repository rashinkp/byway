import { useState } from "react";
import { validateQuestion } from "./ContentValidation";
import { Pencil, Trash2, Check, X } from "lucide-react";

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
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                Question {index + 1}: {q.question}
              </h3>
              <ul className="space-y-3">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={`flex items-center p-3 rounded-lg ${
                      opt === q.correctAnswer
                        ? "bg-green-100 border border-green-200"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {opt === q.correctAnswer ? (
                      <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    )}
                    <span
                      className={`${
                        opt === q.correctAnswer
                          ? "text-gray-800 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {opt}
                    </span>
                    {opt === q.correctAnswer && (
                      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Correct Answer
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <span
                  onClick={() => handleEditQuestion(index)}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </span>
                <span
                  onClick={() => handleDeleteQuestion(index)}
                  className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </span>
              </div>
            </div>
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
          className="px-4 py-2 text-blue-600 bg-transparent hover:text-blue-700 transition-all duration-300 "
        >
          Add Question
        </button>
      </div>
    </div>
  );
};
