"use client";

import { Compass, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getEventAttributes } from "./utils";
import EventDrawer from "./drawer";
import EventDetails from "./details";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  type: "Solo" | "Team";
  status: "Draft" | "Published" | "Ongoing" | "Completed";
  audience: "Participants" | "Non-Participants" | "Both";
  maxTeams: number;
  minTeamSize: number;
  maxTeamSize: number;
  image?: string;
  deadline: string;
};

const Events = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">(
    "right",
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setDrawerDirection(mobile ? "bottom" : "right");
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          console.log("Fetched events:", data.data);
          setEvents(data.data);
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (id: string) => {
    const event = events.find((event) => event.id === id) as Event;
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <EventDrawer
        event={selectedEvent}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerDirection={drawerDirection}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide text-[#133c55] drop-shadow-[0_0_12px_rgba(255,191,0,1)]">
            Events
          </h1>
        </div>
        {loading ? (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16 md:gap-10 gap-6 justify-center items-center">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="w-full max-w-xs bg-[#0f1823]">
                <CardHeader>
                  <Skeleton className="h-4 w-2/3 bg-[#133c55]" />
                  <Skeleton className="h-4 w-1/2 bg-[#133c55]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="aspect-video w-full bg-[#133c55]" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length > 0 ? (
          <EventDetails events={events} handleCardClick={handleCardClick} />
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md flex flex-col p-10 rounded-xl gap-5 justify-center items-center text-center text-white text-xl">
              <TriangleAlert size={50} />
              No events found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
