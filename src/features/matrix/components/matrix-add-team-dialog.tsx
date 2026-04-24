"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "@fluentui/react-components";
import { Delete16Regular, Search16Regular } from "@fluentui/react-icons";
import type { MatrixAddTeamActivationPreset } from "@/features/matrix/types";
import { useLocale } from "@/i18n/locale-context";

type AddTeamField = "team" | "reviewer" | "auditor";

const allPeople = ["Susan Lee", "Sandra Bullock", "John Doe", "John Miller", "Steven Guth"];

const PREPOP_TEAM = ["Susan Lee", "Sandra Bullock", "John Doe"];
const PREPOP_REVIEWERS = ["Susan Lee", "Sandra Bullock"];
const PREPOP_AUDITORS = ["Susan Lee", "Sandra Bullock", "John Doe"];

type MatrixAddTeamDialogProps = {
  open: boolean;
  onClose: () => void;
  /** From `?activation=` after "Open matrix" from portfolio activation. */
  activationPreset?: MatrixAddTeamActivationPreset;
};

export function MatrixAddTeamDialog({
  open,
  onClose,
  activationPreset = "default",
}: MatrixAddTeamDialogProps) {
  const { t } = useLocale();
  const [activeField, setActiveField] = useState<AddTeamField | null>(null);
  const [teamQuery, setTeamQuery] = useState("");
  const [reviewerQuery, setReviewerQuery] = useState("");
  const [auditorQuery, setAuditorQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [auditors, setAuditors] = useState<string[]>([]);

  const showReviewerBlock =
    activationPreset === "standard" || (activationPreset === "default" && teamMembers.length > 0);

  useEffect(() => {
    if (!open) return;
    if (activationPreset === "standard") {
      setTeamMembers([...PREPOP_TEAM]);
      setReviewers([...PREPOP_REVIEWERS]);
      setAuditors([...PREPOP_AUDITORS]);
    } else {
      setTeamMembers([]);
      setReviewers([]);
      setAuditors([]);
    }
    setActiveField(null);
    setTeamQuery("");
    setReviewerQuery("");
    setAuditorQuery("");
  }, [open, activationPreset]);

  const query = activeField === "team" ? teamQuery : activeField === "reviewer" ? reviewerQuery : activeField === "auditor" ? auditorQuery : "";
  const picked = useMemo(() => new Set([...teamMembers, ...reviewers, ...auditors]), [auditors, reviewers, teamMembers]);
  const suggestions = useMemo(
    () => allPeople.filter((person) => !picked.has(person) && person.toLowerCase().includes(query.toLowerCase())),
    [picked, query],
  );

  if (!open) return null;

  const setQueryForField = (field: AddTeamField, value: string) => {
    if (field === "team") setTeamQuery(value);
    if (field === "reviewer") setReviewerQuery(value);
    if (field === "auditor") setAuditorQuery(value);
  };

  const addPersonToActiveField = (person: string) => {
    if (activeField === "team") setTeamMembers((current) => [...current, person]);
    if (activeField === "reviewer") setReviewers((current) => [...current, person]);
    if (activeField === "auditor") setAuditors((current) => [...current, person]);
    if (activeField) setQueryForField(activeField, "");
  };

  const renderSuggestions = (field: AddTeamField) => {
    if (activeField !== field) return null;

    return (
      <div className="border-x border-b border-border-soft bg-surface px-3 py-2">
        <p className="mb-1 text-[10px] text-muted">{t.matrix.dossier.addTeamDialog.suggested}</p>
        <div className="space-y-1">
          {suggestions.map((person) => (
            <button
              key={`${field}-${person}`}
              type="button"
              className="block w-full text-left text-[13px] text-foreground hover:text-primary"
              onClick={() => addPersonToActiveField(person)}
            >
              {person}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <button type="button" aria-label="Close activate team dialog" className="fixed inset-0 z-40 bg-black/45" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 z-50 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-border bg-surface shadow-[0_10px_40px_rgb(0,0,0,0.2)]">
        <div className="max-h-[610px] overflow-y-auto px-4 pb-3 pt-4">
          <h3 className="text-[34px] font-semibold leading-none text-foreground">{t.matrix.dossier.addTeamDialog.title}</h3>

          <section className="mt-4">
            <label className="mb-1.5 block text-[13px] text-foreground">{t.matrix.dossier.addTeamDialog.selectTeam}</label>
            <Input
              value={teamQuery}
              onFocus={() => setActiveField("team")}
              onChange={(_, data) => {
                setActiveField("team");
                setTeamQuery(data.value);
              }}
              contentBefore={<Search16Regular className="text-muted" />}
              className="h-[33px]"
              placeholder={activeField === "team" ? t.matrix.dossier.addTeamDialog.searchTeamPlaceholder : t.matrix.dossier.addTeamDialog.chooseTeamPlaceholder}
            />
            {renderSuggestions("team")}
            {teamMembers.length > 0 ? (
              <div className="border-x border-b border-border-soft">
                {teamMembers.map((person) => (
                  <div key={person} className="flex items-center justify-between border-t border-border-soft px-3 py-1.5 first:border-t-0">
                    <span className="text-[13px] text-foreground">{person}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${person}`}
                      className="text-danger hover:opacity-80"
                      onClick={() => setTeamMembers((current) => current.filter((item) => item !== person))}
                    >
                      <Delete16Regular />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {showReviewerBlock ? (
            <section className="mt-3">
              <label className="mb-1.5 block text-[13px] text-foreground">{t.matrix.dossier.addTeamDialog.selectReviewer}</label>
              <Input
                value={reviewerQuery}
                onFocus={() => setActiveField("reviewer")}
                onChange={(_, data) => {
                  setActiveField("reviewer");
                  setReviewerQuery(data.value);
                }}
                contentBefore={<Search16Regular className="text-muted" />}
                className="h-[33px]"
                placeholder={t.matrix.dossier.addTeamDialog.searchPlaceholder}
              />
              {renderSuggestions("reviewer")}
              {reviewers.length > 0 ? (
                <div className="border-x border-b border-border-soft">
                  {reviewers.map((person) => (
                    <div key={person} className="flex items-center justify-between border-t border-border-soft px-3 py-1.5 first:border-t-0">
                      <span className="text-[13px] text-foreground">{person}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${person}`}
                        className="text-danger hover:opacity-80"
                        onClick={() => setReviewers((current) => current.filter((item) => item !== person))}
                      >
                        <Delete16Regular />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="mt-3">
            <label className="mb-1.5 block text-[13px] text-foreground">{t.matrix.dossier.addTeamDialog.selectAuditor}</label>
            <Input
              value={auditorQuery}
              onFocus={() => setActiveField("auditor")}
              onChange={(_, data) => {
                setActiveField("auditor");
                setAuditorQuery(data.value);
              }}
              contentBefore={<Search16Regular className="text-muted" />}
              className="h-[33px]"
              placeholder={t.matrix.dossier.addTeamDialog.searchPlaceholder}
            />
            {renderSuggestions("auditor")}
            {auditors.length > 0 ? (
              <div className="border-x border-b border-border-soft">
                {auditors.map((person) => (
                  <div key={person} className="flex items-center justify-between border-t border-border-soft px-3 py-1.5 first:border-t-0">
                    <span className="text-[13px] text-foreground">{person}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${person}`}
                      className="text-danger hover:opacity-80"
                      onClick={() => setAuditors((current) => current.filter((item) => item !== person))}
                    >
                      <Delete16Regular />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="flex justify-end gap-2 border-t border-border-soft px-4 py-3">
          <Button appearance="primary" className="h-8 rounded-[4px] px-4 text-[13px]" onClick={onClose}>
            {t.matrix.dossier.addTeamDialog.save}
          </Button>
          <Button appearance="outline" className="h-8 rounded-[4px] px-4 text-[13px]" onClick={onClose}>
            {t.matrix.dossier.addTeamDialog.cancel}
          </Button>
        </div>
      </div>
    </>
  );
}
