import * as React from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Lifafa-Icon.svg";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-row items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Image src={Logo} alt="Logo" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @DsouzaJovian
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
