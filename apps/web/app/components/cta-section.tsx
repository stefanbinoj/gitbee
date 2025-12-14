"use client";

import { authClient } from "@/lib/authClient";
import { Button } from "./ui/button";

export default function CTASection() {
  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };
  return (
    <div className="w-full relative overflow-hidden flex flex-col justify-center items-center gap-2">
      {/* Content */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-12 border-t border-b border-[rgba(255,255,255,0.08)] flex justify-center items-center gap-6 relative z-10">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="w-full h-full relative">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-4 w-full rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                style={{
                  top: `${i * 16 - 120}px`,
                  left: "-100%",
                  width: "300%",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-[586px] px-6 py-5 md:py-8 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-6 relative z-20">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch text-center flex justify-center flex-col text-[#ffffff] text-3xl md:text-5xl font-semibold leading-tight md:leading-[56px] font-sans tracking-tight">
              Ready to keep your community healthy?
            </div>
            <div className="self-stretch text-center text-[rgba(255,255,255,0.70)] text-base leading-7 font-sans font-medium">
              Monitor issues, filter spam PRs, and enforce conduct
              <br />
              all automatically with GitBee.
            </div>
          </div>
          <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-12">
            <div className="flex justify-start items-center gap-4">
              <div className="h-10 px-12 py-[6px] relative bg-[#eab308] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.1)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#ca8a04] transition-colors">
                <Button
                  className="flex flex-col justify-center text-black text-[13px] font-medium leading-5 font-sans cursor-pointer bg-transparent hover:bg-transparent border-none shadow-none"
                  onClick={() => {
                    signIn();
                  }}
                >
                  Get started with GitHub
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
