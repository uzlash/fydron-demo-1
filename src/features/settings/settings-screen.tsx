"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Switch,
  Text,
} from "@fluentui/react-components";
import { CheckmarkCircle16Filled } from "@fluentui/react-icons";
import Link from "next/link";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import { NotificationCenter } from "@/features/dashboard/components/notification-center";
import { notificationItems } from "@/features/dashboard/mock-data";
import { useDemoSession } from "@/features/auth/demo-session-context";
import { SuccessToast } from "@/features/settings/components/success-toast";
import { useLocale } from "@/i18n/locale-context";
import { AppPageFrame, AppMainCard } from "@/components/app-content-shell";
import { RightDrawerFrame, RIGHT_DRAWER_WIDTH_440 } from "@/components/right-drawer-frame";

type SettingsTab = "profile" | "notifications" | "security";

type ToastPayload = { title: string; body: string };

export function SettingsScreen() {
  const { t } = useLocale();
  const { user, signIn } = useDemoSession();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [toast, setToast] = useState<ToastPayload | null>(null);

  const [notifyClientMessages, setNotifyClientMessages] = useState(true);
  const [notifyDossier, setNotifyDossier] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [mfaActive, setMfaActive] = useState(true);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const tabs: { key: SettingsTab; label: string }[] = [
    { key: "profile", label: t.settings.tabs.profile },
    { key: "notifications", label: t.settings.tabs.notifications },
    { key: "security", label: t.settings.tabs.security },
  ];

  const advisorRole = t.settings.profile.defaultRole;

  const settingsFieldClass =
    "h-9 w-full max-w-full rounded border border-border bg-surface text-[13px] text-foreground [box-shadow:none]";

  return (
    <AppPageFrame>
      <DashboardSidebar />
      <AppMainCard>
        <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
          <DashboardTopbar
            title={t.settings.title}
            onToggleNotifications={() => setIsNotificationCenterOpen((v) => !v)}
            hasUnreadNotifications={notificationItems.some((item) => item.unread)}
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 border-b border-border px-6">
              <div className="flex gap-10">
                {tabs.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`-mb-px border-b-2 pb-3 pt-5 text-[14px] font-medium transition-colors ${
                      tab === item.key
                        ? "border-primary text-primary"
                        : "border-transparent text-secondary hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {tab === "profile" ? (
              <div className="w-full max-w-[min(100%,32rem)]">
                <div className="border-b border-border pb-4 flex flex-col">
                  <Text
                    as="h2"
                    size={500}
                    weight="semibold"
                    className="block text-2xl leading-tight text-foreground"
                  >
                    {t.settings.profile.sectionTitle}
                  </Text>
                  <Text size={200} className="mt-1 block text-[13px] leading-5 text-secondary">
                    {t.settings.profile.subtitle}
                  </Text>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  aria-label={t.settings.profile.changePicture}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setPhotoUrl(URL.createObjectURL(f));
                  }}
                />

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                  <Avatar
                    name={`${firstName} ${lastName}`.trim()}
                    image={photoUrl ? { src: photoUrl } : undefined}
                    color="colorful"
                    size={96}
                    shape="circular"
                  />
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        appearance="primary"
                        className="h-9 rounded border-0 px-4 text-[13px] font-semibold"
                        onClick={() => fileRef.current?.click()}
                      >
                        {t.settings.profile.changePicture}
                      </Button>
                      <Button
                        appearance="outline"
                        className="h-9 rounded border-border-strong px-4 text-[13px] font-medium text-foreground"
                        onClick={() => {
                          setPhotoUrl(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                      >
                        {t.settings.profile.removePhoto}
                      </Button>
                    </div>
                    <Text size={200} className="text-[12px] leading-4 text-secondary">
                      {t.profile.photoHint}
                    </Text>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field label={t.profile.firstName}>
                    <Input
                      value={firstName}
                      onChange={(_, d) => setFirstName(d.value)}
                      className={settingsFieldClass}
                      placeholder={t.settings.profile.placeholders.firstName}
                    />
                  </Field>
                  <Field label={t.profile.lastName}>
                    <Input
                      value={lastName}
                      onChange={(_, d) => setLastName(d.value)}
                      className={settingsFieldClass}
                      placeholder={t.settings.profile.placeholders.lastName}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label={t.settings.profile.assignedRole}>
                    <Input
                      value={advisorRole}
                      readOnly
                      className={`${settingsFieldClass} cursor-not-allowed bg-surface-muted text-foreground`}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label={t.profile.phone}>
                    <Input
                      value={phone}
                      onChange={(_, d) => setPhone(d.value)}
                      className={settingsFieldClass}
                      placeholder={t.settings.profile.placeholders.phone}
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <Field label={t.settings.profile.emailAddress}>
                    <Input
                      value={email}
                      onChange={(_, d) => setEmail(d.value)}
                      className={settingsFieldClass}
                      type="email"
                      placeholder={t.settings.profile.placeholders.email}
                    />
                  </Field>
                </div>

                <div className="mt-8">
                  <Button
                    appearance="primary"
                    className="h-9 rounded px-4 text-[13px] font-semibold"
                    onClick={() => setSaveDialogOpen(true)}
                  >
                    {t.settings.profile.saveChanges}
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "notifications" ? (
              <div className="w-full max-w-[min(100%,32rem)]">
                <div className="border-b border-border pb-4 flex flex-col">
                  <Text
                    as="h2"
                    size={500}
                    weight="semibold"
                    className="block text-2xl leading-tight text-foreground"
                  >
                    {t.settings.notifications.sectionTitle}
                  </Text>
                  <Text size={200} className="mt-1 block text-[13px] leading-5 text-secondary">
                    {t.settings.notifications.subtitle}
                  </Text>
                </div>

                <ul className="mt-2 divide-y divide-border">
                  <li className="flex items-start justify-between gap-6 py-5">
                    <div className="min-w-0">
                      <Text weight="semibold" className="block text-[14px] text-foreground">
                        {t.settings.notifications.clientMessagesTitle}
                      </Text>
                      <Text size={200} className="mt-1 block text-[13px] text-secondary">
                        {t.settings.notifications.clientMessagesDescription}
                      </Text>
                    </div>
                    <Switch
                      checked={notifyClientMessages}
                      onChange={(_, d) => setNotifyClientMessages(d.checked)}
                      label={{ children: t.settings.notifications.clientMessagesTitle, className: "sr-only" }}
                      className="shrink-0"
                    />
                  </li>
                  <li className="flex items-start justify-between gap-6 py-5">
                    <div className="min-w-0">
                      <Text weight="semibold" className="block text-[14px] text-foreground">
                        {t.settings.notifications.dossierTitle}
                      </Text>
                      <Text size={200} className="mt-1 block text-[13px] text-secondary">
                        {t.settings.notifications.dossierDescription}
                      </Text>
                    </div>
                    <Switch
                      checked={notifyDossier}
                      onChange={(_, d) => setNotifyDossier(d.checked)}
                      label={{ children: t.settings.notifications.dossierTitle, className: "sr-only" }}
                      className="shrink-0"
                    />
                  </li>
                  <li className="flex items-start justify-between gap-6 py-5">
                    <div className="min-w-0">
                      <Text weight="semibold" className="block text-[14px] text-foreground">
                        {t.settings.notifications.deadlinesTitle}
                      </Text>
                      <Text size={200} className="mt-1 block text-[13px] text-secondary">
                        {t.settings.notifications.deadlinesDescription}
                      </Text>
                    </div>
                    <Switch
                      checked={notifyDeadlines}
                      onChange={(_, d) => setNotifyDeadlines(d.checked)}
                      label={{ children: t.settings.notifications.deadlinesTitle, className: "sr-only" }}
                      className="shrink-0"
                    />
                  </li>
                </ul>

                <div className="mt-4">
                  <Button
                    appearance="primary"
                    className="h-9 rounded-[4px] px-4 font-medium"
                    onClick={() =>
                      setToast({
                        title: t.settings.notifications.preferencesSavedTitle,
                        body: t.settings.notifications.preferencesSavedBody,
                      })
                    }
                  >
                    {t.settings.notifications.savePreferences}
                  </Button>
                </div>
              </div>
            ) : null}

            {tab === "security" ? (
              <div className="w-full max-w-[min(100%,32rem)]">
                <div className="flex flex-col border-b border-border pb-4">
                  <Text
                    as="h2"
                    size={500}
                    weight="semibold"
                    className="block text-2xl leading-tight text-foreground"
                  >
                    {t.settings.security.sectionTitle}
                  </Text>
                  <Text size={200} className="mt-1 block text-[13px] leading-5 text-secondary">
                    {t.settings.security.subtitle}
                  </Text>
                </div>

                <div className="mt-0 border-b border-border py-6">
                  <Text size={400} weight="semibold" className="block text-[16px] leading-tight text-foreground">
                    {t.settings.security.mfaConfigTitle}
                  </Text>

                  <div className="my-4 flex flex-wrap items-center gap-3">
                    <Text size={300} className="text-[14px] leading-5 text-foreground">
                      {t.settings.security.mfaStatusLabel}
                    </Text>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-fydron-active px-2.5 py-1.5 text-[12px] font-semibold text-white">
                      <CheckmarkCircle16Filled className="h-4 w-4 shrink-0 text-white" />
                      {t.settings.security.mfaActiveBadge}
                    </span>
                  </div>

                  <Text size={200} className="block text-[13px] leading-5 text-secondary">
                    {t.settings.security.mfaProtectedText}
                  </Text>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      appearance="outline"
                      className="h-9 rounded border-border-strong px-4 text-[13px] font-medium text-foreground"
                    >
                      {t.settings.security.resetMfa}
                    </Button>
                    <Button
                      appearance="primary"
                      className="h-9 rounded px-4 text-[13px] font-semibold"
                    >
                      {t.settings.security.reconfigureMfa}
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Text size={200} className="block text-[13px] leading-5 text-secondary">
                    {t.settings.security.footerText}
                  </Text>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      </AppMainCard>

      <Dialog open={saveDialogOpen} onOpenChange={(_, data) => setSaveDialogOpen(data.open)} modalType="modal">
        <DialogSurface className="max-w-[400px] rounded-[12px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <DialogBody>
            <DialogTitle className="text-[20px] font-semibold text-foreground">
              {t.settings.profile.saveConfirmTitle}
            </DialogTitle>
            <DialogContent className="mt-2">
              <Text className="text-[14px] text-secondary">{t.settings.profile.saveConfirmBody}</Text>
            </DialogContent>
            <DialogActions className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                appearance="primary"
                className="h-9 rounded-[4px] px-6 font-medium"
                onClick={() => {
                  setSaveDialogOpen(false);
                  signIn({
                    email: email.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                  });
                  setToast({
                    title: t.settings.profile.successTitle,
                    body: t.settings.profile.successBody,
                  });
                }}
              >
                {t.settings.profile.confirmChanges}
              </Button>
              <Button
                appearance="outline"
                className="h-9 rounded-[4px] border-border-strong px-6 font-medium text-foreground"
                onClick={() => setSaveDialogOpen(false)}
              >
                {t.settings.profile.cancel}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {toast ? <SuccessToast title={toast.title} body={toast.body} onDismiss={dismissToast} /> : null}

      {isNotificationCenterOpen ? (
        <>
          <button
            type="button"
            aria-label="Close notifications panel"
            className="absolute inset-0 z-20 bg-black/45"
            onClick={() => setIsNotificationCenterOpen(false)}
          />
          <RightDrawerFrame widthClass={RIGHT_DRAWER_WIDTH_440} zClass="z-30">
            <NotificationCenter items={notificationItems} />
          </RightDrawerFrame>
        </>
      ) : null}
    </AppPageFrame>
  );
}
