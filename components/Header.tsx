"use client";
import Image from "next/image";
import {MagnifyingGlassIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import Avatar from "react-avatar";
import {useBoardStore} from "@/store/BoardStore";
import {useEffect, useState} from "react";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.column.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />
        <Image
          src={`https://links.papareact.com/c2cdd5`}
          width={300}
          height={100}
          alt="logo"
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 w-full justify-end">
          {/* search */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 lg:flex-initial ">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-2"
            />
            <button hidden type="submit">
              Search
            </button>
          </form>
          {/* avatar */}
          {/* @ts-ignore */}
          <Avatar name="Ian Mwangi" size="50" color="#0055D1" round />
        </div>
      </div>
      <div className="flex items-center justify-center py-2 px-5 md:py-5">
        <p className="flex items-center text-sm font-light pr-5 shadow-xl rounded-xl bg-white italic max-w-3xl text-[#0055D1] p-5">
          <UserCircleIcon
            className={`h-10 w-10 inline-block text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising tasks for your day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
