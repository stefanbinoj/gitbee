"use client";

export default function UpdatePricingSection() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 pt-12 md:pt-16 border-top border-[rgba(255,255,255,0.1)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[640px] px-6 py-5 shadow-[0px_2px_4px_rgba(0,0,0,0.3)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4 shadow-none">
          {/* Pricing Badge */}
          <div className="px-[14px] py-[6px] bg-[#1a1a1a] shadow-[0px_0px_0px_4px_rgba(255,255,255,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(255,255,255,0.1)] shadow-xs">
            <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1V11M8.5 3H4.75C4.28587 3 3.84075 3.18437 3.51256 3.51256C3.18437 3.84075 3 4.28587 3 4.75C3 5.21413 3.18437 5.65925 3.51256 5.98744C3.84075 6.31563 4.28587 6.5 4.75 6.5H7.25C7.71413 6.5 8.15925 6.68437 8.48744 7.01256C8.81563 7.34075 9 7.78587 9 8.25C9 8.71413 8.81563 9.15925 8.48744 9.48744C8.15925 9.81563 7.71413 10 7.25 10H3.5"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-center flex justify-center flex-col text-[#e5e5e5] text-xs font-medium leading-3 font-sans">
              Plans & Pricing
            </div>
          </div>

          {/* Title */}
          <div className="self-stretch text-center flex justify-center flex-col text-[#ffffff] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Simple & Transparent Pricing
          </div>

          {/* Description */}
          <div className="self-stretch text-center text-[rgba(255,255,255,0.70)] text-base md:text-lg font-normal leading-7 font-sans max-w-[540px] mx-auto">
            Start for free with your own API key and scale as your team grows.
            Pay only for what you use.
          </div>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="self-stretch border-b border-[rgba(255,255,255,0.08)] flex justify-center items-center">
        <div className="flex justify-center items-stretch w-full">
          {/* Left Decorative Pattern */}
          <div className="flex-1 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[2000px] left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 800 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>

          {/* Pricing Cards Container */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 py-12 md:py-0 shrink-0">
            {/* BYOK Plan */}
            <div className="w-[380px] max-w-[90vw] self-stretch px-6 py-8 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] overflow-hidden flex flex-col justify-start items-start gap-10 rounded-lg">
              {/* Plan Header */}
              <div className="self-stretch flex flex-col justify-start items-center gap-8">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="flex items-center gap-2">
                    <div className="text-[#FBFAF9] text-xl font-semibold leading-7 font-sans">
                      BYOK Plan
                    </div>
                    <div className="px-2 py-0.5 bg-[#eab308]/20 rounded-full">
                      <span className="text-[#eab308] text-xs font-medium">
                        Limited
                      </span>
                    </div>
                  </div>
                  <div className="w-full text-[#B2AEA9] text-sm font-normal leading-6 font-sans">
                    Bring Your Own Key. Connect your open router API keys and
                    enjoy full access to GitBee's powerful features at zero
                    platform cost.
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="relative h-[60px] flex items-center text-[#F0EFEE] text-5xl font-medium leading-[60px] font-serif">
                      $0
                    </div>
                    <div className="text-[#D2C6BF] text-sm font-medium font-sans">
                      Limited — only pay for your LLM inference
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="self-stretch px-4 py-[12px] relative bg-[#FBFAF9] shadow-[0px_2px_4px_rgba(55,50,47,0.12)] overflow-hidden rounded-[99px] flex justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="w-full h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                  <div className="flex justify-center flex-col text-[#37322F] text-sm font-semibold leading-5 font-sans">
                    Get Started Free
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="text-[#D2C6BF] text-xs font-medium uppercase tracking-wider mb-2">
                  Everything included
                </div>
                {[
                  "5 repositories",
                  "Intelligent PR & issue analysis",
                  "Advanced relevance filtering",
                  "Custom warning thresholds",
                  "Automated contributor moderation",
                  "Team collaboration tools",
                  "Slack & Jira/Linear integrations",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="self-stretch flex justify-start items-center gap-[13px] py-1"
                  >
                    <div className="w-4 h-4 relative flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#eab308"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 text-[#F0EFEE] text-[13px] font-normal leading-5 font-sans">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Decorative Pattern */}
          <div className="flex-1 self-stretch relative overflow-hidden hidden md:block">
            <div className="w-[2000px] right-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
              {Array.from({ length: 800 }).map((_, i) => (
                <div
                  key={i}
                  className="self-stretch h-4 rotate-[45deg] origin-top-right outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
