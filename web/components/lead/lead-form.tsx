"use client";

import { useRef, useState } from "react";

import { buttonClass } from "@/components/ui/button";
import { track } from "@/lib/analytics/track";
import { submitLead } from "@/components/lead/submit-lead";

type Status = "idle" | "sending" | "done";

type Errors = {
  name?: string;
  email?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(name: string, email: string): Errors {
  const errors: Errors = {};

  if (name.trim().length < 2) {
    errors.name = "Informe seu nome.";
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }

  return errors;
}

/**
 * Captura de lead.
 *
 * Aparece depois do resultado, nunca antes: bloquear o valor da ferramenta
 * atrás do formulário derruba a conversão e o sinal de qualidade da página.
 */
export function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const successRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate(name, email);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");

    const result = await submitLead({
      name: name.trim(),
      email: email.trim(),
      source: "calculadora-de-precos",
    });

    if (!result.ok) {
      setStatus("idle");
      setErrors({ email: "Não foi possível enviar agora. Tente de novo." });
      return;
    }

    track("lead_generated", { source: "calculadora-de-precos" });
    setStatus("done");

    // Leitor de tela e navegação por teclado precisam ir para a confirmação.
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (status === "done") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        className="rounded-2xl bg-green-100 p-6 text-neutral-900 outline-none"
      >
        Pronto, recebemos seu contato. Em breve a InfinitePay envia materiais
        para você precificar e vender melhor.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:max-w-md">
      <div>
        <label
          htmlFor="lead-name"
          className="block text-sm font-medium text-neutral-800"
        >
          Nome
        </label>
        <input
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "lead-name-error" : undefined}
          className="mt-1 w-full rounded-lg border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-purple-600"
        />
        {errors.name ? (
          <p id="lead-name-error" role="alert" className="mt-1 text-xs">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="lead-email"
          className="block text-sm font-medium text-neutral-800"
        >
          E-mail
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
          className="mt-1 w-full rounded-lg border border-neutral-400 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-purple-600"
        />
        {errors.email ? (
          <p id="lead-email-error" role="alert" className="mt-1 text-xs">
            {errors.email}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={buttonClass("primary")}
      >
        {status === "sending" ? "Enviando..." : "Quero receber"}
      </button>
    </form>
  );
}
