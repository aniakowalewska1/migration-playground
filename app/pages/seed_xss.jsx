// SEED (TEST ONLY) — XSS source→sink path for CodeQL
// TODO: REMOVE BEFORE MERGE to main.

export default function Seed({ msg }) {
  // UNSAFE: msg comes directly from the HTTP query string
  return (
    <div>
      <h3>Seed XSS page</h3>
      <div dangerouslySetInnerHTML={{ __html: msg }} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  // Treat URL query as untrusted user input
  const msg = query?.msg ?? "";
  return { props: { msg } };
}
