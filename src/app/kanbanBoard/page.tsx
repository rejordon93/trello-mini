"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Card {
  id: number;
  title: string;
  position: number;
}
interface List {
  id: number;
  title: string;
  position: number;
  cards: Card[];
}
interface Board {
  id: number;
  title: string;
  lists: List[];
}

export default function KanbanBoard({ boardId }: { boardId: number }) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const { data } = await axios.get(`/api/boards/${boardId}`);
        setBoard(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId]);

  if (loading) return <p>Loading...</p>;
  if (!board) return <p>Board not found</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">{board.title}</h2>
      <div className="flex gap-4 mt-4 overflow-x-auto">
        {board.lists.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded w-64"
          >
            <h3 className="font-semibold mb-2">{list.title}</h3>
            <div className="flex flex-col gap-2">
              {list.cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-gray-700 p-2 rounded shadow"
                >
                  {card.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
