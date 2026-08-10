import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#f2f4ec] border-t border-[#e1e3db] mt-auto text-xs md:text-sm text-[#42493e]">
      <div className="font-bold text-base text-[#191c17]">
        나만의 커리어앵커
      </div>

      <div className="flex gap-6 items-center">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#35662e] underline transition-colors"
        >
          이용약관
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#35662e] underline transition-colors"
        >
          개인정보처리방침
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="hover:text-[#35662e] underline transition-colors"
        >
          문의하기
        </a>
      </div>

      <div>© 2024 나만의 커리어앵커. All rights reserved.</div>
    </footer>
  );
};
