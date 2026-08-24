"use client";

/**
 * Campo numerico da calculadora.
 *
 * E `type="text"` com `inputMode="decimal"` de proposito: `type="number"`
 * rejeita virgula em varios teclados brasileiros e permite scroll acidental
 * alterar o valor. O parsing pt-BR fica em lib/pricing/format.
 */

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Simbolo mostrado antes do valor, por exemplo "R$". */
  prefix?: string;
  /** Simbolo mostrado depois do valor, por exemplo "%". */
  suffix?: string;
  /** Unidade por extenso, lida por leitores de tela. */
  unitLabel?: string;
  hint?: string;
};

export function Field({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  unitLabel,
  hint,
}: FieldProps) {
  const hintId = hint ? id + "-hint" : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-800"
      >
        {label}
        {unitLabel ? <span className="sr-only"> em {unitLabel}</span> : null}
      </label>

      <div className="mt-1 flex items-center gap-1 rounded-lg border border-neutral-400 bg-white px-3 py-2 focus-within:border-purple-600">
        {prefix ? (
          <span aria-hidden="true" className="text-neutral-800">
            {prefix}
          </span>
        ) : null}

        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={hintId}
          className="w-full min-w-0 bg-transparent text-neutral-900 outline-none"
        />

        {suffix ? (
          <span aria-hidden="true" className="text-neutral-800">
            {suffix}
          </span>
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-neutral-800">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
