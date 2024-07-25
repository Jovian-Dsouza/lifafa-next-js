import React, { ReactNode } from 'react'

export function Container({children}: {children: ReactNode}) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center bg-background gap-[3rem] sm:gap-[14rem] mt-5">
      <div className="w-[22rem] bg-[#F5F6FE]  rounded-3xl p-4 shadow flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
