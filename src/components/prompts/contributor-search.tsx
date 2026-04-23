"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
}

interface ContributorSearchProps {
  selectedUsers: User[];
  onSelect: (user: User) => void;
  onRemove: (userId: string) => void;
}

export function ContributorSearch({ selectedUsers, onSelect, onRemove }: ContributorSearchProps) {
  const t = useTranslations("prompts");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if dropdown should open upward
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 200; // Approximate max height
      setOpenUpward(spaceBelow < dropdownHeight && rect.top > dropdownHeight);
    }
  }, [isOpen, results]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out already selected users
          const filtered = data.filter(
            (user: User) => !selectedUsers.some((s) => s.id === user.id)
          );
          setResults(filtered);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query, selectedUsers]);

  const handleSelect = (user: User) => {
    onSelect(user);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Selected contributors */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-muted flex items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-sm"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="text-[10px]">
                  {user.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">@{user.username}</span>
              <button
                type="button"
                onClick={() => onRemove(user.id)}
                className="hover:bg-foreground/10 ml-0.5 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={t("searchContributors")}
            className="h-9 pl-8"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
          />
          {isLoading && (
            <Loader2 className="text-muted-foreground absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <div
            ref={dropdownRef}
            className={`bg-popover absolute z-50 max-h-[200px] w-full overflow-y-auto rounded-md border shadow-md ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelect(user)}
                className="hover:bg-accent flex w-full items-center gap-2 px-3 py-2 text-left transition-colors first:rounded-t-md last:rounded-b-md"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-xs">
                    {user.name?.[0] || user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">@{user.username}</div>
                  {user.name && (
                    <div className="text-muted-foreground truncate text-xs">{user.name}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && query.length >= 1 && !isLoading && results.length === 0 && (
          <div
            className={`bg-popover text-muted-foreground absolute z-50 w-full rounded-md border p-3 text-center text-sm shadow-md ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {t("noUsersFound")}
          </div>
        )}
      </div>
    </div>
  );
}
