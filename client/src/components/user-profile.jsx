import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ParticipationChart from "./ParticipationChart";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import SubjectPerformanceAccordion from "./SubjectPerformanceCharts";
import { Button } from "@/components/ui/button"; // Only one correct import
import { useClerk } from "@clerk/clerk-react";

const UserProfile = ({ user }) => {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  const { signOut, openUserProfile } = useClerk(); // get Clerk functions

  // fetch whenever sheet opens
  useEffect(() => {
    if (!isSheetOpen || !user?.id) return;
    console.log(user.fullName)

    setLoading(true);
    axios
      .get(`http://localhost:5000/v1/chart/${user.id}`)
      .then(({ data: resp }) => {
        if (resp.success) {
          const fetched = resp.data;
          setRawData(fetched);

          // derive & sort years descending
          const yrs = Array.from(
            new Set(fetched.dates.map((d) => new Date(d).getFullYear()))
          ).sort((a, b) => b - a);

          setAvailableYears(yrs);
          setSelectedYear(yrs[0] || new Date().getFullYear());
        }
      })
      .catch((err) => console.error("Fetch failed:", err))
      .finally(() => setLoading(false));
  }, [isSheetOpen, user?.id]);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-black text-white">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent className="h-full bg-zinc-950 px-5 py-5 overflow-y-auto scrollbar-black">
        <SheetHeader className="p-0 text-2xl gap-0">
          <SheetTitle className="leading-tight capitalize">
            {user?.fullName || "User Profile"}
          </SheetTitle>
          <SheetDescription className="text-xs text-gray-400">
            Your personalized dashboard
          </SheetDescription>
          <div className="flex w-full justify-between mt-4 opacity-80">
            <Button
              onClick={openUserProfile}
              className="bg-black text-white hover:bg-neutral-900 transition-all duration-500 border"
            >
              Manage Account
            </Button>

            <Button
              onClick={() => signOut()}
              className="bg-zinc-900 hover:bg-zinc-950 text-white hover:text-red-500 duration-300 transition-all"
            >
              Log Out
            </Button>
          </div>
        </SheetHeader>

        <h1 className="text-xl border-t pt-2 capitalize mt-4">
          Participation Statistics
        </h1>

        {loading ? (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto">
              {[2023, 2024].map(
                (
                  y // Placeholder years for skeleton
                ) => (
                  <Skeleton key={y} className="h-8 w-16 rounded-md" />
                )
              )}
            </div>
            <Skeleton className="h-70 w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ) : rawData?.dates?.length > 0 ? (
          <>
            <ParticipationChart
              rawData={rawData}
              loading={false} // No longer needed since we handled loading
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              availableYears={availableYears}
            />

            <div className="mt-6">
              <h1 className="text-xl capitalize">Performance</h1>
              <SheetDescription className="text-xs mb-2">
                User performance across subjects
              </SheetDescription>

              {loading ? (
                <div className="flex gap-4 flex-col">
                  {Array(4)
                    .fill(0)
                    .map((_, idx) => (
                      <Skeleton key={idx} className="h-12 w-full rounded-lg" />
                    ))}
                </div>
              ) : rawData?.topics?.length ? (
                <Accordion type="single" collapsible className="w-full">
                  {rawData.topics.map((topic) => (
                    <AccordionItem key={topic} value={topic}>
                      <AccordionTrigger className="capitalize hover:no-underline">
                        {topic}
                      </AccordionTrigger>
                      <AccordionContent>
                        <SubjectPerformanceAccordion
                          userId={user.id}
                          topic={topic}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground">No topics found</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No records found</p>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
