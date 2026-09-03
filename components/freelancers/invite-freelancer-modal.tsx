"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendFreelancerInvite } from "@/lib/invite";
import { CURRENCIES, type Currency, type InviteFreelancerInput } from "@/lib/types";
import { EMAIL_PATTERN } from "@/lib/utils";
import { useT } from "@/components/i18n/language-provider";

type FieldErrors = Partial<Record<"name" | "email" | "rate", string>>;

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "",
  rate: "",
  currency: "USD" as Currency,
  note: "",
};

function validate(
  form: typeof EMPTY_FORM,
  t: ReturnType<typeof useT>,
): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) {
    errors.name = t("freelancers.nameRequired");
  }
  if (!form.email.trim()) {
    errors.email = t("freelancers.emailRequired");
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = t("freelancers.emailInvalid");
  }
  if (form.rate.trim()) {
    const parsed = Number(form.rate);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      errors.rate = t("freelancers.rateInvalid");
    }
  }
  return errors;
}

export function InviteFreelancerModal({
  open,
  onOpenChange,
  onInvited,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvited?: (payload: InviteFreelancerInput & { inviteId?: string }) => void;
}) {
  const formId = useId();
  const t = useT();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in errors) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key as keyof FieldErrors];
        return next;
      });
    }
  }

  function handleOpenChange(next: boolean) {
    if (submitting) return;
    onOpenChange(next);
    if (!next) {
      setForm(EMPTY_FORM);
      setErrors({});
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: InviteFreelancerInput = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role.trim() || undefined,
      rate: form.rate.trim() ? Number(form.rate) : null,
      currency: form.currency,
      note: form.note.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const result = await sendFreelancerInvite(payload);
      onInvited?.({ ...payload, inviteId: result.inviteId });
      setForm(EMPTY_FORM);
      setErrors({});
      onOpenChange(false);
      toast.success(t("freelancers.inviteSent", { email: payload.email }));
    } catch (error) {
      const err = error as Error & { field?: keyof FieldErrors };
      if (err.field) {
        setErrors({ [err.field]: err.message });
      } else {
        setErrors({ email: err.message || t("freelancers.inviteFailed") });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {open ? (
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100vh-32px)] overflow-y-auto"
          aria-labelledby={`${formId}-title`}
        >
          <DialogHeader>
            <DialogTitle id={`${formId}-title`}>{t("freelancers.inviteTitle")}</DialogTitle>
            <DialogDescription>{t("freelancers.inviteBody")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Label htmlFor={`${formId}-name`}>{t("freelancers.fullName")}</Label>
              <Input
                id={`${formId}-name`}
                name="name"
                autoComplete="name"
                placeholder={t("freelancers.namePlaceholder")}
                value={form.name}
                invalid={Boolean(errors.name)}
                disabled={submitting}
                onChange={(event) => update("name", event.target.value)}
              />
              {errors.name ? (
                <p className="rw-field-error" role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor={`${formId}-email`}>{t("common.email")}</Label>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("freelancers.emailPlaceholder")}
                value={form.email}
                invalid={Boolean(errors.email)}
                disabled={submitting}
                onChange={(event) => update("email", event.target.value)}
              />
              {errors.email ? (
                <p className="rw-field-error" role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor={`${formId}-role`}>{t("freelancers.roleTitle")}</Label>
              <Input
                id={`${formId}-role`}
                name="role"
                placeholder={t("freelancers.rolePlaceholder")}
                value={form.role}
                disabled={submitting}
                onChange={(event) => update("role", event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor={`${formId}-rate`}>{t("freelancers.hourlyRate")}</Label>
              <div className="flex gap-2">
                <Input
                  id={`${formId}-rate`}
                  name="rate"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder={t("freelancers.ratePlaceholder")}
                  value={form.rate}
                  invalid={Boolean(errors.rate)}
                  disabled={submitting}
                  onChange={(event) => update("rate", event.target.value)}
                  className="flex-1"
                />
                <select
                  id={`${formId}-currency`}
                  name="currency"
                  aria-label={t("common.currency")}
                  value={form.currency}
                  disabled={submitting}
                  onChange={(event) =>
                    update("currency", event.target.value as Currency)
                  }
                  className="rw-input w-[96px] shrink-0 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2394A3B8%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              {errors.rate ? (
                <p className="rw-field-error" role="alert">
                  {errors.rate}
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor={`${formId}-note`}>{t("freelancers.personalNote")}</Label>
              <Textarea
                id={`${formId}-note`}
                name="note"
                placeholder={t("freelancers.notePlaceholder")}
                value={form.note}
                disabled={submitting}
                onChange={(event) => update("note", event.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="text"
                disabled={submitting}
                onClick={() => handleOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" loading={submitting}>
                {submitting ? t("freelancers.sendingInvite") : t("freelancers.sendInvite")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
