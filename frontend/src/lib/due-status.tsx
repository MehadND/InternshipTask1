import {
  endOfDay,
  formatDistanceToNowStrict,
  parseISO,
  startOfDay,
} from "date-fns";
import { TimerIcon, TimerOffIcon } from "lucide-react";

export const getDueDateStatus = (dueDate: string | undefined | null) => {
  if (typeof dueDate === "undefined" || dueDate === undefined) {
    return <TimerOffIcon className="text-failure mr-1" />;
  }
  if (!dueDate) return;
  const date = parseISO(dueDate);
  const now = new Date();

  const isToday = date >= startOfDay(now) && date <= endOfDay(now);
  const isTomorrow =
    date > endOfDay(now) && date <= endOfDay(now.setDate(now.getDate() + 1));
  const isYesterday =
    date < startOfDay(now) &&
    date >= startOfDay(now.setDate(now.getDate() - 1));

  if (isToday) {
    return (
      <>
        <TimerIcon className="text-failure mr-1" />
        <span className="text-failure capitalize">due today</span>
      </>
    );
  } else if (isTomorrow) {
    return (
      <>
        <TimerIcon className="text-failure mr-1" />
        <span className="text-failure capitalize">due tomorrow</span>
      </>
    );
  } else if (isYesterday) {
    return (
      <>
        <TimerIcon className="text-failure mr-1" />
        <span className="text-failure capitalize">past due yesterday</span>
      </>
    );
  } else if (date < startOfDay(now)) {
    return (
      <>
        <TimerIcon className="text-failure mr-1" />
        <span className="text-failure capitalize">
          past due {formatDistanceToNowStrict(date, { addSuffix: true })}
        </span>
      </>
    );
  } else {
    return (
      <>
        <TimerIcon className="mr-1" />
        <span className="capitalize">
          due {formatDistanceToNowStrict(date, { addSuffix: true })}
        </span>
      </>
    );
  }
};
