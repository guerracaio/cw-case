"""Gera dois mapas auditáveis de demanda SEO a partir de dataset/.

Saídas:
  - mapa_1_mercado.md: demanda única observada em todos os domínios.
  - mapa_2_gap_infinitepay.md: demanda para a qual infinitepay.io não aparece.
  - mapa_3_conteudo_utilitario_mercado.md: mercado sem demanda de marca.
  - mapa_4_conteudo_utilitario_gap.md: gap sem demanda de marca.
  - cluster_assignments.json: trilha de auditoria keyword a keyword.

O volume de uma keyword é contado uma única vez, mesmo quando ela aparece em
mais de um domínio. Concorrentes excluem o domínio-alvo; páginas são URLs
distintas dentro do recorte analisado.
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset"
OUTPUT = ROOT / "outputs" / "seo-demand-maps"
TARGET = "infinitepay.io"


@dataclass(frozen=True)
class TopicRule:
    macrotema: str
    cluster: str
    assunto: str
    patterns: tuple[str, ...]


# A ordem é intencional: marcas e produtos específicos vencem regras genéricas.
RULES = (
    TopicRule("Demanda de marca", "Marca Banco Quantum", "Navegação e produtos do Banco Quantum", (r"\bquantum\b",)),
    TopicRule("Demanda de marca", "Marca Banco Aurora", "Navegação e produtos do Banco Aurora", (r"\baurora\b",)),
    TopicRule("Demanda de marca", "Marca Pagsfera", "Navegação, taxas e produtos da Pagsfera", (r"\bpagsfera\b",)),
    TopicRule("Demanda de marca", "Marca VendaMais", "Navegação da VendaMais", (r"\bvendamais\b",)),
    TopicRule("Demanda de marca", "Marca Credlink", "Navegação e produtos da Credlink", (r"\bcredlink\b",)),

    TopicRule("Pagamentos", "Maquininhas e adquirência", "Escolha, taxas e recursos de maquininhas", (
        r"maquininha", r"tap to pay", r"pagamento por aproximacao", r"taxa de cartao de credito",
        r"calculadora de taxas de cartao", r"comparar taxas", r"simulador de taxas",
    )),
    TopicRule("Pagamentos", "Pix", "Uso do Pix por pessoas e empresas", (r"\bpix\b",)),
    TopicRule("Pagamentos", "Boletos", "Emissão, pagamento e modalidades de boleto", (r"\bboleto", r"compensacao boleto",)),
    TopicRule("Pagamentos", "Pagamentos digitais", "Links, checkout, gateway, recorrência e split", (
        r"link de pagamento", r"gateway de pagamento", r"cobranca recorrente", r"checkout transparente",
        r"split de pagamento",
    )),
    TopicRule("Pagamentos", "Cartões e operação de pagamentos", "Cartões empresariais, bandeiras, chargeback e parcelamento", (
        r"cartao corporativo", r"cartao empresarial", r"cartao de debito empresarial", r"bandeira do cartao",
        r"chargeback", r"anuidade cartao", r"parcelamento sem juros lojista", r"prazo de recebimento cartao",
    )),

    TopicRule("Serviços financeiros", "Antecipação e recebíveis", "Antecipação, duplicatas, factoring e cessão de crédito", (
        r"antecip", r"recebiveis", r"duplicata", r"factoring", r"risco sacado", r"cessao de credito",
        r"taxa de desconto de duplicata",
    )),
    TopicRule("Serviços financeiros", "Crédito e financiamento PJ", "Capital de giro, empréstimos, financiamento e risco de crédito", (
        r"emprestimo", r"capital de giro", r"financiamento", r"linha de credito", r"credito com garantia",
        r"analise de credito", r"renegociacao de divida empresarial", r"score empresarial",
        r"score de credito", r"cartao de credito para negativado", r"seguro para pequenas empresas",
    )),
    TopicRule("Serviços financeiros", "Conta PJ e serviços bancários", "Conta empresarial, tarifas e operação bancária", (
        r"conta pj", r"conta digital para empresa", r"conta corrente ou conta pagamento", r"domicilio bancario",
        r"tarifas conta pj", r"extrato bancario pj", r"transferencia ted", r"pagamento de fornecedores",
        r"gerente de conta pj", r"pix para cnpj", r"aplicacao automatica cdi",
    )),

    TopicRule("Empreendedorismo", "MEI", "Abertura, obrigações, benefícios e regularização do MEI", (
        r"\bmei\b", r"cnae mei", r"desenquadramento mei",
    )),
    TopicRule("Empreendedorismo", "Fiscal e tributário", "Tributos, regimes, códigos fiscais e nota de serviço", (
        r"simples nacional", r"icms", r"cfop", r"substituicao tributaria", r"irpj",
        r"lucro real e presumido", r"nota fiscal de servico",
    )),
    TopicRule("Gestão", "Precificação, custos e margens", "Formação de preço, custos, markup, margem e lucro", (
        r"precific", r"preco", r"quanto cobrar", r"markup", r"margem", r"lucro", r"custo",
        r"ponto de equilibrio", r"comissao de vendedor", r"rateio", r"calcular desconto maximo",
        r"dar desconto sem perder", r"vendendo barato", r"definir o valor do meu produto",
    )),
    TopicRule("Gestão", "Estoque e operações", "Controle, inventário, giro e curva ABC de estoque", (
        r"estoque", r"inventario", r"curva abc", r"custo de mercadoria vendida",
    )),
    TopicRule("Gestão", "Fluxo de caixa e gestão financeira", "Caixa, recebimentos e organização financeira do negócio", (
        r"fluxo de caixa", r"gestao financeira", r"prazo medio de recebimento",
    )),
    TopicRule("Gestão", "RH e folha de pagamento", "Folha, custos de pessoal e rotinas trabalhistas da empresa", (
        r"folha de pagamento", r"custo de funcionario",
    )),
    TopicRule("Gestão", "Documentos e modelos empresariais", "Contratos, recibos, orçamentos e planilhas de apoio", (
        r"contrato de prestacao", r"recibo de pagamento", r"modelo de orcamento", r"planilha de vendas",
    )),

    TopicRule("Vendas e crescimento", "E-commerce e logística", "Loja virtual, operação de e-commerce, frete e conversão", (
        r"loja virtual", r"vender online", r"marketplace", r"dropshipping", r"frete", r"abandono de carrinho",
        r"descricao de produto", r"fotografia de produto",
    )),
    TopicRule("Vendas e crescimento", "Marketing e fidelização", "Aquisição, presença digital, vendas e retenção de clientes", (
        r"programa de fidelidade", r"google meu negocio", r"instagram para vendas", r"trafego pago",
        r"whatsapp business", r"fidelizar clientes", r"indicadores de vendas",
    )),
    TopicRule("Vendas e crescimento", "Marca e identidade do negócio", "Nome, logo e identidade para lojas", (
        r"nome para loja", r"criar logo",
    )),

    TopicRule("Finanças pessoais", "Investimentos e educação financeira", "Investimentos, dívidas e reserva financeira", (
        r"juros compostos", r"sair do vermelho", r"reserva de emergencia", r"cdb", r"tesouro direto",
        r"financiamento ou consorcio", r"calculadora de rendimento",
    )),
    TopicRule("Ferramentas", "Calculadoras pessoais e trabalhistas", "Cálculos de salário, benefícios, datas e matemática", (
        r"calculadora de salario", r"calculadora de ferias", r"calculadora imc", r"calculadora decimo terceiro",
        r"calculadora de porcentagem", r"calculadora de rescisao", r"calculadora de dias uteis",
        r"calculadora de regra de tres", r"calculadora fgts", r"calculadora horas extras",
        r"calculadora de idade", r"calculadora inss", r"calculadora de juros simples", r"calculadora de desconto",
    )),
    TopicRule("Ferramentas", "Utilitários online", "Conversores, geradores, editores e utilitários genéricos", (
        r"conversor", r"gerador", r"cronometro online", r"contador de caracteres", r"editor de imagem",
        r"sorteador de nomes",
    )),
)


def load_csv(filename: str) -> list[dict[str, str]]:
    with (DATASET / filename).open(encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def validate_sources(
    keyword_rows: list[dict[str, str]],
    competitor_rows: list[dict[str, str]],
    page_rows: list[dict[str, str]],
) -> None:
    """Confere que as três tabelas descrevem o mesmo universo analisado."""
    expected_competitors = {row["competitor_domain"] for row in competitor_rows}
    keyword_competitors = {row["domain"] for row in keyword_rows} - {TARGET}
    page_urls = {row["url"] for row in page_rows}
    keyword_urls = {row["best_position_url"] for row in keyword_rows}
    assert keyword_competitors == expected_competitors
    assert keyword_urls == page_urls


def classify(keyword: str) -> TopicRule:
    for rule in RULES:
        if any(re.search(pattern, keyword) for pattern in rule.patterns):
            return rule
    raise ValueError(f"Keyword sem cluster: {keyword}")


def build_keyword_records(rows: list[dict[str, str]]) -> list[dict]:
    grouped: dict[str, dict] = {}
    for row in rows:
        keyword = row["keyword"]
        item = grouped.setdefault(
            keyword,
            {
                "keyword": keyword,
                "volume": int(float(row["volume"])),
                "traffic": 0,
                "competitor_traffic": 0,
                "target_traffic": 0,
                "domains": set(),
                "competitors": set(),
                "pages": set(),
                "competitor_pages": set(),
                "target_pages": set(),
            },
        )
        item["domains"].add(row["domain"])
        item["pages"].add(row["best_position_url"])
        row_traffic = int(float(row["sum_traffic"]))
        item["traffic"] += row_traffic
        if row["domain"] == TARGET:
            item["target_traffic"] += row_traffic
            item["target_pages"].add(row["best_position_url"])
        else:
            item["competitor_traffic"] += row_traffic
            item["competitors"].add(row["domain"])
            item["competitor_pages"].add(row["best_position_url"])

    records = []
    for item in grouped.values():
        rule = classify(item["keyword"])
        records.append(
            {
                "macrotema": rule.macrotema,
                "cluster": rule.cluster,
                "assunto": rule.assunto,
                "keyword": item["keyword"],
                "volume": item["volume"],
                "traffic": item["traffic"],
                "competitor_traffic": item["competitor_traffic"],
                "target_traffic": item["target_traffic"],
                "target_ranks": TARGET in item["domains"],
                "competitors": sorted(item["competitors"]),
                "pages": sorted(item["pages"]),
                "competitor_pages": sorted(item["competitor_pages"]),
                "target_pages": sorted(item["target_pages"]),
            }
        )
    return sorted(records, key=lambda x: (-x["volume"], x["keyword"]))


def aggregate(records: list[dict]) -> list[dict]:
    buckets: dict[str, dict] = {}
    for item in records:
        bucket = buckets.setdefault(
            item["cluster"],
            {
                "macrotema": item["macrotema"],
                "cluster": item["cluster"],
                "assunto": item["assunto"],
                "volume": 0,
                "traffic": 0,
                "competitors": set(),
                "pages": set(),
                "keywords": set(),
            },
        )
        bucket["volume"] += item["volume"]
        bucket["traffic"] += item["traffic"]
        bucket["competitors"].update(item["competitors"])
        bucket["pages"].update(item["pages"])
        bucket["keywords"].add(item["keyword"])

    result = []
    for bucket in buckets.values():
        result.append(
            {
                "macrotema": bucket["macrotema"],
                "cluster": bucket["cluster"],
                "assunto": bucket["assunto"],
                "volume": bucket["volume"],
                "traffic": bucket["traffic"],
                "competitor_count": len(bucket["competitors"]),
                "page_count": len(bucket["pages"]),
                "keyword_count": len(bucket["keywords"]),
                "competitor_domains": sorted(bucket["competitors"]),
            }
        )
    return sorted(result, key=lambda x: (-x["volume"], x["cluster"]))


def fmt_int(value: int) -> str:
    return f"{value:,}".replace(",", ".")


def render_markdown(title: str, subtitle: str, aggregates: list[dict], records: list[dict]) -> str:
    total_volume = sum(row["volume"] for row in aggregates)
    total_traffic = sum(row["traffic"] for row in aggregates)
    total_keywords = sum(row["keyword_count"] for row in aggregates)
    all_competitors = {domain for row in aggregates for domain in row["competitor_domains"]}
    all_pages = {page for item in records for page in item["pages"]}
    lines = [
        f"# {title}",
        "",
        subtitle,
        "",
        "## Totais do recorte",
        "",
        f"- **Volume mensal único:** {fmt_int(total_volume)} buscas",
        f"- **Tráfego orgânico estimado:** {fmt_int(total_traffic)} visitas/mês",
        f"- **Keywords únicas:** {fmt_int(total_keywords)}",
        f"- **Concorrentes presentes:** {fmt_int(len(all_competitors))}",
        f"- **Páginas envolvidas:** {fmt_int(len(all_pages))}",
        "",
        "## Clusters de demanda",
        "",
        "| # | Macrotema | Cluster / assunto abordado | Volume mensal | Tráfego estimado | Concorrentes | Páginas | Keywords |",
        "|---:|---|---|---:|---:|---:|---:|---:|",
    ]
    for index, row in enumerate(aggregates, 1):
        lines.append(
            f"| {index} | {row['macrotema']} | **{row['cluster']}** — {row['assunto']} | "
            f"{fmt_int(row['volume'])} | {fmt_int(row['traffic'])} | {row['competitor_count']} | "
            f"{row['page_count']} | {row['keyword_count']} |"
        )
    lines.extend(
        [
            "",
            "## Metodologia",
            "",
            "- Uma keyword repetida em vários domínios soma seu volume apenas uma vez.",
            "- O tráfego soma `sum_traffic` por keyword e domínio; visitas capturadas por sites diferentes não são deduplicadas.",
            f"- Concorrentes são domínios únicos, excluindo `{TARGET}`.",
            "- Páginas são URLs únicas que rankeiam para ao menos uma keyword do cluster.",
            "- Os dados representam a amostra exportada, não a cobertura integral de cada site.",
            "- A taxonomia é determinística e pode ser auditada em `cluster_assignments.json`.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    rows = load_csv("organic-keywords.csv")
    competitor_rows = load_csv("organic-competitors.csv")
    page_rows = load_csv("top-pages.csv")
    validate_sources(rows, competitor_rows, page_rows)
    records = build_keyword_records(rows)
    market = aggregate(records)
    gap_records = [row for row in records if not row["target_ranks"]]
    gap = aggregate(gap_records)
    content_records = [row for row in records if row["macrotema"] != "Demanda de marca"]
    content_market = aggregate(content_records)
    content_gap_records = [row for row in gap_records if row["macrotema"] != "Demanda de marca"]
    content_gap = aggregate(content_gap_records)

    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "mapa_1_mercado.md").write_text(
        render_markdown(
            "Mapa 1 — Demanda SEO do mercado",
            "Visão consolidada de todas as keywords únicas observadas na InfinitePay e nos 14 concorrentes.",
            market,
            records,
        ),
        encoding="utf-8",
    )
    (OUTPUT / "mapa_2_gap_infinitepay.md").write_text(
        render_markdown(
            "Mapa 2 — Gap de demanda da InfinitePay",
            "Somente keywords em que `infinitepay.io` não aparece no recorte; representa a demanda ainda não coberta.",
            gap,
            gap_records,
        ),
        encoding="utf-8",
    )
    (OUTPUT / "mapa_3_conteudo_utilitario_mercado.md").write_text(
        render_markdown(
            "Mapa 3 — Conteúdo utilitário e informacional do mercado",
            "Visão editorial filtrada: exclui clusters de marca e mantém temas genéricos com potencial para guias, comparativos, calculadoras, geradores, modelos e conteúdos operacionais.",
            content_market,
            content_records,
        ),
        encoding="utf-8",
    )
    (OUTPUT / "mapa_4_conteudo_utilitario_gap.md").write_text(
        render_markdown(
            "Mapa 4 — Gap de conteúdo utilitário e informacional",
            "Oportunidades ainda não cobertas por `infinitepay.io`, removendo buscas de marca e navegação de concorrentes.",
            content_gap,
            content_gap_records,
        ),
        encoding="utf-8",
    )

    payload = {
        "metadata": {
            "target": TARGET,
            "sources": [
                "dataset/organic-keywords.csv",
                "dataset/organic-competitors.csv",
                "dataset/top-pages.csv",
            ],
            "raw_rows": len(rows),
            "unique_keywords": len(records),
            "market_volume_unique": sum(row["volume"] for row in records),
            "market_traffic": sum(row["traffic"] for row in records),
            "gap_keywords": len(gap_records),
            "gap_volume_unique": sum(row["volume"] for row in gap_records),
            "gap_traffic": sum(row["traffic"] for row in gap_records),
            "content_market_keywords": len(content_records),
            "content_market_volume_unique": sum(row["volume"] for row in content_records),
            "content_market_traffic": sum(row["traffic"] for row in content_records),
            "content_gap_keywords": len(content_gap_records),
            "content_gap_volume_unique": sum(row["volume"] for row in content_gap_records),
            "content_gap_traffic": sum(row["traffic"] for row in content_gap_records),
            "method": "volume deduplicado por keyword; domínios e URLs distintos por cluster",
        },
        "market_clusters": market,
        "gap_clusters": gap,
        "content_market_clusters": content_market,
        "content_gap_clusters": content_gap,
        "keyword_assignments": records,
    }
    (OUTPUT / "cluster_assignments.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Keywords únicas: {len(records)}")
    print(f"Clusters de mercado: {len(market)}")
    print(f"Volume único de mercado: {sum(row['volume'] for row in records)}")
    print(f"Keywords no gap: {len(gap_records)}")
    print(f"Volume único no gap: {sum(row['volume'] for row in gap_records)}")
    print(f"Clusters de conteúdo: {len(content_market)}")
    print(f"Volume de conteúdo no mercado: {sum(row['volume'] for row in content_records)}")
    print(f"Volume de conteúdo no gap: {sum(row['volume'] for row in content_gap_records)}")
    print(f"Saídas: {OUTPUT}")


if __name__ == "__main__":
    main()
