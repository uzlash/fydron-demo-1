"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Button,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  Switch,
  Text,
  Textarea,
} from "@fluentui/react-components";
import type { MenuButtonProps } from "@fluentui/react-components";
import { Add16Regular, ArrowUpRight16Regular, Filter16Regular, Search16Regular } from "@fluentui/react-icons";
import { clientProfileRoleBadgeClass } from "@/features/client-portfolio/components/client-profile-role-badge";
import { CLIENT_DANGER_BUTTON_CLASS } from "@/features/client-portfolio/components/client-danger-button-classes";
import { DeactivateClientDialog } from "@/features/client-portfolio/components/deactivate-client-dialog";
import type { ClientProfile, ClientProfileUser } from "@/features/client-portfolio/types";
import { useLocale } from "@/i18n/locale-context";

function LegalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="shrink-0 text-[12px] text-secondary">{label}</span>
      <span className="min-w-0 break-words text-right text-[14px] text-foreground sm:max-w-[60%]">{value}</span>
    </div>
  );
}

function PersonCard({
  person,
  title,
  showPhone,
}: {
  person: { name: string; role: string; email: string; phone?: string; avatarName: string };
  title: string;
  showPhone?: boolean;
}) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile.overview;
  return (
    <div>
      <Text weight="semibold" className="mb-2 block text-[15px] text-foreground">
        {title}
      </Text>
      <div className="rounded-[4px] border border-border bg-surface p-4 shadow-sm">
        <div className="flex gap-3">
          <Avatar name={person.avatarName} color="colorful" size={40} className="shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-foreground">{person.name}</p>
            <p className="text-[13px] text-secondary">{person.role}</p>
          </div>
        </div>
        <div className="mt-4 border-t border-border pt-3">
          <a href={`mailto:${person.email}`} className="text-[14px] text-primary hover:underline">
            {person.email}
          </a>
          {showPhone && person.phone ? (
            <p className="mt-1 text-[14px] text-foreground">
              <span className="text-secondary">{p.phone}:</span> {person.phone}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type OverviewPanelProps = { profile: ClientProfile };

export function ClientProfileOverviewPanel({ profile }: OverviewPanelProps) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile.overview;
  const l = p.labels;
  const leg = profile.legal;
  const [note, setNote] = useState("");

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <Text weight="semibold" className="mb-2 block text-[15px] text-foreground">
          {p.legalData}
        </Text>
        <div className="rounded-[4px] border border-border bg-surface px-4 shadow-sm">
          <LegalRow label={l.legalName} value={leg.legalName} />
          <LegalRow label={l.kvk} value={leg.kvkNumber} />
          <LegalRow label={l.vat} value={leg.vatNumber} />
          <LegalRow label={l.address} value={leg.address} />
          <LegalRow label={l.country} value={leg.country} />
          <LegalRow label={l.organisationType} value={leg.organisationType} />
        </div>
        <div className="mt-6">
          <PersonCard person={profile.accountManager} title={p.accountManager} showPhone={false} />
        </div>
      </div>
      <div>
        <PersonCard person={profile.primaryContact} title={p.primaryContact} showPhone />
        <div className="mt-6">
          <Text weight="semibold" className="mb-2 block text-[15px] text-foreground">
            {p.addNote}
          </Text>
          <div className="overflow-hidden rounded-[4px] border border-border bg-surface shadow-sm">
            <Textarea
              className="min-h-[120px] w-full rounded-none border-0 !bg-transparent !shadow-none focus-visible:ring-0"
              value={note}
              onChange={(_, d) => setNote(d.value)}
              resize="vertical"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type UsersPanelProps = { users: ClientProfileUser[] };

export function ClientProfileUsersPanel({ users }: UsersPanelProps) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile;
  const u = p.users;
  const rolesT = p.roles;
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(
      (x) => x.name.toLowerCase().includes(s) || x.email.toLowerCase().includes(s),
    );
  }, [q, users]);

  return (
    <div className="mt-4">
      <Text weight="semibold" className="mb-3 block text-[16px] text-foreground">
        {u.title}
      </Text>
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="w-full min-w-0 sm:max-w-[min(100%,400px)]">
          <Input
            placeholder={u.searchPlaceholder}
            value={q}
            onChange={(_, d) => setQ(d.value)}
            className="h-9 w-full"
            size="small"
            contentBefore={<Search16Regular className="text-muted" />}
          />
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 self-end sm:self-center">
          <Button appearance="outline" className="h-9 min-h-9 rounded-[4px] border-border-strong" icon={<Filter16Regular />}>
            {u.filterByRole}
          </Button>
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              {(triggerProps: MenuButtonProps) => (
                <SplitButton
                  appearance="primary"
                  className="h-9 min-h-9 rounded-[4px] font-medium"
                  icon={<Add16Regular />}
                  iconPosition="before"
                  menuButton={triggerProps}
                  primaryActionButton={{ onClick: () => undefined }}
                  size="medium"
                >
                  {u.inviteUser}
                </SplitButton>
              )}
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => undefined}>{u.inviteFromOrg}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-[4px] border border-border">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 border-b border-border bg-surface text-left text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">{u.columns.name}</th>
              <th className="px-4 py-3 font-medium">{u.columns.email}</th>
              <th className="px-4 py-3 font-medium">
                {u.columns.roles} ↕
              </th>
              <th className="px-4 py-3 font-medium">{u.columns.lastActivity}</th>
              <th className="px-4 py-3 font-medium text-right">{u.columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border-soft transition-colors last:border-b-0 hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar name={row.name} size={32} color="colorful" className="shrink-0" />
                    <span className="text-[14px] font-medium text-foreground">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-secondary">{row.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {row.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex h-5 items-center rounded-[4px] px-1.5 text-[10px] font-semibold ${clientProfileRoleBadgeClass(role)}`}
                      >
                        {rolesT[role]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-foreground">{row.lastActivity}</td>
                <td className="px-4 py-3 text-right">
                  <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] border-border-strong text-[12px]">
                    {u.edit}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type DossiersPanelProps = { profile: ClientProfile };

export function ClientProfileDossiersPanel({ profile }: DossiersPanelProps) {
  const { t } = useLocale();
  const p = t.clientPortfolio.profile.dossiers;
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return profile.frameworks;
    return profile.frameworks.filter((f) => f.name.toLowerCase().includes(s));
  }, [q, profile.frameworks]);

  return (
    <div className="mt-4">
      <Text weight="semibold" className="mb-3 block text-[16px] text-foreground">
        {p.title}
      </Text>
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="w-full min-w-0 sm:max-w-[min(100%,400px)]">
          <Input
            placeholder={p.searchPlaceholder}
            value={q}
            onChange={(_, d) => setQ(d.value)}
            className="h-9 w-full"
            size="small"
            contentBefore={<Search16Regular className="text-muted" />}
          />
        </div>
        <div className="shrink-0 self-end sm:self-center">
          <Menu>
            <MenuTrigger disableButtonEnhancement>
              {(triggerProps: MenuButtonProps) => (
                <SplitButton
                  appearance="primary"
                  className="h-9 min-h-9 rounded-[4px] font-medium"
                  icon={<Add16Regular />}
                  iconPosition="before"
                  menuButton={triggerProps}
                  primaryActionButton={{ onClick: () => undefined }}
                  size="medium"
                >
                  {p.addFramework}
                </SplitButton>
              )}
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => undefined}>{p.selectExisting}</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-[4px] border border-border">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead className="sticky top-0 z-10 border-b border-border bg-surface text-left text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">{p.columns.framework}</th>
              <th className="px-4 py-3 font-medium">{p.columns.progress}</th>
              <th className="px-4 py-3 font-medium">{p.columns.lastUpdated}</th>
              <th className="px-4 py-3 font-medium text-right">{p.columns.action}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((fw) => (
              <tr
                key={fw.id}
                className="border-b border-border-soft transition-colors last:border-b-0 hover:bg-surface-muted/60"
              >
                <td className="px-4 py-3 text-[14px] font-medium text-foreground">{fw.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-[120px] max-w-full overflow-hidden rounded-sm bg-surface-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${fw.progress}%` }}
                      />
                    </div>
                    <span className="w-9 min-w-9 text-[13px] tabular-nums text-foreground">{fw.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px] text-foreground">{fw.lastUpdated}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/matrix/${fw.matrixDossierId}`}
                    className="inline-flex h-8 min-h-8 items-center justify-center gap-1.5 rounded-[4px] border border-border bg-surface px-3 text-[12px] text-foreground transition-colors hover:bg-surface-muted"
                  >
                    {p.openMatrix}
                    <ArrowUpRight16Regular className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type SettingsPanelProps = { onDeactivateSuccess: () => void };

export function ClientProfileSettingsPanel({ onDeactivateSuccess }: SettingsPanelProps) {
  const { t } = useLocale();
  const s = t.clientPortfolio.profile.settings;
  const [reminders, setReminders] = useState(true);
  const [advisor, setAdvisor] = useState(true);
  const [evidence, setEvidence] = useState(false);
  const [activity, setActivity] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div className="mt-4 max-w-3xl">
      <div className="overflow-hidden rounded-[8px] border border-border bg-surface shadow-sm">
        <div className="px-5 py-4">
          <Text weight="semibold" className="block text-[16px] leading-snug text-foreground">
            {s.clientRelationship}
          </Text>
          <ul className="mt-1 divide-y divide-border">
            <li className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0 pr-2">
                <p className="text-[14px] font-medium text-foreground">{s.autoReminders}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-secondary">{s.autoRemindersDescription}</p>
              </div>
              <Switch
                checked={reminders}
                onChange={(_, d) => setReminders(d.checked)}
                className="shrink-0"
                label={{ children: s.autoReminders, className: "sr-only" }}
              />
            </li>
            <li className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0 pr-2">
                <p className="text-[14px] font-medium text-foreground">{s.advisorApproval}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-secondary">{s.advisorApprovalDescription}</p>
              </div>
              <Switch
                checked={advisor}
                onChange={(_, d) => setAdvisor(d.checked)}
                className="shrink-0"
                label={{ children: s.advisorApproval, className: "sr-only" }}
              />
            </li>
          </ul>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="px-5 py-4">
          <Text weight="semibold" className="block text-[16px] leading-snug text-foreground">
            {s.notifications}
          </Text>
          <ul className="mt-1 divide-y divide-border">
            <li className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0 pr-2">
                <p className="text-[14px] font-medium text-foreground">{s.notifyEvidence}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-secondary">{s.notifyEvidenceDescription}</p>
              </div>
              <Switch
                checked={evidence}
                onChange={(_, d) => setEvidence(d.checked)}
                className="shrink-0"
                label={{ children: s.notifyEvidence, className: "sr-only" }}
              />
            </li>
            <li className="flex items-start justify-between gap-4 py-4">
              <div className="min-w-0 pr-2">
                <p className="text-[14px] font-medium text-foreground">{s.notifyActivity}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-secondary">{s.notifyActivityDescription}</p>
              </div>
              <Switch
                checked={activity}
                onChange={(_, d) => setActivity(d.checked)}
                className="shrink-0"
                label={{ children: s.notifyActivity, className: "sr-only" }}
              />
            </li>
          </ul>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="px-5 py-4 pb-5">
          <Text weight="semibold" className="block text-[16px] leading-snug text-foreground">
            {s.account}
          </Text>
          <div className="mt-3 rounded-[4px] border border-[#f1bbbc] bg-[#fef6f6] p-4">
            <p className="text-[15px] font-semibold text-foreground">{s.deactivateTitle}</p>
            <p className="mt-1 text-[13px] leading-snug text-secondary">{s.deactivateDescription}</p>
            <Button
              appearance="primary"
              className={`mt-4 h-8 min-h-8 rounded-[4px] px-4 text-[13px] ${CLIENT_DANGER_BUTTON_CLASS}`}
              onClick={() => setDeactivateOpen(true)}
            >
              {s.deactivateCta}
            </Button>
          </div>
        </div>
      </div>

      <DeactivateClientDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => {
          setDeactivateOpen(false);
          onDeactivateSuccess();
        }}
      />
    </div>
  );
}
