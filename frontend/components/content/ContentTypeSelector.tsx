import { ContentType } from "@/types/content";

interface ContentTypeSelectorProps {
  type: ContentType;
  setType: (type: ContentType) => void;
}

export const ContentTypeSelector = ({
  type,
  setType,
}: ContentTypeSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Content Type
      </label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as ContentType)}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value={ContentType.VIDEO}>Video</option>
        <option value={ContentType.DOCUMENT}>Document</option>
        <option value={ContentType.QUIZ}>Quiz</option>
      </select>
    </div>
  );
};
