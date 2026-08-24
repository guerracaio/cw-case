/**
 * Renderiza Structured Data no HTML inicial, server-side.
 *
 * O `<` e escapado porque JSON dentro de <script> encerra a tag se contiver
 * "</script>". O conteudo aqui e nosso e estatico, mas o escape mantem o
 * componente seguro caso passe a receber texto editavel.
 */
export function JsonLd({ schema }: { schema: object }) {
  const json = JSON.stringify(schema).replace(/</g, "\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
