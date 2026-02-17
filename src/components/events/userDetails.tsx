"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { stateEnum } from "~/db/enum";
import { apiFetch } from "~/lib/fetcher";
import { cn } from "~/lib/utils";
import { type EventUserInput, eventUserSchema } from "~/lib/validation/event";

interface College {
  id: string;
  name: string | null;
  state: string | null;
}

type FormValues = EventUserInput;

export function UserDetailsForm() {
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(eventUserSchema),
    defaultValues: {
      state: undefined,
      gender: undefined,
      collegeId: "",
    },
  });

  useEffect(() => {
    async function loadColleges() {
      try {
        const result = await apiFetch<{ colleges: College[] }>(
          "/api/colleges/list",
        );
        setColleges(result?.colleges ?? []);
      } catch (_err) {
        toast.error("Failed to load colleges");
      } finally {
        setLoadingColleges(false);
      }
    }
    loadColleges();
  }, []);

  async function onSubmit(data: EventUserInput) {
    try {
      setSubmitting(true);

      await apiFetch("/api/events/userDetails", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.success("Registered successfully");
      router.push("/teams");
      router.refresh();
    } catch (_err) {
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={true}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Registration</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>State</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ?? "Select state"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search state..." />
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>

                          {stateEnum.enumValues.map((state) => (
                            <CommandItem
                              key={state}
                              value={state}
                              onSelect={() => field.onChange(state)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  state === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {state}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* College */}
            <FormField
              control={form.control}
              name="collegeId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>College</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? colleges.find((c) => c.id === field.value)?.name
                            : loadingColleges
                              ? "Loading..."
                              : "Select college"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search college..." />
                        <CommandList>
                          <CommandEmpty>No college found.</CommandEmpty>

                          {colleges.map((college) => (
                            <CommandItem
                              key={college.id}
                              value={`${college.name} ${college.state}`}
                              onSelect={() => field.onChange(college.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  college.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {college.name} ({college.state})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
