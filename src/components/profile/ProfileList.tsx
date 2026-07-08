"use client";

import Link from "next/link";
import { FaPlus, FaPencil } from "react-icons/fa6";
import Image from "next/image";
import { ProfileListProps } from "@/src/types";

export default function ProfileList({
  childrenData,
  onAdd,
  onEdit,
  avatarMap,
}: ProfileListProps) {
  const MAX_CHILDREN = 4;

  return (
    <div className="flex flex-wrap justify-center items-start gap-17.5 px-4 mb-58">
      {childrenData.map((child) => (
        <div
          key={child._id}
          className="group font-nunito flex flex-col items-center w-67 relative"
        >
          <div className="relative inline-block">
            <Link draggable="false" href={`/${child._id}`} className="block">
              <div className="w-67 h-67 rounded-full overflow-hidden bg-gray-800 relative shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src={`${avatarMap[child.avatar]}`}
                  alt={child.name}
                  fill
                  className="object-cover"
                  draggable="false"
                  unoptimized
                />
              </div>
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(child);
              }}
              className="absolute bottom-4 right-4 z-20 cursor-pointer"
              title="Editar Criança"
            >
              <Image
                src="/assets/botao-editar.png"
                alt="Editar Criança"
                width={40}
                height={40}
                className="hover:scale-105 transition-transform"
              />
            </button>
          </div>

          <span className="mt-4 text-5xl font-bold text-white tracking-wide">
            {child.name}
          </span>
        </div>
      ))}

      {childrenData.length < MAX_CHILDREN && (
        <div className="group flex flex-col items-center w-67">
          <button
            type="button"
            onClick={onAdd}
            className="relative hover:scale-105 transition-transform duration-300"
          >
            <div className="w-67 h-67 rounded-full flex items-center justify-center border-3 border-[#0C78F4] cursor-pointer shadow-lg">
              <FaPlus className="w-20 h-20 text-secondary-400" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
