import { LessonContent } from "@/types/lesson";
import { Button } from "@/components/ui/button";

interface ContentListProps {
  contents: LessonContent[];
  onEdit: (content: LessonContent) => void;
  onDelete: (content: LessonContent) => void;
}

export function ContentList({ contents, onEdit, onDelete }: ContentListProps) {
  return (
    <div className="mt-6">
      {contents.length === 0 ? (
        <p className="text-gray-500 text-center">No content available.</p>
      ) : (
        <ul className="space-y-4">
          {contents.map((content) => (
            <li
              key={content.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-start"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  {content.data.title || `${content.type} Content`}
                </h4>
                <p className="text-gray-600">
                  {content.data.description || "No description"}
                </p>
                <p className="text-sm text-gray-500">Type: {content.type}</p>
                <p className="text-sm text-gray-500">
                  Status: {content.status}
                </p>
                {content.type === "VIDEO" || content.type === "DOC" ? (
                  <p className="text-sm text-blue-600">
                    <a
                      href={content.data.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content.data.fileUrl}
                    </a>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Questions: {content.data.questions?.length || 0}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(content)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(content)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
