"use client";

import { Droppable } from "@hello-pangea/dnd";
import { DropZoneItem } from "@/src/types/alphabet-game";

interface DropZoneBoardProps {
  dropZones: DropZoneItem[];
}

export function DropZoneBoard({ dropZones }: DropZoneBoardProps) {
  const dropZonesRows = [
    dropZones.slice(0, 10),
    dropZones.slice(10, 20),
    dropZones.slice(20, 26),
  ];

  return (
    <div className="w-full max-w-7xl flex flex-col items-center gap-4 mb-16">
      {dropZonesRows.map((rowZones, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex justify-center gap-3">
          {rowZones.map((zone) => (
            <Droppable
              key={zone.id}
              droppableId={zone.id}
              isDropDisabled={!!zone.placedLetter}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border-4 transition-all duration-300 relative ${
                    zone.status === "correct"
                      ? "border-green-500"
                      : zone.status === "incorrect"
                        ? "border-red-500"
                        : "border-white/80"
                  }`}
                >
                  {zone.placedLetter && (
                    <div
                      className="w-full h-full flex items-center justify-center rounded-lg text-3xl md:text-5xl font-bold text-white font-nunito shadow-md select-none"
                      style={{ backgroundColor: zone.placedLetter.color }}
                    >
                      {zone.placedLetter.id}
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      ))}
    </div>
  );
}
