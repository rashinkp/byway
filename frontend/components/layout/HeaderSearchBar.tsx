import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Loader2, BookOpen, Clock, Users } from "lucide-react";
import { useGlobalSearch } from "@/hooks/search/useGlobalSearch";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";

interface HeaderSearchBarProps {
	user: any;
	searchQuery: string;
	setSearchQuery: (q: string) => void;
	showSearchResults: boolean;
	setShowSearchResults: (v: boolean) => void;
	handleSearchItemClick: () => void;
	inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
	searchQuery,
	setSearchQuery,
	showSearchResults,
	setShowSearchResults,
	handleSearchItemClick,
	inputRef,
}) => {
	const debouncedSearchQuery = useDebounce(searchQuery, 500);
	const { data: searchResults, isLoading: isSearching } = useGlobalSearch({
		query: debouncedSearchQuery,
		page: 1,
		limit: 5,
	});
	const searchContainerRef = useRef<HTMLDivElement>(null);

	// Handle click outside search
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target as Node)
			) {
				setShowSearchResults(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setShowSearchResults]);

	// Show search results when query changes
	useEffect(() => {
		if (debouncedSearchQuery && searchResults) {
			setShowSearchResults(true);
		} else {
			setShowSearchResults(false);
		}
	}, [debouncedSearchQuery, searchResults, setShowSearchResults]);

	return (
		<div className="flex-1 max-w-md mx-8" ref={searchContainerRef}>
			<div className="relative  ">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onFocus={() =>
						searchQuery && searchResults && setShowSearchResults(true)
					}
					placeholder="Search for courses, topics, instructors..."
					className="w-full py-2.5 px-4 pl-10 border-0 border-b-1 border-black dark:border-white focus:border-b-2 focus:border-[#facc15] dark:focus:border-[#facc15] bg-white dark:bg-neutral-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none transition-all duration-300 shadow-none"
					ref={inputRef}
				/>
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/60 dark:text-white/60" />
				{isSearching && (
					<Loader2
						className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-[#facc15]"
					/>
				)}
				{/* Enhanced Search Results Dropdown */}
				{showSearchResults && searchResults && searchQuery && (
					<div
						className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg max-h-96 overflow-hidden z-50 bg-white dark:bg-neutral-900 text-black dark:text-white border border-black dark:border-white"
					>
						<div className="max-h-96 overflow-y-auto">
							{/* Instructors Section */}
							{searchResults.instructors.items.length > 0 && (
								<div className="p-4">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
											Instructors
										</h3>
										<div className="flex-1 border-t border-black dark:border-white ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.instructors.items.map((instructor) => (
											<Link
												key={instructor.id}
												href={`/instructors/${instructor.id}`}
												onClick={handleSearchItemClick}
												className="flex items-center gap-3 p-3 rounded-lg transition-colors group text-black dark:text-white hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
											>
												<div
													className="w-10 h-10 rounded-full flex items-center justify-center text-black font-semibold shadow-md bg-[#facc15]"
												>
													{instructor.name.charAt(0)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
														{instructor.name}
													</p>
													<p className="text-xs text-black dark:text-white group-hover:text-black dark:group-hover:text-black truncate">
														{instructor.shortBio || "Instructor"}
													</p>
												</div>
												<Users className="w-4 h-4 text-black group-hover:text-black dark:text-white dark:group-hover:text-black" />
											</Link>
										))}
									</div>
								</div>
							)}
							{/* Courses Section */}
							{searchResults.courses.items.length > 0 && (
								<div className="p-4 ">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
											Courses
										</h3>
										<div className="flex-1 border-t border-black dark:border-white ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.courses.items.map((course) => (
											<Link
												key={course.id}
												href={`/courses/${course.id}`}
												onClick={handleSearchItemClick}
												className="flex items-center gap-3 p-3 rounded-lg transition-colors group text-black dark:text-white hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
											>
												<div className="w-12 h-8 rounded-md bg-[#facc15]/10 flex items-center justify-center shadow-sm overflow-hidden">
													{course.thumbnail ? (
														<Image
															src={course.thumbnail}
															alt={course.title}
															className="w-full h-full object-cover"
															width={100}
															height={100}
														/>
													) : (
														<BookOpen className="w-5 h-5 text-[#facc15]" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black truncate">
														{course.title}
													</p>
													<div className="flex items-center gap-2 mt-1">
														{course.offer ? (
															<>
																<span className="text-sm font-semibold text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
																	${course.offer}
																</span>
																<span className="text-sm text-black dark:text-white line-through group-hover:text-black dark:group-hover:text-black">
																	${course.price}
																</span>
															</>
														) : (
															<span className="text-sm font-semibold text-black dark:text-white transition-colors group-hover:text-black dark:group-hover:text-black">
																${course.price}
															</span>
														)}
													</div>
												</div>
												<Clock className="w-4 h-4 text-black group-hover:text-black dark:text-white dark:group-hover:text-black" />
											</Link>
										))}
									</div>
								</div>
							)}
							{/* Certificates Section */}
							{searchResults.certificates &&
								searchResults.certificates.items.length > 0 && (
									<div className="p-4">
										<div className="flex items-center gap-2 mb-3">
											<h3 className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
												Certificates
											</h3>
											<div className="flex-1 border-t border-black dark:border-white ml-1" />
										</div>
										<div className="space-y-2">
											{searchResults.certificates.items.map((certificate) => (
												<Link
													key={certificate.id}
													href={`/certificates/${certificate.id}`}
													onClick={handleSearchItemClick}
													className="flex items-center gap-3 p-3 rounded-lg transition-colors group text-black dark:text-white hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
												>
												</Link>
											))}
										</div>
									</div>
								)}
							{/* Categories Section */}
							{searchResults.categories.items.length > 0 && (
								<div className="p-4">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-black dark:text-white whitespace-nowrap">
											Categories
										</h3>
										<div className="flex-1 border-t border-black dark:border-white ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.categories.items.map((category) => (
											<Link
												key={category.id}
												href={`/courses?category=${category.id}`}
												onClick={handleSearchItemClick}
												className="block p-3 rounded-lg transition-colors group text-black dark:text-white hover:bg-[#facc15] dark:hover:bg-[#facc15] dark:hover:text-black"
												style={{
													background: "#facc15/10",
													color: "#18181b",
												}}
											>
												<p className="text-sm font-medium text-black dark:text-white group-hover:text-black dark:group-hover:text-black transition-colors">
													{category.title}
												</p>
												<p className="text-xs text-black dark:text-white group-hover:text-black dark:group-hover:text-black mt-1 line-clamp-2">
													{category.description}
												</p>
											</Link>
										))}
									</div>
								</div>
							)}
							{/* No Results */}
							{searchResults.instructors.items.length === 0 &&
								searchResults.courses.items.length === 0 &&
								searchResults.categories.items.length === 0 &&
								(!searchResults.certificates ||
									searchResults.certificates.items.length === 0) && (
									<div className="p-8 text-center bg-[#facc15]/10 dark:bg-[#facc15]/10">
										<Search
											className="w-12 h-12 text-[#facc15] mx-auto mb-3"
										/>
										<p className="text-sm text-black dark:text-white">
											No results found for &quot;{searchQuery}&quot;
										</p>
										<p className="text-xs text-black dark:text-white mt-1">
											Try different keywords or browse categories
										</p>
									</div>
								)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
