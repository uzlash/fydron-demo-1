"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
} from "@fluentui/react-components";
import type { MenuButtonProps } from "@fluentui/react-components";
import {
  Add16Regular,
  Archive20Regular,
  ChevronRight20Regular,
  Dismiss20Regular,
  DismissCircle20Regular,
  Filter16Regular,
  MoreHorizontal20Regular,
  Search20Regular,
} from "@fluentui/react-icons";
import { useLocale } from "@/i18n/locale-context";

type UMTab = "users" | "dossiers";

type MatrixUserRole = "Admin" | "Auditor" | "Reviewer" | "User";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: MatrixUserRole;
  lastLogin: string;
};

type DossierRow = {
  id: string;
  name: string;
  framework: string;
  org: string;
};

const usersSeed: UserRow[] = [
  { id: "u1", name: "Jordan Hughes", email: "jordan.hughes@company.com", role: "Admin", lastLogin: "10 mins ago" },
  { id: "u2", name: "Sandra Bullock", email: "sandra.b@company.com", role: "Auditor", lastLogin: "1 hour 15 mins ago" },
  { id: "u3", name: "Susan Lee", email: "susan.lee@company.com", role: "Reviewer", lastLogin: "2 hours ago" },
  { id: "u4", name: "John Miller", email: "john.miller@company.com", role: "User", lastLogin: "30 September 2031, 22:35" },
  { id: "u5", name: "Steven Guth", email: "steven.guth@company.com", role: "Auditor", lastLogin: "Yesterday" },
  { id: "u6", name: "Alex Rivers", email: "alex.rivers@company.com", role: "Admin", lastLogin: "3 days ago" },
];

const dossiersSeed: DossierRow[] = [
  { id: "d1", name: "ISO 27001 - Medical Center X", framework: "ISO 27001", org: "Medical Center X" },
  { id: "d2", name: "VCA 201 - Stark Industries", framework: "VCA 201", org: "Stark Industries" },
  { id: "d3", name: "SOC 2 - Acme", framework: "SOC 2", org: "Acme Corporation" },
];

function userRolePillClass(role: MatrixUserRole) {
  switch (role) {
    case "Admin":
      return "bg-surface-muted text-foreground";
    case "Auditor":
      return "bg-primary text-white";
    case "Reviewer":
      return "bg-[#1f1f1f] text-white";
    case "User":
      return "bg-[#fce1e6] text-[#d13438]";
    default:
      return "bg-border-soft text-secondary";
  }
}

function userRoleLabel(role: MatrixUserRole, m: { roleAdmin: string; roleAuditor: string; roleReviewer: string; roleUser: string }) {
  if (role === "Admin") return m.roleAdmin;
  if (role === "Auditor") return m.roleAuditor;
  if (role === "Reviewer") return m.roleReviewer;
  return m.roleUser;
}

type MatrixUserManagementModalProps = {
  open: boolean;
  onClose: () => void;
};

type InviteUserDialogProps = {
  open: boolean;
  onClose: () => void;
};

function InviteUserDialog({ open, onClose }: InviteUserDialogProps) {
  const { t } = useLocale();
  const u = t.matrix.portfolio.inviteUserDialog;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (open) {
      setEmail("");
      setRole("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button type="button" aria-label="Close invite user" className="fixed inset-0 z-[60] bg-black/40" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-[70] w-[min(480px,94vw)] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-border bg-surface shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-invite-user-title"
      >
        <div className="px-6 pb-4 pt-5">
          <h2 id="matrix-invite-user-title" className="text-[24px] font-semibold text-foreground">
            {u.title}
          </h2>
          <div className="mt-5">
            <label className="mb-1.5 block text-[13px] text-foreground" htmlFor="matrix-invite-email">
              {u.emailLabel}
            </label>
            <Input
              id="matrix-invite-email"
              className="h-8 w-full"
              size="small"
              placeholder={u.emailPlaceholder}
              value={email}
              onChange={(_, d) => setEmail(d.value)}
            />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-[13px] text-foreground" htmlFor="matrix-invite-role">
              {u.roleLabel}
            </label>
            <select
              id="matrix-invite-role"
              className="h-8 w-full min-h-8 rounded border border-border bg-surface px-2.5 text-[13px] text-foreground"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">{u.selectRole}</option>
              <option value="Admin">Admin</option>
              <option value="Auditor">Auditor</option>
              <option value="Reviewer">Reviewer</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border-soft px-6 py-3.5">
          <Button appearance="outline" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px]" onClick={onClose}>
            {u.cancel}
          </Button>
          <Button appearance="primary" className="h-8 min-h-8 rounded-[4px] px-4 text-[13px] font-medium" onClick={onClose}>
            {u.invite}
          </Button>
        </div>
      </div>
    </>
  );
}

export function MatrixUserManagementModal({ open, onClose }: MatrixUserManagementModalProps) {
  const { t } = useLocale();
  const m = t.matrix.portfolio.userManagement;
  const [tab, setTab] = useState<UMTab>("users");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setInviteOpen(false);
      setSearch("");
      setTab("users");
    }
  }, [open]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return usersSeed;
    return usersSeed.filter(
      (row) => row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredDossiers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dossiersSeed;
    return dossiersSeed.filter(
      (row) => row.name.toLowerCase().includes(q) || row.org.toLowerCase().includes(q) || row.framework.toLowerCase().includes(q),
    );
  }, [search]);

  if (!open) return null;

  return (
    <>
      <button type="button" aria-label="Close user management" className="fixed inset-0 z-[50] bg-black/45" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 z-[55] flex max-h-[min(90vh,880px)] w-[min(960px,96vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[4px] border border-border bg-surface shadow-[0_12px_48px_rgba(0,0,0,0.22)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="matrix-um-title"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-border-soft px-5 pb-0 pt-4 sm:px-6">
          <h2 id="matrix-um-title" className="text-[20px] font-semibold text-foreground">
            {m.title}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-secondary hover:text-foreground -mr-1 p-1">
            <Dismiss20Regular />
          </button>
        </header>

        <div className="shrink-0 border-b border-border-soft px-5 sm:px-6">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setTab("users")}
              className={`border-b-[3px] pb-2.5 text-[14px] font-medium ${
                tab === "users" ? "border-primary text-foreground" : "border-transparent text-secondary"
              }`}
            >
              {m.tabUsers}
            </button>
            <button
              type="button"
              onClick={() => setTab("dossiers")}
              className={`border-b-[3px] pb-2.5 text-[14px] font-medium ${
                tab === "dossiers" ? "border-primary text-foreground" : "border-transparent text-secondary"
              }`}
            >
              {m.tabDossiers}
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border-soft px-4 py-3 sm:px-5">
          <Input
            className="h-[36px] max-w-[280px] text-[13px]"
            placeholder={m.searchName}
            contentBefore={<Search20Regular className="text-muted" />}
            value={search}
            onChange={(_, d) => setSearch(d.value)}
            size="medium"
          />
          <div className="flex items-center gap-2">
            {tab === "users" ? (
              <Button appearance="outline" className="h-9 rounded-[2px] border-border px-3 text-[13px] text-secondary" icon={<Filter16Regular />}>
                {t.matrix.portfolio.filterByRole}
              </Button>
            ) : null}
            {tab === "users" ? (
              <Menu positioning="below-end">
                <MenuTrigger disableButtonEnhancement>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton
                      appearance="primary"
                      className="font-medium"
                      icon={<Add16Regular />}
                      iconPosition="before"
                      menuButton={triggerProps}
                      primaryActionButton={{ onClick: () => setInviteOpen(true) }}
                      size="medium"
                    >
                      {m.inviteUser}
                    </SplitButton>
                  )}
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    <MenuItem onClick={() => setInviteOpen(true)}>{m.inviteUserMenu}</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            ) : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-1 sm:px-5 sm:py-2">
          {tab === "users" ? (
            <div className="overflow-x-auto rounded-[2px] border border-border-soft">
              <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border-soft text-secondary">
                    <th className="px-3 py-2.5 font-medium">{m.columns.name} ↕</th>
                    <th className="px-3 py-2.5 font-medium">{m.columns.email}</th>
                    <th className="px-3 py-2.5 font-medium">{m.columns.roles} ↕</th>
                    <th className="px-3 py-2.5 font-medium">{m.columns.lastLogin}</th>
                    <th className="w-12 px-2 py-2.5" aria-hidden />
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-secondary">
                        {m.usersEmpty}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((row) => (
                      <tr key={row.id} className="border-b border-border-soft last:border-b-0 hover:bg-surface-muted/80">
                        <td className="px-3 py-2.5 font-medium text-foreground">{row.name}</td>
                        <td className="px-3 py-2.5 text-secondary">{row.email}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`inline-flex h-5 max-w-full items-center rounded-[4px] px-2 text-[10px] font-semibold ${userRolePillClass(
                              row.role,
                            )}`}
                          >
                            {userRoleLabel(row.role, m)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-secondary">{row.lastLogin}</td>
                        <td className="px-2 py-1.5 text-right">
                          <Menu positioning="below-end">
                            <MenuTrigger disableButtonEnhancement>
                              <Button
                                appearance="subtle"
                                className="min-w-8 h-8 px-1.5"
                                icon={<MoreHorizontal20Regular className="text-foreground" />}
                                aria-label={`${m.rowActions}: ${row.name}`}
                              />
                            </MenuTrigger>
                            <MenuPopover>
                              <MenuList>
                                <MenuItem
                                  icon={<DismissCircle20Regular className="text-foreground" />}
                                  secondaryContent={<ChevronRight20Regular className="text-secondary" />}
                                  onClick={() => {}}
                                >
                                  {m.revokeAccess}
                                </MenuItem>
                                <MenuItem
                                  icon={<Archive20Regular className="text-foreground" />}
                                  secondaryContent={<ChevronRight20Regular className="text-secondary" />}
                                  onClick={() => {}}
                                >
                                  {m.archive}
                                </MenuItem>
                              </MenuList>
                            </MenuPopover>
                          </Menu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-[2px] border border-border-soft">
              <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border-soft text-secondary">
                    <th className="px-3 py-2.5 font-medium">{m.columns.name}</th>
                    <th className="px-3 py-2.5 font-medium">{m.frameworkColumn}</th>
                    <th className="px-3 py-2.5 font-medium">{m.orgColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDossiers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-8 text-center text-secondary">
                        {m.dossiersEmpty}
                      </td>
                    </tr>
                  ) : (
                    filteredDossiers.map((row) => (
                      <tr key={row.id} className="border-b border-border-soft last:border-b-0 hover:bg-surface-muted/80">
                        <td className="px-3 py-2.5 font-medium text-foreground">{row.name}</td>
                        <td className="px-3 py-2.5 text-secondary">{row.framework}</td>
                        <td className="px-3 py-2.5 text-secondary">{row.org}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <InviteUserDialog open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </>
  );
}
