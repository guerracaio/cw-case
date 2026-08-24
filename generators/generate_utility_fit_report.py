"""Gera um relatório editorial detalhado sobre o fit de conteúdo utilitário.

O relatório usa o mapa filtrado de mercado (sem clusters de marca), lista todas
as keywords e páginas de cada cluster e aplica uma avaliação editorial explícita
sobre quando uma ferramenta/artefato deve substituir ou complementar um artigo.
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

import generate_demand_maps as demand


OUTPUT = demand.OUTPUT


# A avaliação é editorial, não uma cópia dos rótulos de intenção da origem.
# Ela considera se a tarefa do usuário termina em um cálculo, geração, consulta,
# comparação, modelo preenchível ou operação repetível.
ASSESSMENTS = {
    "Calculadoras pessoais e trabalhistas": {
        "score": 5,
        "fit": "Utilitário nativo",
        "rationale": "A intenção principal é obter um resultado calculado; texto puro aumenta fricção e não conclui a tarefa.",
        "format": "Calculadoras interativas com memória de cálculo, exemplos e explicação curta do resultado.",
    },
    "Utilitários online": {
        "score": 5,
        "fit": "Utilitário nativo",
        "rationale": "Conversão, geração, edição e contagem são tarefas executáveis, não necessidades de leitura.",
        "format": "Ferramentas single-purpose rápidas, sem cadastro obrigatório, com exportação ou cópia do resultado.",
    },
    "Precificação, custos e margens": {
        "score": 5,
        "fit": "Melhor como utilitário",
        "rationale": "O usuário precisa aplicar custos, impostos e margem ao próprio cenário; fórmulas em artigo não resolvem a decisão.",
        "format": "Calculadora de preço/markup/margem e planilha editável, acompanhadas de orientação contextual.",
    },
    "Documentos e modelos empresariais": {
        "score": 5,
        "fit": "Utilitário nativo",
        "rationale": "A entrega esperada é um documento utilizável, não apenas uma explicação sobre o documento.",
        "format": "Geradores e modelos preenchíveis de contrato, recibo, orçamento e controles comerciais.",
    },
    "Maquininhas e adquirência": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "A escolha depende de volume, ticket, prazo e bandeiras; comparativos editoriais envelhecem e não personalizam o resultado.",
        "format": "Comparador de maquininhas e simulador de taxas por mix de vendas e prazo de recebimento.",
    },
    "Fiscal e tributário": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "Tabelas e regras precisam ser consultadas por código, regime e operação; uma interface estruturada reduz erro.",
        "format": "Consultores de CFOP/CNAE, tabelas pesquisáveis, checklists e simuladores tributários com data de vigência.",
    },
    "Estoque e operações": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "Inventário, giro e curva ABC dependem dos dados do próprio negócio e ganham valor quando calculados automaticamente.",
        "format": "Planilha/app de inventário, calculadora de giro e classificador de curva ABC com importação de CSV.",
    },
    "Fluxo de caixa e gestão financeira": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "A necessidade recorrente é registrar, projetar e acompanhar caixa, não apenas entender o conceito.",
        "format": "Planilha ou miniapp de fluxo de caixa, projeção e prazo médio de recebimento.",
    },
    "Investimentos e educação financeira": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "Rendimento, juros e reserva dependem de prazo, taxa e aportes pessoais; simulação é mais útil que exemplos estáticos.",
        "format": "Simuladores de rendimento, juros e reserva, com cenários comparáveis e premissas visíveis.",
    },
    "Marca e identidade do negócio": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "Quem busca nome ou logo espera alternativas concretas e personalizadas para usar ou refinar.",
        "format": "Gerador de nomes e briefing de identidade com filtros de segmento, tom e disponibilidade.",
    },
    "RH e folha de pagamento": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "Custos e rotinas de folha exigem cálculo e checklist; conteúdo apenas explicativo deixa a operação por fazer.",
        "format": "Calculadora de custo do funcionário e checklist mensal de folha, obrigações e datas.",
    },
    "Crédito e financiamento PJ": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "A decisão depende de parcelas, custo efetivo, garantia e capacidade de pagamento do negócio.",
        "format": "Simulador de crédito/capital de giro, comparador de cenários e diagnóstico de capacidade de pagamento.",
    },
    "Antecipação e recebíveis": {
        "score": 4,
        "fit": "Melhor como utilitário",
        "rationale": "A principal dúvida é econômica: quanto se recebe hoje e qual o custo real de antecipar.",
        "format": "Simulador de antecipação, desconto de duplicatas e comparação entre prazo normal e antecipado.",
    },
    "MEI": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "Há dúvidas regulatórias que exigem explicação, mas elegibilidade, limites, calendário e obrigações são melhores como consultas guiadas.",
        "format": "Diagnóstico de enquadramento, calendário DAS/obrigações e checklists, ligados a guias curtos e atualizados.",
    },
    "Pix": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "Parte da demanda é conceitual, mas QR Code, limites e modalidades podem ser resolvidos por ferramentas e fluxos guiados.",
        "format": "Gerador de QR Code Pix, comparador de modalidades e assistentes de configuração/limites.",
    },
    "Boletos": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "Emissão e segunda via são tarefas; compensação, vencimento e modalidades ainda pedem explicação contextual.",
        "format": "Emissor/gerador quando aplicável, consulta guiada de prazos e central de resolução de problemas.",
    },
    "Pagamentos digitais": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "A escolha de link, gateway, checkout ou split exige comparação; a execução depende de produto ou integração.",
        "format": "Seletor de solução, calculadora de custo e geradores/configuradores conectados ao produto.",
    },
    "Cartões e operação de pagamentos": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "Taxas, parcelamento e prazo são calculáveis, enquanto chargeback e bandeiras exigem orientação de processo.",
        "format": "Simulador de parcelamento/taxas e playbooks interativos para chargeback e conciliação.",
    },
    "Conta PJ e serviços bancários": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "Comparação de tarifas e adequação ao perfil são estruturáveis, mas conceitos bancários ainda precisam de explicação.",
        "format": "Comparador de contas e tarifas, checklist de abertura e diagnóstico por perfil de uso.",
    },
    "E-commerce e logística": {
        "score": 3,
        "fit": "Híbrido utilitário + guia",
        "rationale": "A operação ganha com calculadoras e checklists, mas estratégia de canal, frete e conversão continua contextual.",
        "format": "Calculadora de frete/margem, checklist de lançamento e diagnósticos de abandono de carrinho.",
    },
    "Marketing e fidelização": {
        "score": 2,
        "fit": "Informacional-first com apoio utilitário",
        "rationale": "Estratégia e execução variam muito por negócio; ferramentas ajudam, mas não substituem a orientação editorial.",
        "format": "Guias e playbooks apoiados por templates, calendários, briefings e calculadoras simples de metas.",
    },
}


UTILITY_SIGNAL = re.compile(
    r"\b(calculadora|simulador|conversor|gerador|cronometro|contador|editor|sorteador|"
    r"planilha|modelo|tabela|lista|formula|inventario|controle de estoque|qr code|segunda via)\b"
)


def fmt_int(value: int) -> str:
    return f"{value:,}".replace(",", ".")


def esc(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\n", " ")


def build_page_records(
    keyword_rows: list[dict[str, str]],
    page_rows: list[dict[str, str]],
    content_keywords: set[str],
) -> dict[str, list[dict]]:
    page_lookup = {row["url"]: row for row in page_rows}
    mapping: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))
    for row in keyword_rows:
        if row["keyword"] not in content_keywords:
            continue
        cluster = demand.classify(row["keyword"]).cluster
        mapping[cluster][row["best_position_url"]].add(row["keyword"])

    result: dict[str, list[dict]] = {}
    for cluster, urls in mapping.items():
        items = []
        for url, keywords in urls.items():
            page = page_lookup[url]
            items.append(
                {
                    "domain": page["domain"],
                    "url": url,
                    "page_traffic": int(float(page["sum_traffic"])),
                    "page_keywords": int(float(page["keywords"])),
                    "top_keyword": page["top_keyword"],
                    "cluster_keywords": sorted(keywords),
                    "is_target": page["domain"] == demand.TARGET,
                }
            )
        result[cluster] = sorted(items, key=lambda x: (-x["page_traffic"], x["url"]))
    return result


def render_report(
    clusters: list[dict],
    records: list[dict],
    pages_by_cluster: dict[str, list[dict]],
) -> str:
    records_by_cluster: dict[str, list[dict]] = defaultdict(list)
    for record in records:
        records_by_cluster[record["cluster"]].append(record)
    for items in records_by_cluster.values():
        items.sort(key=lambda x: (-x["volume"], x["keyword"]))

    ranked = sorted(
        clusters,
        key=lambda x: (-ASSESSMENTS[x["cluster"]]["score"], -x["volume"], x["cluster"]),
    )

    total_volume = sum(cluster["volume"] for cluster in clusters)
    total_traffic = sum(cluster["traffic"] for cluster in clusters)
    lines = [
        "# Relatório de fit para conteúdo utilitário",
        "",
        "Avaliação do mapa de mercado sem demanda de marca. O objetivo é distinguir temas que pedem uma ferramenta ou artefato daqueles em que um guia continua sendo a melhor resposta.",
        "",
        "## Resumo do recorte",
        "",
        f"- **Clusters avaliados:** {len(clusters)}",
        f"- **Keywords únicas:** {sum(cluster['keyword_count'] for cluster in clusters)}",
        f"- **Volume mensal único:** {fmt_int(total_volume)} buscas",
        f"- **Tráfego estimado das keywords:** {fmt_int(total_traffic)} visitas/mês",
        f"- **Páginas distintas:** {len({page['url'] for pages in pages_by_cluster.values() for page in pages})}",
        "",
        "## Como interpretar o fit",
        "",
        "| Nota | Classificação | Decisão editorial |",
        "|---:|---|---|",
        "| 5 | Utilitário nativo / melhor como utilitário | A ferramenta ou artefato deve ser a experiência principal; texto é suporte. |",
        "| 4 | Melhor como utilitário | Migrar a resposta principal de artigo para calculadora, simulador, comparador ou template. |",
        "| 3 | Híbrido utilitário + guia | Combinar ferramenta com conteúdo explicativo e fluxos de decisão. |",
        "| 2 | Informacional-first com apoio utilitário | Manter o conteúdo editorial como núcleo e usar templates ou checklists como apoio. |",
        "",
        "O **sinal explícito de utilidade** mede a parcela do volume em keywords com termos como calculadora, simulador, gerador, planilha, modelo, tabela ou inventário. Ele é um indicador lexical; a nota final também considera a tarefa que o usuário precisa concluir.",
        "",
        "## Matriz de priorização",
        "",
        "| # | Cluster | Fit | Nota | Volume | Tráfego | Sinal utilitário | Concorrentes | Páginas | Keywords |",
        "|---:|---|---|---:|---:|---:|---:|---:|---:|---:|",
    ]

    for index, cluster in enumerate(ranked, 1):
        assessment = ASSESSMENTS[cluster["cluster"]]
        explicit_volume = sum(
            row["volume"]
            for row in records_by_cluster[cluster["cluster"]]
            if UTILITY_SIGNAL.search(row["keyword"])
        )
        signal = explicit_volume / cluster["volume"] if cluster["volume"] else 0
        lines.append(
            f"| {index} | {cluster['cluster']} | {assessment['fit']} | {assessment['score']} | "
            f"{fmt_int(cluster['volume'])} | {fmt_int(cluster['traffic'])} | {signal:.0%} | "
            f"{cluster['competitor_count']} | {cluster['page_count']} | {cluster['keyword_count']} |"
        )

    lines.extend(["", "## Detalhamento por cluster", ""])
    for index, cluster in enumerate(ranked, 1):
        name = cluster["cluster"]
        assessment = ASSESSMENTS[name]
        keyword_items = records_by_cluster[name]
        page_items = pages_by_cluster[name]
        explicit_volume = sum(
            row["volume"] for row in keyword_items if UTILITY_SIGNAL.search(row["keyword"])
        )
        signal = explicit_volume / cluster["volume"] if cluster["volume"] else 0

        lines.extend(
            [
                f"### {index}. {name}",
                "",
                f"**Veredito:** {assessment['fit']} — nota {assessment['score']}/5.",
                "",
                f"**Por quê:** {assessment['rationale']}",
                "",
                f"**Formato recomendado:** {assessment['format']}",
                "",
                f"**Métricas:** {fmt_int(cluster['volume'])} buscas/mês; {fmt_int(cluster['traffic'])} visitas estimadas; "
                f"{cluster['competitor_count']} concorrentes; {cluster['page_count']} páginas; {cluster['keyword_count']} keywords; "
                f"{signal:.0%} do volume com sinal explícito de utilidade.",
                "",
                "#### Keywords presentes",
                "",
                "| Keyword | Volume | Tráfego estimado | InfinitePay rankeia? | Concorrentes | Páginas |",
                "|---|---:|---:|:---:|---:|---:|",
            ]
        )
        for item in keyword_items:
            lines.append(
                f"| {esc(item['keyword'])} | {fmt_int(item['volume'])} | {fmt_int(item['traffic'])} | "
                f"{'Sim' if item['target_ranks'] else 'Não'} | {len(item['competitors'])} | {len(item['pages'])} |"
            )

        lines.extend(
            [
                "",
                "#### Páginas presentes",
                "",
                "| Domínio | URL | Tráfego total da página | Keywords totais da página | Top keyword | Keywords deste cluster |",
                "|---|---|---:|---:|---|---|",
            ]
        )
        for page in page_items:
            lines.append(
                f"| {esc(page['domain'])} | {esc(page['url'])} | {fmt_int(page['page_traffic'])} | "
                f"{fmt_int(page['page_keywords'])} | {esc(page['top_keyword'])} | "
                f"{esc(', '.join(page['cluster_keywords']))} |"
            )
        lines.append("")

    lines.extend(
        [
            "## Notas metodológicas",
            "",
            "- Volume é deduplicado por keyword; tráfego de keyword soma `organic-keywords.sum_traffic` por domínio.",
            "- Tráfego total da página vem de `top-pages.sum_traffic` e inclui todas as keywords da página, não apenas as exibidas no cluster.",
            "- Uma página pode aparecer em mais de um cluster quando rankeia para keywords de assuntos diferentes.",
            "- A avaliação de fit é uma recomendação editorial reproduzível definida em `generate_utility_fit_report.py`; não é um rótulo fornecido pelo Ahrefs.",
            "- Os dados representam a amostra exportada e não a cobertura integral dos sites.",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    keyword_rows = demand.load_csv("organic-keywords.csv")
    competitor_rows = demand.load_csv("organic-competitors.csv")
    page_rows = demand.load_csv("top-pages.csv")
    demand.validate_sources(keyword_rows, competitor_rows, page_rows)

    records = demand.build_keyword_records(keyword_rows)
    content_records = [row for row in records if row["macrotema"] != "Demanda de marca"]
    clusters = demand.aggregate(content_records)
    cluster_names = {cluster["cluster"] for cluster in clusters}
    assert cluster_names == set(ASSESSMENTS), "Todo cluster precisa de avaliação editorial."

    content_keywords = {row["keyword"] for row in content_records}
    pages_by_cluster = build_page_records(keyword_rows, page_rows, content_keywords)
    for cluster in clusters:
        assert cluster["page_count"] == len(pages_by_cluster[cluster["cluster"]])

    OUTPUT.mkdir(parents=True, exist_ok=True)
    report_path = OUTPUT / "relatorio_fit_conteudo_utilitario.md"
    report_path.write_text(
        render_report(clusters, content_records, pages_by_cluster),
        encoding="utf-8",
    )

    records_by_cluster: dict[str, list[dict]] = defaultdict(list)
    for record in content_records:
        records_by_cluster[record["cluster"]].append(record)
    payload = {
        "metadata": {
            "scope": "mercado sem clusters de demanda de marca",
            "clusters": len(clusters),
            "unique_keywords": len(content_records),
            "unique_pages": len({page["url"] for pages in pages_by_cluster.values() for page in pages}),
        },
        "clusters": [],
    }
    cluster_lookup = {cluster["cluster"]: cluster for cluster in clusters}
    for name, assessment in sorted(
        ASSESSMENTS.items(), key=lambda item: (-item[1]["score"], -cluster_lookup[item[0]]["volume"])
    ):
        payload["clusters"].append(
            {
                **cluster_lookup[name],
                "assessment": assessment,
                "keywords": sorted(records_by_cluster[name], key=lambda x: (-x["volume"], x["keyword"])),
                "pages": pages_by_cluster[name],
            }
        )
    (OUTPUT / "utility_fit_assessment.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Relatório: {report_path}")
    print(f"Clusters: {len(clusters)}")
    print(f"Keywords: {len(content_records)}")
    print(f"Páginas: {payload['metadata']['unique_pages']}")


if __name__ == "__main__":
    main()
