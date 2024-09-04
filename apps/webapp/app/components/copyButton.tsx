import { useState } from "react";
import { HiOutlineClipboard } from "react-icons/hi2";

export function CopyButton({ copyLink }: { copyLink: string }) {
    const [isCopyAnimationActive, setIsCopyAnimationActive] = useState(false);

    function startCopiedAnimation() {
        setIsCopyAnimationActive(true);
        setTimeout(() => setIsCopyAnimationActive(false), 1000);
    }

    if (isCopyAnimationActive) 
        return ( 
            <span className="absolute end-2.5 top-1/2 -translate-y-1/2 inline-flex items-center">
                <span className="inline-flex items-center">
                    <HiOutlineClipboard className="mr-2 h-4 w-4" />
                    <span className="text-xs font-semibold">Copiato!</span>
                </span>
            </span>
        );

    return (
        <button 
            className="absolute end-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={() => {
                navigator.clipboard.writeText(copyLink);
                startCopiedAnimation();
            }}
            >
            <span className="inline-flex items-center">
            <HiOutlineClipboard className="mr-2 h-4 w-4" />
            <span className="text-xs font-semibold">Copia</span>
            </span>
        </button>
    );
          
}