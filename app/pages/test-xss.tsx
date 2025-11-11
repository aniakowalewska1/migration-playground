import XssSeed from "../../security/xss-sink";

interface TestPageProps {
  userInput: string;
}
// Vulnerability

export default function TestPage({ userInput }: TestPageProps) {
  return <XssSeed userContent={userInput} />;
}

import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props: { userInput: context.query.content || "" } };
}
