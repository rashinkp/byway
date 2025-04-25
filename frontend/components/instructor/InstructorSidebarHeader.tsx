import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export function SidebarHeader() {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div className="hidden xl:block">
        <h1 className="text-xl font-bold text-gray-800">Instructor Panel</h1>
        <p className="text-xs text-gray-500">Teaching Console</p>
      </div>
      <div className="flex justify-center xl:hidden">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-blue-600 text-white">
            IN
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
