"use client";

import * as React from "react";
import { addDays, format, isAfter } from "date-fns";
import { Calendar as CalendarIcon, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/lib/media-query";

interface DatePickerWithPresetsProps {
  onChange: (date: Date | null) => void;
  selectedDate: Date | null;
  disabled: boolean;
}

export const DatePickerWithPresets: React.FC<DatePickerWithPresetsProps> = ({
  onChange,
  selectedDate,
  disabled,
}) => {
  const [date, setDate] = React.useState<Date | null>(selectedDate);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleSelectDate = (selectedDate: Date) => {
    setError("");
    if (
      isAfter(selectedDate, new Date()) ||
      format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
    ) {
      setDate(selectedDate);
      setError("");
    } else {
      setError("Please select a date after today.");
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (newDate) {
      onChange(newDate);
      setOpen(false);
    }
  };

  const handleResetDate = () => {
    setDate(null);
    onChange(null);
  };

  if (isDesktop) {
    return (
      <div className="flex items-center gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              onClick={() => setOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-4 p-4">
            <Select
              onValueChange={(value) =>
                handleDateChange(addDays(new Date(), parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Due" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Today</SelectItem>
                <SelectItem value="1">Tomorrow</SelectItem>
                <SelectItem value="3">In 3 days</SelectItem>
                <SelectItem value="7">In a week</SelectItem>
              </SelectContent>
            </Select>
            {error && <span className="text-destructive">{error}</span>}
            <div className="rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelectDate}
              />
            </div>
          </PopoverContent>
        </Popover>
        {date && (
          <Button
            variant="outline"
            className="h-10 w-10 p-0 flex items-center justify-center"
            onClick={handleResetDate}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"ghost"}
            size={"icon"}
            className={cn(
              "w-full sm:w-fit font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={() => setOpen(true)}
          >
            {date ? (
              <span>{format(date, "PPPP")}</span>
            ) : (
              <CalendarIcon className="sm:w-4 sm:h-4" />
            )}
            <span className="sr-only">Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col space-y-4 p-4">
          <Select
            onValueChange={(value) =>
              handleDateChange(addDays(new Date(), parseInt(value)))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Due" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">In 3 days</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
            </SelectContent>
          </Select>
          {date && <span>selected date: {format(date, "PPPP")}</span>}
          {error && <span className="text-destructive">{error}</span>}
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
            />
          </div>
        </PopoverContent>
      </Popover>
      {date && (
        <Button
          variant="outline"
          className="h-10 w-10 p-0 flex items-center justify-center"
          onClick={handleResetDate}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
