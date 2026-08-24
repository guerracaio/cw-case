"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Marca de que a pessoa ja liberou o detalhamento.
 *
 * Guarda APENAS um booleano. Nome, e-mail e telefone nunca vao para o
 * localStorage: qualquer script da pagina consegue le-lo, e nao ha motivo
 * para manter dado pessoal no navegador depois do envio.
 *
 * Usa useSyncExternalStore, e nao useState + useEffect, porque localStorage e
 * exatamente isto: uma fonte de estado externa ao React. O snapshot de
 * servidor devolve false, entao o HTML e o primeiro render do cliente
 * coincidem e o React reconcilia depois, sem setState dentro de efeito.
 */
const STORAGE_KEY = "ip-calc:unlocked";

let listeners: Array<() => void> = [];

/**
 * Espelho em memoria. Em aba anonima o localStorage lanca ou fica vazio, e
 * sem isto o painel nunca desbloquearia nem depois do envio: o snapshot
 * voltaria false a cada render.
 */
let unlockedInMemory = false;

function subscribe(onChange: () => void): () => void {
  listeners.push(onChange);
  // O evento "storage" so dispara em OUTRAS abas: mantem a pagina coerente
  // se a pessoa liberar o detalhamento em uma segunda aba.
  window.addEventListener("storage", onChange);

  return () => {
    listeners = listeners.filter((listener) => listener !== onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): boolean {
  if (unlockedInMemory) return true;

  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // Modo privativo ou storage bloqueado: segue sem lembrar, sem quebrar.
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function useLeadUnlock(): { unlocked: boolean; unlock: () => void } {
  const unlocked = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const unlock = useCallback(() => {
    // Primeiro em memoria: e o que garante o desbloqueio mesmo quando a
    // persistencia falha.
    unlockedInMemory = true;

    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sem persistencia, o desbloqueio vale ate a pagina ser recarregada.
    }

    for (const listener of listeners) listener();
  }, []);

  return { unlocked, unlock };
}
