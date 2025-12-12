import React, { useState, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { textVariant } from "../utils/motion";

const LOGOS_PER_PAGE = 12;
const BallCanvas = lazy(() => import("./canvas/Ball"));

const Tech = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(technologies.length / LOGOS_PER_PAGE);
  const startIdx = page * LOGOS_PER_PAGE;
  const endIdx = startIdx + LOGOS_PER_PAGE;
  const visibleTechnologies = technologies.slice(startIdx, endIdx);

  return (
    <>
      <motion.div variants={textVariant()}>
        <h3 className={`${styles.sectionHeadText} text-center`}>Skills.</h3>
      </motion.div>

      {/* Responsive skills grid with individual canvases */}
      <div className="mt-10 flex justify-center relative z-0 w-full pointer-events-none">
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl px-4">
          {visibleTechnologies.map((technology, index) => (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center pointer-events-none"
              key={`${technology.name}-${startIdx}-${index}`}
            >
              <Suspense fallback={<div className="w-full h-full bg-gray-700 rounded-full animate-pulse" />}>
                <BallCanvas icon={technology.icon} />
              </Suspense>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 relative z-50 pointer-events-auto gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-[#222] text-white font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative z-50 pointer-events-auto"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-white font-bold flex items-center relative z-50">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-lg bg-[#222] text-white font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative z-50 pointer-events-auto"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Tech, "skills");
