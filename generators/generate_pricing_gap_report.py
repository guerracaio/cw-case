"""Gera um diagnóstico detalhado do gap para calculadora de preços."""

from __future__ import annotations

import csv
import statistics
from collections import defaultdict
from pathlib import Path

import generate_shortlist_report as shortlist


ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset"
OUTPUT = ROOT / "outputs" / "seo-demand-maps" / "relatorio_gap_calculadora_precos.md"
TARGET = shortlist.TARGET

GROUPS = (
    (
        "Precificação geral de produtos",
        (
            "precificacao",
            "como precificar um produto",
            "precificacao de produtos",
            "como calcular preco de venda",
            "como definir o valor do meu produto",
            "formacao de preco de venda",
            "preco de venda formula",
            "calculadora de preco de venda",
            "calcular preco de venda com imposto",
        ),
    ),
    (
        "Precificação geral de serviços",
        (
            "quanto cobrar por hora de trabalho",
            "quanto cobrar por um servico",
            "precificacao de servicos",
            "calcular preco por quilo",
        ),
    ),
    (
        "Casos por profissão ou operação",
        (
            "quanto cobrar por unha",
            "quanto cobrar por um bolo",
            "quanto cobrar por corte de cabelo",
            "quanto cobrar por marmita",
            "quanto cobrar por frete proprio",
        ),
    ),
    (
        "Modelos específicos de negócio",
        (
            "como precificar produto artesanal",
            "precificar produto importado",
            "precificacao para revenda",
        ),
    ),
)


def read_csv(filename: str) -> list[dict[str, str]]:
    with (DATASET / filename).open(encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def fmt_int(value: int | float) -> str:
    return f"{round(value):,}".replace(",", ".")


def fmt_decimal(value: float) -> str:
    return f"{value:.1f}".replace(".", ",")


def fmt_percent(value: float) -> str:
    return f"{value * 100:.1f}%".replace(".", ",")


def intent_label(row: dict[str, str]) -> str:
    labels = []
    if row["is_informational"] == "True":
        labels.append("I")
    if row["is_transactional"] == "True":
        labels.append("T")
    if row["is_commercial"] == "True":
        labels.append("C")
    return "/".join(labels) or "—"


def main() -> None:
    price_tool = next(
        tool for tool in shortlist.TOOLS if tool["name"] == "Calculadora de preços de produtos e serviços"
    )
    keywords = set(price_tool["keywords"])
    keyword_rows = [row for row in read_csv("organic-keywords.csv") if row["keyword"] in keywords]
    competitor_rows = {row["competitor_domain"]: row for row in read_csv("organic-competitors.csv")}
    page_rows = {row["url"]: row for row in read_csv("top-pages.csv")}

    rows_by_keyword: dict[str, list[dict[str, str]]] = defaultdict(list)
    rows_by_domain: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in keyword_rows:
        rows_by_keyword[row["keyword"]].append(row)
        rows_by_domain[row["domain"]].append(row)

    assert set(rows_by_keyword) == keywords
    competitors = sorted(set(rows_by_domain) - {TARGET})
    assert set(competitors) <= set(competitor_rows)

    keyword_metrics = {}
    total_volume = 0
    target_volume = 0
    for keyword in keywords:
        rows = rows_by_keyword[keyword]
        volumes = {int(float(row["volume"])) for row in rows}
        kds = {float(row["keyword_difficulty"]) for row in rows}
        assert len(volumes) == len(kds) == 1
        volume = volumes.pop()
        kd = kds.pop()
        competitor_rankings = sorted(
            (row for row in rows if row["domain"] != TARGET),
            key=lambda row: (int(row["best_position"]), row["domain"]),
        )
        target_row = next((row for row in rows if row["domain"] == TARGET), None)
        total_volume += volume
        if target_row:
            target_volume += volume
        keyword_metrics[keyword] = {
            "volume": volume,
            "kd": kd,
            "intent": intent_label(rows[0]),
            "competitor_rankings": competitor_rankings,
            "target_row": target_row,
        }

    gap_volume = total_volume - target_volume
    kds = [metric["kd"] for metric in keyword_metrics.values()]
    weighted_kd = sum(metric["kd"] * metric["volume"] for metric in keyword_metrics.values()) / total_volume
    easy_volume = sum(metric["volume"] for metric in keyword_metrics.values() if metric["kd"] <= 10)

    relevant_competitor_pages = {
        row["best_position_url"]: page_rows[row["best_position_url"]]
        for row in keyword_rows
        if row["domain"] != TARGET and row["best_position_url"] in page_rows
    }
    urs = [float(row["ur"]) for row in relevant_competitor_pages.values()]
    referring_domains = [int(float(row["referring_domains"])) for row in relevant_competitor_pages.values()]
    explicit_tools = [
        row for row in relevant_competitor_pages.values()
        if "/ferramentas/" in row["url"] or "Calculator" in row["page_type"] or "Interactive" in row["page_type"]
    ]

    competitor_metrics = []
    for domain in competitors:
        rows = rows_by_domain[domain]
        covered = {row["keyword"] for row in rows}
        urls = {row["best_position_url"] for row in rows}
        sampled_pages = [page_rows[url] for url in urls if url in page_rows]
        strongest_page = max(
            sampled_pages,
            key=lambda row: (int(float(row["sum_traffic"])), float(row["ur"])),
        )
        competitor_metrics.append(
            {
                "domain": domain,
                "dr": float(competitor_rows[domain]["domain_rating"]),
                "keywords": len(covered),
                "footprint_volume": sum(keyword_metrics[keyword]["volume"] for keyword in covered),
                "traffic": sum(int(float(row["sum_traffic"])) for row in rows),
                "best_position": min(int(row["best_position"]) for row in rows),
                "avg_position": statistics.mean(int(row["best_position"]) for row in rows),
                "top3": sum(int(row["best_position"]) <= 3 for row in rows),
                "pages": len(urls),
                "avg_ur": statistics.mean(float(page["ur"]) for page in sampled_pages),
                "max_ur": max(float(page["ur"]) for page in sampled_pages),
                "strongest_page": strongest_page,
                "has_explicit_tool": any(page in explicit_tools for page in sampled_pages),
            }
        )
    competitor_metrics.sort(key=lambda row: (-row["footprint_volume"], row["dr"]))
    drs = [row["dr"] for row in competitor_metrics]

    lines = [
        "# Diagnóstico do gap — Calculadora de preços de produtos e serviços",
        "",
        "## Veredito executivo",
        "",
        "O gap é **real**, mas precisa ser descrito com precisão. No dataset, a InfinitePay fictícia não possui uma calculadora de preço e aparece somente para `como calcular preco de venda`, por meio de um artigo na posição 34. Isso deixa **20 de 21 keywords** e **40.160 de 41.040 buscas mensais (97,9%)** sem cobertura SEO observada.",
        "",
        "A dificuldade aparente é favorável: KD médio simples de **5,8**, KD ponderado por volume de **6,4** e **92,9% do volume em keywords com KD até 10**. A autoridade dos seis concorrentes é mais heterogênea — DR entre **29 e 71**, média **50,3** — mas domínios de DR 29 e 38 conquistam posições 1 e 2. Portanto, o dataset não sugere que DR alto seja uma barreira obrigatória.",
        "",
        "A principal ressalva é de escopo: as 41.040 buscas combinam intenção geral, serviços e casos verticais. Uma única calculadora genérica tem aderência direta ao núcleo de **25.150 buscas (61,3%)**. Para disputar todo o volume, a hipótese mais defensável é uma ferramenta central apoiada por páginas ou modos específicos para profissões e modelos de negócio.",
        "",
        "## Evidências do gap",
        "",
        "| Evidência | Resultado | Leitura |",
        "|---|---:|---|",
        f"| Keywords do escopo | {len(keywords)} | Universo definido para a hipótese |",
        f"| Volume total | {fmt_int(total_volume)} | Demanda bruta; não é previsão de tráfego |",
        f"| Gap SEO ponderado | {fmt_percent(gap_volume / total_volume)} | {fmt_int(gap_volume)} buscas sem ranking da InfinitePay no recorte |",
        f"| Cobertura da InfinitePay | 1 keyword / {fmt_int(target_volume)} buscas | Artigo na posição 34; não é ferramenta |",
        "| Gap funcional | 100% | Nenhuma calculadora de preço identificada no dataset, sob a premissa do case |",
        f"| Concorrentes observados | {len(competitors)} | Somente os domínios presentes na amostra |",
        f"| Formato concorrente explícito | {len(explicit_tools)} ferramenta em {len(relevant_competitor_pages)} páginas relevantes | A SERP observada é majoritariamente editorial |",
        "",
        "### O que o número de 97,9% prova — e o que não prova",
        "",
        "Ele prova ausência de ranking da InfinitePay na amostra para quase todo o volume selecionado. Não prova que uma única URL conseguirá capturar as 21 keywords, nem que o dataset contém todos os resultados da SERP. O gap funcional é validado pela ausência de uma ferramenta no inventário fictício; o tamanho capturável depende da arquitetura de conteúdo e da adequação da calculadora a cada subintenção.",
        "",
        "## Decomposição da demanda",
        "",
        "| Subgrupo | Keywords | Volume | Participação | KD médio | KD ponderado | Gap SEO |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]

    for group_name, group_keywords in GROUPS:
        group = [keyword_metrics[keyword] for keyword in group_keywords]
        volume = sum(row["volume"] for row in group)
        gap = sum(row["volume"] for row in group if row["target_row"] is None)
        lines.append(
            f"| {group_name} | {len(group)} | {fmt_int(volume)} | {fmt_percent(volume / total_volume)} | "
            f"{fmt_decimal(statistics.mean(row['kd'] for row in group))} | "
            f"{fmt_decimal(sum(row['kd'] * row['volume'] for row in group) / volume)} | {fmt_percent(gap / volume)} |"
        )

    lines.extend(
        [
            "",
            "O núcleo geral de produtos deve ser a referência para o business case conservador. Serviços e verticais são expansão de cobertura, não demanda automaticamente capturada pela mesma landing page.",
            "",
            "## Dificuldade por keyword",
            "",
            "Legenda de intenção: **I** = informacional, **T** = transacional, **C** = comercial. As posições são as melhores posições observadas por domínio.",
            "",
            "| Subgrupo | Keyword | Intenção | Volume | KD | Concorrentes | Melhor concorrente | InfinitePay |",
            "|---|---|---:|---:|---:|---:|---|---:|",
        ]
    )

    for group_name, group_keywords in GROUPS:
        for keyword in sorted(group_keywords, key=lambda item: -keyword_metrics[item]["volume"]):
            metric = keyword_metrics[keyword]
            best = metric["competitor_rankings"][0]
            best_domain = best["domain"]
            best_dr = float(competitor_rows[best_domain]["domain_rating"])
            best_ur = float(page_rows[best["best_position_url"]]["ur"])
            target_position = int(metric["target_row"]["best_position"]) if metric["target_row"] else None
            lines.append(
                f"| {group_name} | `{keyword}` | {metric['intent']} | {fmt_int(metric['volume'])} | "
                f"{fmt_decimal(metric['kd'])} | {len(metric['competitor_rankings'])} | "
                f"`{best_domain}` · pos. {best['best_position']} · DR {fmt_decimal(best_dr)} · UR {fmt_decimal(best_ur)} | "
                f"{target_position if target_position is not None else '—'} |"
            )

    lines.extend(
        [
            "",
            f"**Distribuição de KD:** mínimo {fmt_decimal(min(kds))}; mediana {fmt_decimal(statistics.median(kds))}; média {fmt_decimal(statistics.mean(kds))}; média ponderada por volume {fmt_decimal(weighted_kd)}; máximo {fmt_decimal(max(kds))}. Keywords com KD até 10 representam {fmt_int(easy_volume)} buscas ({fmt_percent(easy_volume / total_volume)} do volume).",
            "",
            "## Posições observadas por domínio",
            "",
            "Cada célula mostra **posição/UR** da página que rankeia. Assim, `3/21` significa posição 3 sustentada por uma página de UR 21. `—` significa que o domínio não aparece para a keyword na amostra.",
            "",
        ]
    )

    abbreviations = {domain: f"C{index}" for index, domain in enumerate(competitors, 1)}
    header = "| Keyword | KD | Volume | " + " | ".join(abbreviations[domain] for domain in competitors) + " | InfinitePay |"
    separator = "|---|---:|---:|" + "---:|" * (len(competitors) + 1)
    lines.extend([header, separator])
    for keyword in sorted(keywords, key=lambda item: -keyword_metrics[item]["volume"]):
        metric = keyword_metrics[keyword]
        rankings = {}
        for row in rows_by_keyword[keyword]:
            page = page_rows.get(row["best_position_url"])
            ur = fmt_int(float(page["ur"])) if page else "?"
            rankings[row["domain"]] = f"{int(row['best_position'])}/{ur}"
        domain_positions = " | ".join(rankings.get(domain, "—") for domain in competitors)
        lines.append(
            f"| `{keyword}` | {fmt_decimal(metric['kd'])} | {fmt_int(metric['volume'])} | "
            f"{domain_positions} | {rankings.get(TARGET, '—')} |"
        )
    lines.extend(["", "**Legenda dos domínios:**"])
    for domain in competitors:
        lines.append(f"- **{abbreviations[domain]}:** `{domain}` — DR {fmt_decimal(float(competitor_rows[domain]['domain_rating']))}")

    lines.extend(
        [
            "",
            "## Dificuldade por concorrente",
            "",
            f"**DR do grupo:** mínimo {fmt_decimal(min(drs))}; mediana {fmt_decimal(statistics.median(drs))}; média {fmt_decimal(statistics.mean(drs))}; máximo {fmt_decimal(max(drs))}.",
            "",
            "| Concorrente | DR | UR médio | UR máximo | KWs cobertas | Volume das keywords cobertas* | Tráfego nas KWs | Melhor posição | Posição média | Top 3 | Páginas | Ferramenta explícita |",
            "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|",
        ]
    )
    for row in competitor_metrics:
        lines.append(
            f"| `{row['domain']}` | {fmt_decimal(row['dr'])} | {fmt_decimal(row['avg_ur'])} | "
            f"{fmt_decimal(row['max_ur'])} | {row['keywords']} | "
            f"{fmt_int(row['footprint_volume'])} | {fmt_int(row['traffic'])} | {row['best_position']} | "
            f"{fmt_decimal(row['avg_position'])} | {row['top3']} | {row['pages']} | "
            f"{'Sim' if row['has_explicit_tool'] else 'Não'} |"
        )
    lines.extend(
        [
            "",
            "\\* Soma do volume das keywords em que o domínio aparece. Há sobreposição entre concorrentes; portanto, a coluna não representa tráfego capturado, participação de mercado e não deve ser somada entre domínios.",
            "",
            "### Força das páginas concorrentes",
            "",
            f"Foram cruzadas {len(relevant_competitor_pages)} páginas concorrentes com `top-pages.csv`. A mediana é **UR {fmt_decimal(statistics.median(urs))}** e **{fmt_decimal(statistics.median(referring_domains))} domínios de referência**. O intervalo vai de UR {fmt_decimal(min(urs))} a {fmt_decimal(max(urs))} e de {min(referring_domains)} a {max(referring_domains)} domínios de referência.",
            "",
            "| Concorrente | Página relevante mais forte na amostra | UR | Domínios de referência | Tráfego da página |",
            "|---|---|---:|---:|---:|",
        ]
    )
    for row in competitor_metrics:
        page = row["strongest_page"]
        lines.append(
            f"| `{row['domain']}` | `{page['url']}` | {fmt_decimal(float(page['ur']))} | "
            f"{fmt_int(int(float(page['referring_domains'])))} | {fmt_int(int(float(page['sum_traffic'])))} |"
        )

    lines.extend(
        [
            "",
            "## Avaliação final",
            "",
            "### O que favorece atacar o gap",
            "",
            "- Quase todo o volume selecionado está fora da cobertura SEO da InfinitePay fictícia.",
            "- A dificuldade das keywords é baixa: nenhuma ultrapassa KD 12.",
            "- Sites de DR 29 e 38 obtêm posições 1 e 2, reduzindo a evidência de uma barreira de autoridade de domínio.",
            "- As páginas concorrentes relevantes têm autoridade de URL e backlinks modestos na mediana.",
            "- Apenas uma página concorrente é explicitamente identificável como ferramenta; o restante é majoritariamente editorial.",
            "",
            "### O que reduz ou condiciona a oportunidade",
            "",
            "- A maior keyword, `precificacao`, é ampla e pode preferir uma explicação conceitual; uma calculadora isolada não satisfaz necessariamente a SERP.",
            "- Cerca de 38,7% do volume pertence a serviços, profissões ou modelos específicos. Esses termos podem exigir exemplos, defaults e páginas próprias.",
            "- O dataset é uma amostra de domínios e páginas, não uma fotografia completa das dez posições de cada SERP.",
            "- KD e DR são indicadores, não probabilidades de ranking. O resultado depende de conteúdo, links internos, UX, autoridade temática e adequação à intenção.",
            "",
            "### Conclusão",
            "",
            "**Manter como top 1 é defensável.** A oportunidade mais sólida, porém, não é uma calculadora genérica tentando rankear sozinha para 41.040 buscas. É um **hub híbrido de precificação**: ferramenta central para produtos e serviços, explicação editorial para os termos amplos e experiências ou páginas parametrizadas para as principais verticais. Para um business case conservador, use **25.150 buscas mensais** como núcleo diretamente endereçável; trate as **15.890 buscas restantes** como expansão potencial.",
            "",
            "## Limitações metodológicas",
            "",
            "- Volume e KD são únicos por keyword no dataset; volume não equivale a cliques disponíveis.",
            "- `organic-keywords.csv` registra a melhor posição de cada domínio presente, não toda a SERP.",
            "- `top-pages.csv` é uma amostra parcial; UR e domínios de referência descrevem somente as páginas cruzadas.",
            "- A ausência de URL de ferramenta foi validada apenas no dataset fictício e na premissa fornecida, sem consulta a dados reais da InfinitePay.",
            "- Tráfego é estimado e não foi usado para calcular o tamanho do gap.",
            "",
        ]
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Relatório atualizado: {OUTPUT}")
    print(f"Volume: {fmt_int(total_volume)} | Gap: {fmt_int(gap_volume)} ({fmt_percent(gap_volume / total_volume)})")
    print(f"KD médio: {fmt_decimal(statistics.mean(kds))} | KD ponderado: {fmt_decimal(weighted_kd)}")
    print(f"Concorrentes: {len(competitors)} | DR médio: {fmt_decimal(statistics.mean(drs))}")


if __name__ == "__main__":
    main()
