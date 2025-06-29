"use client";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Home,
  Users,
  BookOpen,
  Loader2,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionContext } from "@/context/SessionContext";
import Link from "next/link";
import axios from "@/libs/axios";
import NotificationsPanel from "./NotificationsPanel";
import { useRealtimeNotifications } from "@/hooks/useRealTimeNotifications";
import NavbarSidebar from "./ui/NavbarSidebar";
const Navbar = ({ externalClasses = "" }) => {
  const { user } = useSessionContext();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const isFirstRender = useRef(true);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(false);
  // Debounce effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const handler = setTimeout(() => {
      setIsSearching(true);
      setDebouncedSearch(search.trim()); // Trigger API call here if needed
    }, 2000); // 300ms debounce

    return () => clearTimeout(handler); // Cleanup on each keystroke
  }, [search]);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!debouncedSearch) {
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }
    const fetchResults = async () => {
      try {
        setIsSearching(true);
        const res = await axios.post("/question/search", {
          searchedInput: debouncedSearch,
          lastId: null,
        });
        setResults(res.data.questions);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
    setShowSearchDropdown(true);
  }, [debouncedSearch]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target)
      ) {
        setShowSearchDropdown(false);
        setIsSearching(false);
        setSearch("");
      }
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(e.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (user)
    useRealtimeNotifications(
      user.id,
      notifications,
      setNotifications,
      setNewNotification
    );

  const loadMore = async () => {
    try {
      setIsSearching(true);
      const res = await axios.post("/question/search", {
        searchedInput: debouncedSearch,
        lastId: nextCursor,
      });
      setResults((prev) => [...prev, ...res.data.questions]);
      setNextCursor(res.data.nextCursor);
      setHasMore(res.data.hasMore);
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setIsSearching(false);
    }
  };
  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };
  return (
    <header
      className={`${externalClasses} border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <img
                src="/questify_logo.png"
                alt="unable to load"
                className="sm:w-32 sm:block hidden"
              />
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="flex items-center  rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link
                href="/users"
                className="flex items-center rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </Link>
              <Link
                href="/topic"
                className="flex items-center rounded-md py-1 px-3 hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Topics
              </Link>
            </nav>
            <NavbarSidebar classnames="md:hidden" />
          </div>
          <div
            className="flex-1 max-w-md mx-4 relative"
            ref={searchDropdownRef}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Questify"
                className="pl-10 bg-gray-100 border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // onFocus={() =>
                //   debouncedSearch &&
                //   searchResults.length >= 0 &&
                //   setShowSearchDropdown(true)
                // }
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
              )}
            </div>
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {results.map((question) => (
                  <Link
                    href={`/question/${question.id}`}
                    className="p-4 hover:bg-[#ecb7327b] block transition-colors duration-500 ease-in-out"
                    key={question.id}
                  >
                    {question.title}
                  </Link>
                ))}
                {!results.length && !isSearching && (
                  <div className="p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
                {hasMore && results.length && (
                  <div className="flex justify-center">
                    <Button onClick={loadMore} disabled={isSearching}>
                      {isSearching ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-[#ecb7327b] transition-colors duration-500 ease-in-out cursor-pointer"
              onClick={() => toggleNotificationDropdown()}
            >
              <BellRing className="w-4 h-4" />
              {newNotification && (
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </Button>
            {showNotificationDropdown && (
              <div ref={notificationPanelRef}>
                <NotificationsPanel
                  user={user}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  setNewNotification={setNewNotification}
                />
              </div>
            )}
            <Link href={`/users/self/${user?.id}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.image} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
