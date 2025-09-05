// // FullScreenSvgGrid.jsx

// export default function GridShape() {
//   return (
//     <svg
//       aria-hidden="true"
//       className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full stroke-white/10"
//     >
//       <defs>
//         <pattern
//           id="full-grid"
//           width="40"
//           height="40"
//           patternUnits="userSpaceOnUse"
//         >
//           {/* Path ini menggambar bentuk 'L' untuk satu sel grid */}
//           <path d="M.5 40V.5H40" fill="none" />
//         </pattern>
//       </defs>

//       {/* Persegi panjang ini diisi dengan pola grid yang berulang */}
//       <rect width="100%" height="100%" fill="url(#full-grid)" />
//     </svg>
//   );
// }