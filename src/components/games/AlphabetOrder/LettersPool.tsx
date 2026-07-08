"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { LetterItem } from "@/src/types/alphabet-game";

interface LettersPoolProps {
  lettersPool: LetterItem[];
}

export function LettersPool({ lettersPool }: LettersPoolProps) {
  return (
    <Droppable droppableId="letters-pool" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-full max-w-6xl flex flex-wrap justify-center gap-3 md:gap-4"
        >
          {lettersPool.map((letter, index) => (
            <Draggable key={letter.id} draggableId={letter.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-xl text-3xl md:text-5xl font-bold text-white font-nunito shadow-lg select-none ${
                    snapshot.isDragging
                      ? "scale-105 z-50 shadow-2xl ring-4 ring-white/20"
                      : "hover:-translate-y-1 transition-transform duration-200"
                  }`}
                  style={{
                    ...provided.draggableProps.style,
                    backgroundColor: letter.color,
                  }}
                >
                  {letter.id}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
