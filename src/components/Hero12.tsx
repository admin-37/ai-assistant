import { ExternalLink } from "lucide-react";
import logoImage from 'figma:asset/398625c55fb6dbe126f20f9712c64835e9687496.png';

import { cn } from "./ui/utils";

import { Button, buttonVariants } from "./ui/button";

interface Hero12Props {
  onGetStarted?: () => void;
}

const Hero12 = ({ onGetStarted }: Hero12Props) => {
  return (
    <section className="relative overflow-hidden py-16 px-4 md:py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
        />
      </div>
      <div className="relative z-10 container">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm overflow-hidden">
              <img
                src={logoImage}
                alt="logo"
                className="h-16 scale-150 object-cover object-center"
              />
            </div>
            <div>
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
               Transform Documents into Intelligent {" "}
                <span className="text-primary">Conversations</span>
              </h1>
              <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
                An AI Assistant that knows every detail, remembers everything, and answers instantly. <br />
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                className="shadow-sm transition-shadow hover:shadow"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
              <Button variant="outline" className="group">
                Learn more{" "}
                <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
            <div className="mt-12 md:mt-16 lg:mt-20 flex flex-col items-center gap-5">
              <p className="font-medium text-muted-foreground text-center">
                Built with open-source technologies
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-icon.svg"
                    alt="shadcn/ui logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg"
                    alt="TypeScript logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>

                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg"
                    alt="React logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
                <a
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "group flex aspect-square h-12 items-center justify-center p-0",
                  )}
                >
                  <img
                    src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg"
                    alt="Tailwind CSS logo"
                    className="h-6 saturate-0 transition-all group-hover:saturate-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero12 };