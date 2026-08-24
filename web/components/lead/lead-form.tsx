"use client";

import { useRef, useState } from "react";

import { submitLead } from "@/components/lead/submit-lead";
import { buttonClass, type ButtonVariant } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";
import { formatPhoneBR, isValidPhoneBR, toE164BR } from "@/lib/contact/phone";

type Status = "idle" | "sending" | "error";

type Errors = {
  name?: string;
  email?: string;
  phone?: string;
  form?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(name: string, email: string, phone: string): Errors {
  const errors: Errors = {};

  if (name.trim().length < 2) {
    errors.name = "Informe seu nome.";
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!isValidPhoneBR(phone)) {
    errors.phone = "Informe um WhatsApp com DDD.";
  }

  return errors;
}

type LeadFormProps = {
  /** Prefixo dos ids, para que dois formulários possam coexistir na página. */
  idPrefix?: string;
  submitLabel?: string;
  buttonVariant?: ButtonVariant;
  /** Dados de qualificação enviados junto: modo usado, preço calculado. */
  context?: Record<string, string | number>;
  onSuccess?: () => void;
};

/**
 * Captura de lead.
 *
 * Vive dentro do painel de resultado, ao lado do preço já entregue. O preço
 * nunca fica atrás deste formulário: a contrapartida é o detalhamento, não a
 * resposta que a pessoa veio buscar.
 */
export function LeadForm({
  idPrefix = "lead",
  submitLabel = "Ver o detalhamento",
  buttonVariant = "contrast",
  context,
  onSuccess,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const id = (field: string) => `${idPrefix}-${field}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(name, email, phone);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Foco no primeiro campo com problema: quem navega por teclado ou
      // leitor de tela não deveria caçar o erro pelo formulário.
      const first = found.name ? nameRef : found.email ? emailRef : phoneRef;
      first.current?.focus();
      return;
    }

    setStatus("sending");

    const result = await submitLead({
      name: name.trim(),
      email: email.trim(),
      phone: toE164BR(phone),
      source: "calculadora-de-precos",
      context,
    });

    if (!result.ok) {
      setStatus("error");
      setErrors({ form: "Não foi possível enviar agora. Tente de novo." });
      return;
    }

    track("lead_generated", { source: "calculadora-de-precos", ...context });
    onSuccess?.();
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-purple-600";
  const labelClass = "block text-sm font-medium";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-3">
      <div>
        <label htmlFor={id("name")} className={labelClass}>
          Nome
        </label>
        <input
          ref={nameRef}
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? id("name-error") : undefined}
          className={fieldClass}
        />
        {errors.name ? (
          <p id={id("name-error")} role="alert" className="mt-1 text-xs">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id("email")} className={labelClass}>
          E-mail
        </label>
        <input
          ref={emailRef}
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? id("email-error") : undefined}
          className={fieldClass}
        />
        {errors.email ? (
          <p id={id("email-error")} role="alert" className="mt-1 text-xs">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={id("phone")} className={labelClass}>
          WhatsApp
        </label>
        <input
          ref={phoneRef}
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          value={phone}
          onChange={(event) => setPhone(formatPhoneBR(event.target.value))}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? id("phone-error") : undefined}
          className={fieldClass}
        />
        {errors.phone ? (
          <p id={id("phone-error")} role="alert" className="mt-1 text-xs">
            {errors.phone}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p role="alert" className="text-xs">
          {errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className={buttonClass(buttonVariant, "w-full")}
      >
        {status === "sending" ? "Enviando..." : submitLabel}
      </button>
    </form>
  );
}
