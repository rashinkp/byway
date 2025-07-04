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
					className="w-full py-2.5 px-4 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-transparent text-[var(--color-muted)] placeholder-[var(--color-muted)] transition-all duration-300 shadow-sm bg-[var(--color-surface)]"
					style={{
						background: "var(--color-surface)",
						color: "var(--color-muted)",
					}}
					ref={inputRef}
				/>
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
				{isSearching && (
					<Loader2
						className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
						style={{ color: "var(--color-muted)" }}
						animate-spin
					/>
				)}
				{/* Enhanced Search Results Dropdown */}
				{showSearchResults && searchResults && searchQuery && (
					<div
						className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg  max-h-96 overflow-hidden z-50 bg-[var(--color-surface)] text-[var(--color-primary-dark)]"
						style={{
							background: "var(--color-surface)",
							color: "var(--color-primary-dark)",
						}}
					>
						<div className="max-h-96 overflow-y-auto">
							{/* Instructors Section */}
							{searchResults.instructors.items.length > 0 && (
								<div className="p-4">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-[var(--color-primary-dark)] whitespace-nowrap">
											Instructors
										</h3>
										<div className="flex-1 border-t border-[var(--color-primary-light)] ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.instructors.items.map((instructor) => (
											<Link
												key={instructor.id}
												href={`/instructors/${instructor.id}`}
												onClick={handleSearchItemClick}
												className="flex items-center gap-3 p-3 hover:bg-[var(--color-background)] rounded-lg transition-colors group"
											>
												<div
													className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-surface)] font-semibold shadow-md"
													style={{
														background: "var(--color-primary-dark)",
														color: "var(--color-primary-light)",
													}}
												>
													{instructor.name.charAt(0)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-[var(--color-primary-dark)]  transition-colors">
														{instructor.name}
													</p>
													<p className="text-xs text-[var(--color-primary-light)] truncate">
														{instructor.shortBio || "Instructor"}
													</p>
												</div>
												<Users className="w-4 h-4 text-[var(--color-primary-light)]" />
											</Link>
										))}
									</div>
								</div>
							)}
							{/* Courses Section */}
							{searchResults.courses.items.length > 0 && (
								<div className="p-4 border-b border-[var(--color-primary-light)] ">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-[var(--color-primary-dark)] whitespace-nowrap">
											Courses
										</h3>
										<div className="flex-1 border-t  border-[var(--color-primary-light)] ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.courses.items.map((course) => (
											<Link
												key={course.id}
												href={`/courses/${course.id}`}
												onClick={handleSearchItemClick}
												className="flex items-center gap-3 p-3 hover:bg-[var(--color-background)] rounded-lg transition-colors group"
											>
												<div className="w-12 h-8 rounded-md bg-[var(--color-background)] flex items-center justify-center shadow-sm overflow-hidden">
													{course.thumbnail ? (
														<Image
															src={course.thumbnail}
															alt={course.title}
															className="w-full h-full object-cover"
															width={100}
															height={100}
														/>
													) : (
														<BookOpen className="w-5 h-5 text-[var(--color-primary-light)]" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-[var(--color-primary-dark)] transition-colors truncate">
														{course.title}
													</p>
													<div className="flex items-center gap-2 mt-1">
														{course.offer ? (
															<>
																<span className="text-sm font-semibold text-[var(--color-primary-dark)] transition-colors">
																	${course.offer}
																</span>
																<span className="text-sm text-[var(--color-primary-light)] line-through">
																	${course.price}
																</span>
															</>
														) : (
															<span className="text-sm font-semibold text-[var(--color-primary-light)] transition-colors">
																${course.price}
															</span>
														)}
													</div>
												</div>
												<Clock className="w-4 h-4 text-[var(--color-primary-light)]" />
											</Link>
										))}
									</div>
								</div>
							)}
							{/* Certificates Section */}
							{searchResults.certificates &&
								searchResults.certificates.items.length > 0 && (
									<div className="p-4 border-b border-[var(--color-primary-light)] ">
										<div className="flex items-center gap-2 mb-3">
											<h3 className="text-sm font-semibold text-[var(--color-primary-dark)] whitespace-nowrap">
												Certificates
											</h3>
											<div className="flex-1 border-t  border-[var(--color-primary-light)] ml-1" />
										</div>
										<div className="space-y-2">
											{searchResults.certificates.items.map((cert) => (
												<div
													key={cert.id}
													className="flex items-center gap-3 p-3 hover:bg-[var(--color-background)] rounded-lg transition-colors group cursor-pointer"
												>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-[var(--color-primary-dark)] transition-colors truncate">
															{cert.courseTitle}
														</p>
														<p className="text-xs text-[var(--color-primary-light)] truncate">
															Certificate #: {cert.certificateNumber}
														</p>
													</div>
													<a
														href={cert.pdfUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-block px-3 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] rounded  text-xs font-medium transition"
														onClick={handleSearchItemClick}
													>
														Download
													</a>
												</div>
											))}
										</div>
									</div>
								)}
							{/* Categories Section */}
							{searchResults.categories.items.length > 0 && (
								<div className="p-4">
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-[var(--color-primary-dark)] whitespace-nowrap">
											Categories
										</h3>
										<div className="flex-1 border-t  border-[var(--color-primary-light)] ml-1" />
									</div>
									<div className="space-y-2">
										{searchResults.categories.items.map((category) => (
											<Link
												key={category.id}
												href={`/courses?category=${category.id}`}
												onClick={handleSearchItemClick}
												className="block p-3 hover:bg-[var(--color-background)] rounded-lg transition-colors group"
												style={{
													background: "var(--color-background)",
													color: "var(--color-primary-dark)",
												}}
											>
												<p className="text-sm font-medium text-[var(--color-primary-dark)] transition-colors">
													{category.title}
												</p>
												<p className="text-xs text-[var(--color-primary-light)] mt-1 line-clamp-2">
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
									<div className="p-8 text-center bg-[var(--color-background)]">
										<Search
											className="w-12 h-12"
											style={{ color: "var(--color-primary-light)" }}
											mx-auto
											mb-3
										/>
										<p className="text-sm text-[var(--color-primary-light)]">
											No results found for &quot;{searchQuery}&quot;
										</p>
										<p className="text-xs text-[var(--color-primary-light)] mt-1">
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
