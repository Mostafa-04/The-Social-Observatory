
import React from "react";
import { ArrowUpRight, Globe2, Users, Landmark, Sparkles } from "lucide-react";

const AfricaChallenge = () => {
  return (
    <section
      id="africa-challenge"
      className="relative overflow-hidden bg-[#f7f5f1] py-24 sm:py-28 lg:py-32"
    >
      {/* Decorative background */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#bf5429]/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#174f4b]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#bf5429]" />

            <span className="text-xs font-medium uppercase tracking-[0.25em] text-[#bf5429]">
              Interactive Experience
            </span>

            <span className="h-px w-8 bg-[#bf5429]" />
          </div>

          <h2 className="font-display text-4xl font-medium tracking-tight text-[#1f2d2d] sm:text-5xl lg:text-6xl">
            How well do you know{" "}
            <span className="text-[#bf5429]">Africa?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#1f2d2d]/65 sm:text-lg">
            Explore the diversity of Africa through an interactive challenge
            covering 54 countries, their capitals, populations and cultures.
          </p>
        </div>

        {/* Main Card */}
        <div className="mx-auto mt-14 max-w-5xl">
          <div className="group relative overflow-hidden rounded-[2rem] bg-[#1f2d2d] shadow-2xl">

            {/* Background decorations */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#bf5429]/20 blur-3xl transition-transform duration-700 group-hover:scale-125" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#174f4b]/40 blur-3xl" />

            <div className="relative grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:p-14">

              {/* Left content */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <Sparkles size={14} className="text-[#bf5429]" />
                  Africa Challenge
                </div>

                <h3 className="font-display text-3xl font-medium leading-tight text-white sm:text-4xl">
                  Discover Africa,
                  <br />
                  <span className="text-[#bf5429]">
                    one country at a time.
                  </span>
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Test your knowledge and discover fascinating facts about
                  African countries. Read the clues, choose your answer and
                  reveal the country.
                </p>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5">

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <Globe2
                      size={21}
                      className="mx-auto text-[#bf5429]"
                    />

                    <p className="mt-2 text-xl font-semibold text-white">
                      54
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-white/45">
                      Countries
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <Users
                      size={21}
                      className="mx-auto text-[#bf5429]"
                    />

                    <p className="mt-2 text-xl font-semibold text-white">
                      Culture
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-white/45">
                      Discover
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <Landmark
                      size={21}
                      className="mx-auto text-[#bf5429]"
                    />

                    <p className="mt-2 text-xl font-semibold text-white">
                      Capitals
                    </p>

                    <p className="text-[10px] uppercase tracking-wider text-white/45">
                      Explore
                    </p>
                  </div>

                </div>

                {/* Button */}
                <div className="mt-9">

                  <a
                    href="https://guess-the-country-eight.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/button relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#bf5429] px-7 py-4 font-semibold text-white shadow-lg shadow-[#bf5429]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#a84823] hover:shadow-xl hover:shadow-[#bf5429]/30 active:scale-95 sm:w-auto"
                  >
                    <span>
                      Play the Africa Challenge
                    </span>

                    <ArrowUpRight
                      size={19}
                      className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
                    />

                    {/* Shine */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
                  </a>

                </div>
              </div>

              {/* Right visual */}
              <div className="relative mx-auto w-full max-w-md">

                <div className="relative aspect-square">

                  {/* Outer circles */}
                  <div className="absolute inset-5 rounded-full border border-white/10" />
                  <div className="absolute inset-12 rounded-full border border-[#bf5429]/20" />
                  <div className="absolute inset-20 rounded-full border border-white/5" />

                  {/* Glow */}
                  <div className="absolute inset-12 rounded-full bg-[#bf5429]/10 blur-3xl" />

                  {/* Main card */}
                  <div className="absolute inset-12 flex rotate-3 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:rotate-0">

                    

                    
                        <img
                            src="/african.jpg"
                            alt="Africa Challenge"
                            className="mx-auto rounded-2xl h-full w-full  object-cover"
                        />

                   
                  </div>

                  {/* Floating dots */}
                  <span className="absolute right-4 top-16 h-3 w-3 animate-pulse rounded-full bg-[#bf5429]" />
                  <span className="absolute bottom-16 left-4 h-2 w-2 animate-pulse rounded-full bg-white/70" />

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AfricaChallenge;
