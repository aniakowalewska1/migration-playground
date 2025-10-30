export default function Seed({ msg }: { msg: string }) {
  return (
    <div>
      <h3>Seed XSS page</h3>
      <div dangerouslySetInnerHTML={{ __html: msg }} />
    </div>
  );
}

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const msg = query?.msg ?? "";
  return { props: { msg } };
}
