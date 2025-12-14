"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import SmartSimpleBrilliant from "@/components/smart-simple-brilliant";
import YourWorkInSync from "@/components/your-work-in-sync";
import EffortlessIntegration from "@/components/effortless-integration-updated";
import DiscussionModeration from "@/components/discussion-moderation";
import DocumentationSection from "@/components/documentation-section";
import FAQSection from "@/components/faq-section";
import CTASection from "@/components/cta-section";
import FooterSection from "@/components/footer-section";
import { Button } from "./components/ui/button";
import { authClient } from "@/lib/authClient";
import UpdatePricingSection from "./components/update-pricing-section";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Reusable Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-[#1a1a1a] shadow-[0px_0px_0px_4px_rgba(255,255,255,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(255,255,255,0.1)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center flex justify-center flex-col text-[#e5e5e5] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);
  const mountedRef = useRef(true);
  const router = useRouter();
  const session = authClient.useSession();

  const signIn = async () => {
    const freshSession = await authClient.getSession();
    if (freshSession.data?.user) {
      router.push("/dashboard");
      return;
    }
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  };

  // Fetch GitHub star count
  useEffect(() => {
    fetch("https://api.github.com/repos/stefanbinoj/gitbee")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fail if API request fails
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Transform navbar after scrolling past ~200px (first section)
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3);
          }
          return 0;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return;
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className="w-full min-h-screen relative bg-[#000000] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(255,255,255,0.1)] shadow-[1px_0px_0px_rgba(0,0,0,0.5)] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(255,255,255,0.1)] shadow-[1px_0px_0px_rgba(0,0,0,0.5)] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(255,255,255,0.1)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation - Scroll Reactive */}
            <div
              className={`w-full fixed left-0 top-0 flex justify-center items-center z-50 transition-all duration-300 ease-in-out pointer-events-none ${
                isScrolled
                  ? "h-12 sm:h-14 md:h-16 py-2"
                  : "h-16 sm:h-20 md:h-24 lg:h-28 py-4"
              }`}
            >
              <div
                className={`pointer-events-auto relative z-10 flex justify-between items-center transition-all duration-300 ease-in-out ${
                  isScrolled
                    ? "w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] h-10 sm:h-11 md:h-12 px-3 sm:px-4 md:px-5 bg-[#0a0a0a]/95 backdrop-blur-md rounded-full border border-[#eab308]/50 shadow-[0px_0px_0px_2px_rgba(255,255,255,0.1)]"
                    : "w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[1000px] h-14 sm:h-16 md:h-18 px-6 sm:px-8 md:px-10 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-full border border-[#eab308]/50"
                }`}
              >
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div
                      className={`flex flex-col justify-center text-[#eab308] font-medium leading-5 font-sans transition-all duration-300 ${
                        isScrolled
                          ? "text-sm sm:text-base md:text-lg lg:text-xl"
                          : "text-lg sm:text-xl md:text-2xl lg:text-3xl"
                      }`}
                    >
                      GitBee
                    </div>
                  </div>
                  <div
                    className={`flex justify-start items-start hidden sm:flex flex-row transition-all duration-300 ${
                      isScrolled
                        ? "pl-3 sm:pl-4 md:pl-5 gap-2 sm:gap-3 md:gap-4"
                        : "pl-6 sm:pl-8 md:pl-10 gap-4 sm:gap-6 md:gap-8"
                    }`}
                  >
                    <div className="flex justify-start items-center">
                      <div
                        className={`flex flex-col justify-center text-[rgba(255,255,255,0.70)] font-medium leading-[14px] font-sans hover:text-[#eab308] transition-colors cursor-pointer ${
                          isScrolled
                            ? "text-xs md:text-[13px]"
                            : "text-sm md:text-base"
                        }`}
                      >
                        Features
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div
                        className={`flex flex-col justify-center text-[rgba(255,255,255,0.70)] font-medium leading-[14px] font-sans hover:text-[#eab308] transition-colors cursor-pointer ${
                          isScrolled
                            ? "text-xs md:text-[13px]"
                            : "text-sm md:text-base"
                        }`}
                      >
                        Pricing
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div
                        className={`flex flex-col justify-center text-[rgba(255,255,255,0.70)] font-medium leading-[14px] font-sans hover:text-[#eab308] transition-colors cursor-pointer ${
                          isScrolled
                            ? "text-xs md:text-[13px]"
                            : "text-sm md:text-base"
                        }`}
                      >
                        Docs
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex justify-start items-center transition-all duration-300 ${
                    isScrolled
                      ? "h-6 sm:h-7 md:h-8 gap-2 sm:gap-3"
                      : "h-8 sm:h-10 md:h-11 gap-3 sm:gap-4"
                  }`}
                >
                  {/* GitHub Star Button */}
                  <a
                    href="https://github.com/stefanbinoj/gitbee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group bg-[#1a1a1a] shadow-[0px_1px_2px_rgba(0,0,0,0.3)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#252525] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:border-[#eab308]/50 ${
                      isScrolled
                        ? "px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] gap-1 sm:gap-1.5"
                        : "px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 gap-1.5 sm:gap-2"
                    }`}
                  >
                    {/* GitHub Icon */}
                    <svg
                      className={`text-[#ffffff] group-hover:text-[#eab308] transition-colors ${
                        isScrolled
                          ? "w-3.5 h-3.5 md:w-4 md:h-4"
                          : "w-4 h-4 md:w-5 md:h-5"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {/* Star Icon */}
                    <svg
                      className={`text-[#eab308] ${
                        isScrolled
                          ? "w-3 h-3 md:w-3.5 md:h-3.5"
                          : "w-3.5 h-3.5 md:w-4 md:h-4"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                    {/* Star Count */}
                    <span
                      className={`text-[#ffffff] group-hover:text-[#eab308] transition-colors font-medium font-sans ${
                        isScrolled
                          ? "text-xs md:text-[13px]"
                          : "text-xs md:text-sm"
                      }`}
                    >
                      {starCount !== null ? starCount : "Star"}
                    </span>
                  </a>
                  {/* Log in Button */}
                  <div
                    onClick={signIn}
                    className={`group bg-[#1a1a1a] shadow-[0px_1px_2px_rgba(0,0,0,0.3)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#252525] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:border-[#eab308]/50 ${
                      isScrolled
                        ? "px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px]"
                        : "px-4 sm:px-5 md:px-6 py-2 sm:py-[10px]"
                    }`}
                  >
                    <div
                      className={`flex flex-col justify-center text-[#ffffff] group-hover:text-[#eab308] transition-colors font-medium leading-5 font-sans ${
                        isScrolled
                          ? "text-xs md:text-[13px]"
                          : "text-sm md:text-base"
                      }`}
                    >
                      {session.data?.user ? "→" : "Log in"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#ffffff] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    Your friendly OSS
                    <br />
                    moderation assistant
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(255,255,255,0.70)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Keep your OSS community healthy and professional.
                    <br className="hidden sm:block" />
                    Monitor issues, filter irrelevant PRs, and enforce conduct.
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
                  <div className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-[#eab308] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.1)_inset] overflow-hidden rounded-full flex justify-center items-center hover:bg-[#ca8a04] transition-colors cursor-pointer">
                    <Button
                      className="flex flex-col justify-center text-black text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans cursor-pointer bg-transparent hover:bg-transparent border-none shadow-none"
                      onClick={() => {
                        signIn();
                      }}
                    >
                      Get started with GitHub
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
                  style={{
                    filter: "hue-rotate(35deg) saturate(1.2) brightness(1.2)",
                  }}
                />
              </div>

              <div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
                <div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px] bg-[#0a0a0a] shadow-[0px_0px_0px_0.9056603908538818px_rgba(255,255,255,0.1)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start border border-[rgba(255,255,255,0.1)]">
                  {/* Dashboard Content */}
                  <div className="self-stretch flex-1 flex justify-start items-start">
                    {/* Main Content */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Product Image 1 - Plan your schedules */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 0
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <Image
                            src="/img-1.png"
                            alt="img1"
                            fill
                            className=""
                          />
                        </div>

                        {/* Product Image 2 - Data to insights */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 1
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <Image
                            src="/img-2.png"
                            alt="img2"
                            fill
                            className=""
                          />
                        </div>

                        {/* Product Image 3 - Data visualization */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 2
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <Image
                            src="/img-3.png"
                            alt="img3"
                            fill
                            className="w-full h-full object-contain" // Changed from object-cover to object-contain to preserve landscape aspect ratio
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-stretch border-t border-[rgba(255,255,255,0.1)] border-b border-[rgba(255,255,255,0.1)] flex justify-center items-start">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Left decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                  {/* Feature Cards */}
                  <FeatureCard
                    title="Issue monitoring"
                    description="Get instant Slack notifications when new issues are created. Stay informed without constant GitHub checking."
                    isActive={activeCard === 0}
                    progress={activeCard === 0 ? progress : 0}
                    onClick={() => handleCardClick(0)}
                  />
                  <FeatureCard
                    title="PR relevance filter"
                    description="Automatically close irrelevant or spam PRs. GitBee checks if contributions align with your project scope."
                    isActive={activeCard === 1}
                    progress={activeCard === 1 ? progress : 0}
                    onClick={() => handleCardClick(1)}
                  />
                  <FeatureCard
                    title="Conduct enforcement"
                    description="Maintain professionalism with automated warnings. Users are blocked after 3+ violations of community guidelines."
                    isActive={activeCard === 2}
                    progress={activeCard === 2 ? progress : 0}
                    onClick={() => handleCardClick(2)}
                  />
                </div>

                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Right decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Proof Section */}
              <div className="w-full border-b border-[rgba(255,255,255,0.1)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(255,255,255,0.1)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="3"
                            width="4"
                            height="6"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="7"
                            y="1"
                            width="4"
                            height="8"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="2"
                            y="4"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="3.5"
                            y="4"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="2"
                            y="5.5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="3.5"
                            y="5.5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="8"
                            y="2"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="9.5"
                            y="2"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="8"
                            y="3.5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="9.5"
                            y="3.5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="8"
                            y="5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                          <rect
                            x="9.5"
                            y="5"
                            width="1"
                            height="1"
                            fill="#ffffff"
                          />
                        </svg>
                      }
                      text="Trusted by OSS"
                    />
                    <div className="w-full max-w-[472.55px] text-center flex justify-center flex-col text-[#ffffff] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Powering open source communities
                    </div>
                    <div className="self-stretch text-center text-[rgba(255,255,255,0.70)] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Maintainers save hours every week
                      <br className="hidden sm:block" />
                      by automating repetitive moderation tasks.
                    </div>
                  </div>
                </div>

                {/* Logo Grid */}
                <div className="self-stretch border-[rgba(255,255,255,0.1)] flex justify-center items-start border-t border-b-0">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(255,255,255,0.1)]">
                    {/* Logo Grid - Responsive grid */}
                    {Array.from({ length: 8 }).map((_, index) => {
                      const isMobileFirstColumn = index % 2 === 0;
                      const isMobileLastColumn = index % 2 === 1;
                      const isDesktopFirstColumn = index % 4 === 0;
                      const isDesktopLastColumn = index % 4 === 3;
                      const isMobileBottomRow = index >= 6;
                      const isDesktopTopRow = index < 4;
                      const isDesktopBottomRow = index >= 4;

                      return (
                        <div
                          key={index}
                          className={`
                            group h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex justify-center items-center gap-1 xs:gap-2 sm:gap-3
                            border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300 cursor-default
                            ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                            ${index >= 6 ? "border-b" : ""}
                            ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                            sm:border-r-[0.5px] sm:border-l-0
                            ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                            ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                            ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                            ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}
                            border-[rgba(255,255,255,0.1)]
                          `}
                        >
                          <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 relative shadow-[0px_-4px_8px_rgba(255,255,255,0.64)_inset] group-hover:shadow-[0px_-4px_8px_rgba(234,179,8,0.64)_inset] transition-all duration-300 overflow-hidden rounded-full">
                            <img
                              src="/horizon-icon.svg"
                              alt="Horizon"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-center flex justify-center flex-col text-[#ffffff] group-hover:text-[#eab308] transition-colors duration-300 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight md:leading-9 font-sans">
                            Acute
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid Section */}
              <div className="w-full border-b border-[rgba(255,255,255,0.1)] flex flex-col justify-center items-center">
                {/* Header Section */}
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(255,255,255,0.1)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="1"
                            width="4"
                            height="4"
                            stroke="#ffffff"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="7"
                            y="1"
                            width="4"
                            height="4"
                            stroke="#ffffff"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="1"
                            y="7"
                            width="4"
                            height="4"
                            stroke="#ffffff"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="7"
                            y="7"
                            width="4"
                            height="4"
                            stroke="#ffffff"
                            strokeWidth="1"
                            fill="none"
                          />
                        </svg>
                      }
                      text="Platform Features"
                    />
                    <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#ffffff] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Built for maintainers who value their time
                    </div>
                    <div className="self-stretch text-center text-[rgba(255,255,255,0.70)] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Focus on building great software
                      <br />
                      while GitBee handles the community work.
                    </div>
                  </div>
                </div>

                {/* Bento Grid Content */}
                <div className="self-stretch flex justify-center items-start">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(255,255,255,0.1)]">
                    {/* Top Left - Smart. Simple. Brilliant. */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#ffffff] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Timely notifications
                        </h3>
                        <p className="text-[rgba(255,255,255,0.70)] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Never miss a new issue. Get instant Slack
                          notifications so you can respond quickly.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden">
                        <SmartSimpleBrilliant
                          width="100%"
                          height="100%"
                          theme="dark"
                          className="scale-50 sm:scale-65 md:scale-75 lg:scale-90"
                        />
                      </div>
                    </div>

                    {/* Top Right - Your work, in sync */}
                    <div className="border-b border-[rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#ffffff] font-semibold leading-tight font-sans text-lg sm:text-xl">
                          PR relevance checking
                        </h3>
                        <p className="text-[rgba(255,255,255,0.70)] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Automatically close irrelevant or spam PRs. Focus only
                          on contributions that matter.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center">
                        <YourWorkInSync
                          width="400"
                          height="250"
                          theme="dark"
                          className="scale-60 sm:scale-75 md:scale-90"
                        />
                      </div>
                    </div>

                    {/* Bottom Left - Effortless integration */}
                    <div className="border-r-0 md:border-r border-[rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#ffffff] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Multiple integrations
                        </h3>
                        <p className="text-[rgba(255,255,255,0.70)] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Connect with Jira, Linear to sync with your new
                          issues.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent">
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                          <EffortlessIntegration
                            width={400}
                            height={250}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        {/* Gradient mask for soft bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Bottom Right - Numbers that speak */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#ffffff] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Discussion moderation
                        </h3>
                        <p className="text-[rgba(255,255,255,0.70)] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Help new users with their queries and guide them
                          through the process with professionalism.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <DiscussionModeration
                            width="100%"
                            height="100%"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Gradient mask for soft bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(255,255,255,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <DocumentationSection />

              {/* <TestimonialsSection /> */}

              <UpdatePricingSection />

              {/* FAQ Section */}
              <FAQSection />

              {/* CTA Section */}
              <CTASection />

              {/* Footer Section */}
              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FeatureCard component definition inline to fix import error
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-[#0a0a0a] shadow-[0px_0px_0px_0.75px_rgba(255,255,255,0.1)_inset]"
          : "border-l-0 border-r-0 md:border border-[rgba(255,255,255,0.1)]"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(255,255,255,0.1)]">
          <div
            className="h-full bg-[#eab308] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div
        className={`self-stretch flex justify-center flex-col text-[#ffffff] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans ${isActive ? "text-[#eab308]" : ""}`}
      >
        {title}
      </div>
      <div className="self-stretch text-[rgba(255,255,255,0.70)] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  );
}
