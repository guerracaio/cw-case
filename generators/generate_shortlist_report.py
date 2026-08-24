"""Gera o relatório consolidado da shortlist de ferramentas."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset"
OUTPUT = ROOT / "outputs" / "seo-demand-maps" / "relatorio_shortlist_ferramentas.md"
TARGET = "infinitepay.io"


TOOLS = (
    {
        "name": "Gerador de QR Code",
        "cluster": "Utilitários online + Pix",
        "utility_fit": 5,
        "business_fit": 3,
        "effort": 2,
        "keywords": ("gerador de qr code", "qr code pix"),
        "note": "O escopo pressupõe um gerador de QR Codes genéricos com um modo específico para Pix.",
    },
    {
        "name": "Calculadora de preços de produtos e serviços",
        "cluster": "Precificação, custos e margens",
        "utility_fit": 5,
        "business_fit": 3,
        "effort": 3,
        "keywords": (
            "precificacao", "como precificar um produto", "precificacao de produtos",
            "como calcular preco de venda", "como definir o valor do meu produto",
            "formacao de preco de venda", "preco de venda formula", "calculadora de preco de venda",
            "calcular preco de venda com imposto",
            "quanto cobrar por unha", "quanto cobrar por um bolo", "quanto cobrar por corte de cabelo",
            "quanto cobrar por hora de trabalho", "quanto cobrar por marmita", "quanto cobrar por um servico",
            "precificacao de servicos", "quanto cobrar por frete proprio", "calcular preco por quilo",
            "como precificar produto artesanal", "precificar produto importado", "precificacao para revenda",
        ),
        "note": "O escopo pressupõe uma calculadora de preço para produtos e serviços, com modos por profissão e modelo de negócio. No dataset, `como calcular preco de venda` é coberta apenas por um artigo; nenhuma calculadora de preço foi identificada. Markup e margem foram excluídos deste escopo pela premissa adicional de que já são atendidos pela ferramenta de margem.",
    },
    {
        "name": "Simulador de descontos",
        "cluster": "Calculadoras + Precificação, custos e margens",
        "utility_fit": 5,
        "business_fit": 3,
        "effort": 2,
        "keywords": ("calculadora de desconto", "como calcular desconto maximo", "como dar desconto sem perder lucro"),
        "note": "O escopo é comercial: descobrir o desconto possível sem comprometer margem e lucro, não apenas aplicar uma porcentagem.",
    },
    {
        "name": "Planilha de vendas",
        "cluster": "Documentos e modelos empresariais",
        "utility_fit": 5,
        "business_fit": 3,
        "effort": 1,
        "keywords": ("planilha de vendas",),
        "note": "A oportunidade depende de entregar uma planilha realmente utilizável, não apenas um artigo.",
    },
    {
        "name": "Comparador de maquininhas",
        "cluster": "Maquininhas e adquirência",
        "utility_fit": 4,
        "business_fit": 5,
        "effort": 4,
        "keywords": (
            "maquininha de cartao", "qual a melhor maquininha", "maquininha sem mensalidade",
            "taxa de cartao de credito", "maquininha para mei passo a passo", "simulador de taxas maquininha",
            "tap to pay", "pagamento por aproximacao celular", "comparar taxas maquininha",
            "maquininha sem mensalidade vale a pena", "maquininha que aceita pix 2026",
            "taxa de debito maquininha como funciona", "maquininha com chip ou wifi o que e",
            "aluguel de maquininha 2026", "calculadora de taxas de cartao", "taxa de debito maquininha 2026",
            "aluguel de maquininha simples", "maquininha com chip ou wifi passo a passo",
            "maquininha que aceita pix passo a passo",
        ),
        "note": "O comparador deve responder escolha, taxas, mensalidade, conectividade, Pix e perfil de uso. É a hipótese mais ampla da shortlist.",
    },
    {
        "name": "Diagnóstico de prontidão para crédito",
        "cluster": "Crédito e financiamento PJ",
        "utility_fit": 4,
        "business_fit": 1,
        "effort": 4,
        "keywords": ("analise de credito pj", "score de credito como aumentar simples", "score empresarial"),
        "note": "O escopo foi restrito ao subconjunto diagnóstico e educativo; buscas de contratação de empréstimos foram excluídas.",
    },
    {
        "name": "Simulador de antecipação de recebíveis",
        "cluster": "Antecipação e recebíveis",
        "utility_fit": 5,
        "business_fit": 1,
        "effort": 3,
        "keywords": (
            "antecipacao de recebiveis", "antecipacao de recebiveis como funciona",
            "antecipar recebiveis cartao", "credito com garantia de recebiveis", "taxa de antecipacao",
        ),
        "note": "O escopo contempla valor líquido, taxa efetiva, prazo e comparação entre receber normalmente ou antecipar.",
    },
)


def read_csv(filename: str) -> list[dict[str, str]]:
    with (DATASET / filename).open(encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def fmt_int(value: int) -> str:
    return f"{value:,}".replace(",", ".")


def fmt_index(value: float) -> str:
    return f"{value:.1f}".replace(".", ",")


def fmt_percent(value: float) -> str:
    return f"{value * 100:.1f}%".replace(".", ",")


def build_metrics() -> list[dict]:
    keyword_rows = read_csv("organic-keywords.csv")
    competitor_rows = read_csv("organic-competitors.csv")
    domain_rating = {row["competitor_domain"]: float(row["domain_rating"]) for row in competitor_rows}
    rows_by_keyword: dict[str, list[dict[str, str]]] = defaultdict(list)
    for row in keyword_rows:
        rows_by_keyword[row["keyword"]].append(row)

    metrics = []
    for tool in TOOLS:
        keyword_details = []
        competitors = set()
        target_keywords = []
        target_volume = 0
        traffic = 0
        volume = 0

        for keyword in tool["keywords"]:
            rows = rows_by_keyword[keyword]
            assert rows, f"Keyword ausente: {keyword}"
            volumes = {int(float(row["volume"])) for row in rows}
            difficulties = {float(row["keyword_difficulty"]) for row in rows}
            assert len(volumes) == len(difficulties) == 1
            keyword_volume = volumes.pop()
            keyword_traffic = sum(int(float(row["sum_traffic"])) for row in rows)
            keyword_kd = difficulties.pop()
            volume += keyword_volume
            traffic += keyword_traffic
            competitors.update(row["domain"] for row in rows if row["domain"] != TARGET)
            if any(row["domain"] == TARGET for row in rows):
                target_keywords.append(keyword)
                target_volume += keyword_volume
            keyword_details.append(
                {"keyword": keyword, "volume": keyword_volume, "traffic": keyword_traffic, "kd": keyword_kd}
            )

        missing_dr = competitors - set(domain_rating)
        assert not missing_dr, f"DR ausente: {missing_dr}"
        gap_volume = volume - target_volume
        gap = gap_volume / volume
        opportunity = gap_volume * tool["utility_fit"] * tool["business_fit"] / tool["effort"]
        metrics.append(
            {
                **tool,
                "volume": volume,
                "traffic": traffic,
                "competitors": sorted(competitors),
                "competitor_count": len(competitors),
                "avg_dr": sum(domain_rating[domain] for domain in competitors) / len(competitors),
                "avg_kd": sum(row["kd"] for row in keyword_details) / len(keyword_details),
                "keyword_details": sorted(keyword_details, key=lambda row: (-row["volume"], row["keyword"])),
                "target_keywords": sorted(target_keywords),
                "target_volume": target_volume,
                "gap_volume": gap_volume,
                "gap": gap,
                "opportunity": opportunity,
            }
        )

    return sorted(metrics, key=lambda row: (-row["opportunity"], -row["volume"], row["avg_dr"], row["avg_kd"]))


def render(metrics: list[dict]) -> str:
    lines = [
        "# Shortlist consolidada de ferramentas",
        "",
        "As hipóteses são ordenadas por `Opportunity = Demand × Gap × Utility Fit × Business Fit ÷ Effort`. Demand e Gap vêm do dataset; Utility Fit e Effort são julgamentos em escala de 1 a 5; Business Fit usa as notas de lead bridge fornecidas. Por premissa do case, markup e margem são considerados cobertos; o dataset comprova diretamente apenas a calculadora de margem.",
        "",
        "## Ranking de oportunidade",
        "",
        "| # | Ferramenta hipotética | Demand | Gap SEO | Utility Fit | Business Fit | Effort | Opportunity |",
        "|---:|---|---:|---:|---:|---:|---:|---:|",
    ]
    for index, tool in enumerate(metrics, 1):
        lines.append(
            f"| {index} | {tool['name']} | {fmt_int(tool['volume'])} | {fmt_percent(tool['gap'])} | "
            f"{tool['utility_fit']} | {tool['business_fit']} | {tool['effort']} | "
            f"**{fmt_int(round(tool['opportunity']))}** |"
        )

    lines.extend(
        [
            "",
            "## Métricas SEO e concorrência",
            "",
            "| # | Ferramenta hipotética | Cluster atendido | Concorrentes | DR médio | Keywords | KD médio | Volume mensal | Tráfego estimado |",
            "|---:|---|---|---:|---:|---:|---:|---:|---:|",
        ]
    )
    for index, tool in enumerate(metrics, 1):
        lines.append(
            f"| {index} | {tool['name']} | {tool['cluster']} | {tool['competitor_count']} | "
            f"{fmt_index(tool['avg_dr'])} | {len(tool['keyword_details'])} | {fmt_index(tool['avg_kd'])} | "
            f"{fmt_int(tool['volume'])} | {fmt_int(tool['traffic'])} |"
        )

    lines.extend(["", "## Detalhamento", ""])
    for index, tool in enumerate(metrics, 1):
        coverage = (
            ", ".join(f"`{keyword}`" for keyword in tool["target_keywords"])
            if tool["target_keywords"] else "nenhuma keyword"
        )
        lines.extend(
            [
                f"### {index}. {tool['name']}",
                "",
                f"- **Cluster:** {tool['cluster']}",
                f"- **Concorrentes ({tool['competitor_count']}):** " + ", ".join(f"`{d}`" for d in tool["competitors"]),
                f"- **DR médio dos concorrentes:** {fmt_index(tool['avg_dr'])}",
                f"- **KD médio das keywords:** {fmt_index(tool['avg_kd'])}",
                f"- **Cobertura da InfinitePay no recorte:** {len(tool['target_keywords'])} de {len(tool['keyword_details'])} — {coverage}",
                f"- **Gap SEO ponderado por volume:** {fmt_percent(tool['gap'])} ({fmt_int(tool['gap_volume'])} de {fmt_int(tool['volume'])} buscas)",
                f"- **Opportunity:** {fmt_int(round(tool['opportunity']))}",
                "",
                "| Keyword incluída | KD | Volume | Tráfego estimado |",
                "|---|---:|---:|---:|",
            ]
        )
        for keyword in tool["keyword_details"]:
            lines.append(
                f"| {keyword['keyword']} | {fmt_index(keyword['kd'])} | "
                f"{fmt_int(keyword['volume'])} | {fmt_int(keyword['traffic'])} |"
            )
        lines.extend(
            [
                f"| **Total / média** | **{fmt_index(tool['avg_kd'])}** | **{fmt_int(tool['volume'])}** | **{fmt_int(tool['traffic'])}** |",
                "",
                tool["note"],
                "",
            ]
        )

    lines.extend(
        [
            "## Metodologia",
            "",
            "- **DR médio:** média aritmética simples do `domain_rating` dos concorrentes únicos que rankeiam para ao menos uma keyword da ferramenta.",
            "- **KD médio:** média aritmética simples do `keyword_difficulty` das keywords únicas incluídas na hipótese.",
            "- **Volume:** soma do volume mensal, contando cada keyword uma vez.",
            "- **Tráfego estimado:** soma de `organic-keywords.sum_traffic` por keyword e domínio.",
            "- **Gap SEO:** proporção do volume da hipótese para a qual a InfinitePay não rankeia no recorte. É ponderado por volume, não por quantidade de keywords.",
            "- **Utility Fit:** adequação da demanda a uma experiência utilitária, em escala de 1 a 5.",
            "- **Business Fit:** notas de lead bridge fornecidas, mantidas por ferramenta mesmo após a mudança de posição no ranking.",
            "- **Effort:** esforço relativo de construção e manutenção, em escala de 1 a 5.",
            "- **Opportunity:** `Volume × Gap SEO × Utility Fit × Business Fit ÷ Effort`.",
            "- **Ordenação:** Opportunity decrescente; em caso de empate, volume decrescente, DR médio crescente e KD médio crescente.",
            "- Para a calculadora de preços, o gap funcional é 100%, mas o ranking usa gap SEO de 97,9% para manter comparabilidade: uma keyword é coberta apenas por artigo.",
            "- A presença da InfinitePay indica ranking no recorte, não confirma nem nega a existência atual da ferramenta.",
            "- As métricas representam a amostra exportada e não todo o mercado de busca.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    metrics = build_metrics()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(render(metrics), encoding="utf-8")
    print(f"Relatório atualizado: {OUTPUT}")
    for index, tool in enumerate(metrics, 1):
        print(index, tool["name"], fmt_int(round(tool["opportunity"])), fmt_percent(tool["gap"]))


if __name__ == "__main__":
    main()
