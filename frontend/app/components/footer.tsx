"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/language-context";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-emerald-950 text-emerald-100 border-t border-emerald-900 transition-all">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Foras Khadra Logo"
                width={180}
                height={60}
                className="h-14 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-sm text-emerald-200/80 max-w-xs leading-relaxed">
              {t.heroDescription.substring(0, 150)}...
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-emerald-300 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 1 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              {t.footerBrowseOpp}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link href="/#opportunities" className="hover:text-white transition-colors">
                  {t.allOpportunities}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=competitions" className="hover:text-white transition-colors">
                  {t.competitions}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=conferences" className="hover:text-white transition-colors">
                  {t.conferences}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=volunteering" className="hover:text-white transition-colors">
                  {t.volunteering}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              {t.footerBrowseJobs}
            </h3>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link href="/#opportunities?type=jobs" className="hover:text-white transition-colors">
                  {t.jobs}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=scholarships" className="hover:text-white transition-colors">
                  {t.scholarships}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=fellowships" className="hover:text-white transition-colors">
                  {t.fellowships}
                </Link>
              </li>
              <li>
                <Link href="/#opportunities?type=internships" className="hover:text-white transition-colors">
                  {t.internships}
                </Link>
              </li>
            </ul>
          </div>


        </div>

        {/* Policies & Bottom border */}
        <div className="mt-12 border-t border-emerald-900 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-emerald-300/70">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/#privacy" className="hover:text-emerald-100 transition-colors">
              {t.privacyPolicy}
            </Link>
            <Link href="/#usage" className="hover:text-emerald-100 transition-colors">
              {t.usagePolicy}
            </Link>
            <Link href="/#terms" className="hover:text-emerald-100 transition-colors">
              {t.termsAndConditions}
            </Link>
          </div>
          <p className="md:order-1">
            {t.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
};
