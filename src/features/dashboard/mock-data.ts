import type {
  DashboardData,
  DashboardDataMode,
  NotificationItem,
} from "@/features/dashboard/types";
import { delay } from "@/utils/helpers";

const fullData: DashboardData = {
  greetingName: "Michael",
  stats: [
    { key: "activeDossiers", value: 0 },
    { key: "unreadMessages", value: 0 },
    { key: "upcomingDeadlines", value: 0 },
  ],
  dossiers: [
    { id: "1", organization: "Acme Corporation", dossier: "ISO 27001", role: "Admin", progress: 15 },
    { id: "2", organization: "Stark Industries", dossier: "VCA 201", role: "Auditor", progress: 54 },
    { id: "3", organization: "Beta Solutions", dossier: "ISO 4500", role: "Contributor", progress: 12 },
    { id: "4", organization: "Wayne Enterprises", dossier: "ISO 27001", role: "Reviewer", progress: 23 },
    { id: "5", organization: "Google", dossier: "VCA 201", role: "Auditor", progress: 85 },
    { id: "6", organization: "Facebook", dossier: "ISO 27001", role: "Uploader", progress: 90 },
    { id: "7", organization: "Acme Corporation", dossier: "ISO 4500", role: "Auditor", progress: 100 },
    { id: "8", organization: "Wayne Enterprises", dossier: "VCA 201", role: "Reviewer", progress: 45 },
    { id: "9", organization: "Beta Solutions", dossier: "ISO 4500", role: "Contributor", progress: 10 },
    { id: "10", organization: "Acme Corporation", dossier: "VCA 201", role: "Auditor", progress: 75 },
    { id: "11", organization: "Wayne Enterprises", dossier: "ISO 27001", role: "Contributor", progress: 60 },
    { id: "12", organization: "Beta Solutions", dossier: "VCA", role: "Reviewer", progress: 30 },
    { id: "13", organization: "Beta Solutions", dossier: "VCA", role: "Auditor", progress: 100 },
  ],
};

const emptyData: DashboardData = {
  ...fullData,
  dossiers: [],
};

export async function fetchDashboardData(
  mode: DashboardDataMode,
): Promise<DashboardData> {
  await delay(450);
  return mode === "empty" ? emptyData : fullData;
}

export const notificationItems: NotificationItem[] = [
  {
    id: "n-1",
    title: "Assessment completed for CH-01 by",
    actor: "Fydron",
    time: "11:09 AM",
    relativeTime: "5 sec ago",
    dayLabel: "Today",
    unread: true,
    hasMention: false,
    actionLabel: "Cta button",
  },
  {
    id: "n-2",
    title: "New version of indicator_evidence.pdf uploaded by",
    actor: "Client Adams Luton",
    time: "09:42 AM",
    relativeTime: "2 hours ago",
    dayLabel: "Today",
    unread: false,
    hasMention: false,
    actionLabel: "Cta button",
  },
  {
    id: "n-3",
    title: "New version of Policy.pdf uploaded by",
    actor: "Client Everly",
    time: "07:20 AM",
    relativeTime: "5 hours ago",
    dayLabel: "Today",
    unread: true,
    hasMention: true,
    actionLabel: "Cta button",
  },
  {
    id: "n-4",
    title: "Access Granted",
    actor: "",
    time: "07:20 AM",
    relativeTime: "19 hours ago",
    dayLabel: "Yesterday",
    unread: false,
    hasMention: false,
    actionLabel: "Cta button",
  },
  {
    id: "n-5",
    title: "Access Granted",
    actor: "",
    time: "07:20 AM",
    relativeTime: "21 hours ago",
    dayLabel: "Yesterday",
    unread: false,
    hasMention: false,
    actionLabel: "Cta button",
  },
];
