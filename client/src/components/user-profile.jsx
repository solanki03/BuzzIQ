import React, { useState } from "react";
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

const UserProfile = ({ user }) => {
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  const handleOpenSheet = async () => {
    if (!user?.id) {
      setIsSheetOpen(true);
      return;
    }

    setIsSheetOpen(true);
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/v1/chart/${user.id}`
      );
      if (response.data.success) {
        const fetchedData = response.data.data;
        setRawData(fetchedData);

        const years = [
          ...new Set(
            fetchedData.map((item) => new Date(item.date).getFullYear())
          ),
        ].sort((a, b) => b - a);
        setAvailableYears(years);
        setSelectedYear(years[0] || new Date().getFullYear());
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger onClick={handleOpenSheet}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-black text-white">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent className="h-full bg-zinc-950 z-[120] px-5 py-5 overflow-y-auto scrollbar-black">
        <SheetHeader className="p-0 text-2xl">
          <SheetTitle>{user?.fullName || "User Profile"}</SheetTitle>
          <SheetDescription className="text-xs">
            Your personalized dashboard displaying participation statistics and
            subject-wise performance insights.
          </SheetDescription>
        </SheetHeader>

        <h1 className="text-xl border-t pt-2 capitalize mt-4">
          Participation Statistics
        </h1>

        <ParticipationChart
          rawData={rawData}
          loading={loading}
          selectedYear={selectedYear}
          availableYears={availableYears}
          setSelectedYear={setSelectedYear}
        />

        <div>
        <h1 className="text-xl border-t pt-2 capitalize mt-4">
          Performance
        </h1>
        <SheetDescription className="text-xs">
            User performance upon different subjects
          </SheetDescription>
        {AccordionDemo()}
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
